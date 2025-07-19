import { supabase, getCurrentUser, isSupabaseConfigured } from '../lib/db';
import { Plan, DatabaseError } from '../types/plan';
import { Meal } from '../types/meal';
import { formatWeekStart, getCurrentMondayDate } from '../utils/date-helpers';
import { z } from 'zod';

/**
 * Service for managing meal plan persistence to Supabase
 */
export class MealPlanService {
  /**
   * Save a meal plan for a specific week
   * @param weekStart - Monday date of the week
   * @param meals - Array of meals to save
   * @returns Promise<Plan> - The saved plan
   * @throws DatabaseError if save fails
   */
  static async savePlan(weekStart: Date, meals: Meal[]): Promise<Plan> {
    // Validate inputs
    if (!weekStart || isNaN(weekStart.getTime())) {
      throw new DatabaseError({
        message: 'Invalid week start date',
        code: 'INVALID_INPUT'
      });
    }
    
    if (!meals || meals.length === 0) {
      throw new DatabaseError({
        message: 'Cannot save empty meal plan',
        code: 'INVALID_INPUT'
      });
    }
    
    // Validate meal structure with Zod
    try {
      z.array(Meal).parse(meals);
    } catch (error) {
      throw new DatabaseError({
        message: 'Invalid meal data structure',
        code: 'INVALID_INPUT',
        details: error instanceof Error ? error.message : 'Meal validation failed'
      });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new DatabaseError({
        message: 'Supabase is not configured. Please set up your environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      });
    }

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new DatabaseError({
        message: 'User not authenticated. Please log in to save meal plans.',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    const weekStartStr = formatWeekStart(weekStart);

    try {
      const now = new Date().toISOString();
      
      // Use upsert pattern to reduce database roundtrips
      const { data, error } = await supabase
        .from('plans')
        .upsert({
          user_id: user.id,
          week_start: weekStartStr,
          meals: meals,
          updated_at: now,
        }, {
          onConflict: 'user_id,week_start'
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError({
          message: `Failed to save meal plan: ${error.message}`,
          code: error.code,
          details: error.details
        });
      }

      return {
        id: data.id,
        user_id: data.user_id,
        week_start: data.week_start,
        meals: data.meals,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError({
        message: `Unexpected error saving meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'UNEXPECTED_ERROR'
      });
    }
  }

  /**
   * Load a meal plan for a specific week
   * @param weekStart - Monday date of the week
   * @returns Promise<Plan | null> - The loaded plan or null if not found
   * @throws DatabaseError if load fails
   */
  static async getPlanByWeek(weekStart: Date): Promise<Plan | null> {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new DatabaseError({
        message: 'Supabase is not configured. Please set up your environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      });
    }

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new DatabaseError({
        message: 'User not authenticated. Please log in to load meal plans.',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    const weekStartStr = formatWeekStart(weekStart);

    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStartStr)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        
        throw new DatabaseError({
          message: `Failed to load meal plan: ${error.message}`,
          code: error.code,
          details: error.details
        });
      }

      return {
        id: data.id,
        user_id: data.user_id,
        week_start: data.week_start,
        meals: data.meals,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError({
        message: `Unexpected error loading meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'UNEXPECTED_ERROR'
      });
    }
  }

  /**
   * Load the current week's meal plan
   * @returns Promise<Plan | null> - The current week's plan or null if not found
   */
  static async getCurrentWeekPlan(): Promise<Plan | null> {
    const currentMonday = getCurrentMondayDate();
    return this.getPlanByWeek(currentMonday);
  }

  /**
   * Delete a meal plan
   * @param planId - ID of the plan to delete
   * @returns Promise<void>
   * @throws DatabaseError if delete fails
   */
  static async deletePlan(planId: string): Promise<void> {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new DatabaseError({
        message: 'Supabase is not configured. Please set up your environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      });
    }

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new DatabaseError({
        message: 'User not authenticated. Please log in to delete meal plans.',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id); // Ensure user can only delete their own plans

      if (error) {
        throw new DatabaseError({
          message: `Failed to delete meal plan: ${error.message}`,
          code: error.code,
          details: error.details
        });
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError({
        message: `Unexpected error deleting meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'UNEXPECTED_ERROR'
      });
    }
  }

  /**
   * Get all meal plans for the current user
   * @returns Promise<Plan[]> - Array of all user's plans
   * @throws DatabaseError if load fails
   */
  static async getUserPlans(): Promise<Plan[]> {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new DatabaseError({
        message: 'Supabase is not configured. Please set up your environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      });
    }

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new DatabaseError({
        message: 'User not authenticated. Please log in to load meal plans.',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false });

      if (error) {
        throw new DatabaseError({
          message: `Failed to load meal plans: ${error.message}`,
          code: error.code,
          details: error.details
        });
      }

      return data.map(plan => ({
        id: plan.id,
        user_id: plan.user_id,
        week_start: plan.week_start,
        meals: plan.meals,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
      }));
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError({
        message: `Unexpected error loading meal plans: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'UNEXPECTED_ERROR'
      });
    }
  }
}