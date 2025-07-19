import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MealPlanService } from '../meal-plan-service';
import { Meal } from '../../types/meal';
import { Plan } from '../../types/plan';
import * as db from '../../lib/db';

// Mock the db module
vi.mock('../../lib/db', () => {
  const mockSupabase = {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  };
  
  return {
    supabase: mockSupabase,
    getCurrentUser: vi.fn(),
    isSupabaseConfigured: vi.fn(),
  };
});

describe('MealPlanService', () => {
  const mockMeals: Meal[] = [
    {
      id: 'meal-1',
      day: 'Mon',
      name: 'Test Meal',
      description: 'Test Description',
      prepMinutes: 15,
      cookMinutes: 30,
      ingredients: [{ item: 'Test Ingredient', quantity: '1 cup' }],
      steps: ['Test Step 1', 'Test Step 2'],
    },
  ];

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockPlan: Plan = {
    id: 'plan-123',
    user_id: 'user-123',
    week_start: '2024-12-16',
    meals: mockMeals,
    created_at: '2024-12-16T00:00:00Z',
    updated_at: '2024-12-16T00:00:00Z',
  };

  // Get references to mocked functions
  const mockSupabase = {
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks for successful operations
    vi.mocked(db.isSupabaseConfigured).mockReturnValue(true);
    vi.mocked(db.getCurrentUser).mockResolvedValue(mockUser);
    
    // Mock supabase with proper typing
    const mockSupabaseTyped = db.supabase as typeof db.supabase & { from: ReturnType<typeof vi.fn> };
    mockSupabaseTyped.from = mockSupabase.from;
  });

  describe('savePlan', () => {
    const weekStart = new Date('2024-12-16');

    it('should save a new plan successfully', async () => {
      const mockUpsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'plan-123',
              user_id: 'user-123',
              week_start: '2024-12-16',
              meals: mockMeals,
              created_at: '2024-12-16T00:00:00Z',
              updated_at: '2024-12-16T00:00:00Z',
            },
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      const result = await MealPlanService.savePlan(weekStart, mockMeals);

      expect(result).toEqual(mockPlan);
      expect(mockSupabase.from).toHaveBeenCalledWith('plans');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          week_start: '2024-12-16',
          meals: mockMeals,
        }),
        { onConflict: 'user_id,week_start' }
      );
    });

    it('should handle upsert with existing plan', async () => {
      const mockUpsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'existing-plan',
              user_id: 'user-123',
              week_start: '2024-12-16',
              meals: mockMeals,
              created_at: '2024-12-15T00:00:00Z',
              updated_at: '2024-12-16T01:00:00Z',
            },
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      const result = await MealPlanService.savePlan(weekStart, mockMeals);

      expect(result.id).toBe('existing-plan');
      expect(result.meals).toEqual(mockMeals);
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          week_start: '2024-12-16',
          meals: mockMeals,
        }),
        { onConflict: 'user_id,week_start' }
      );
    });

    it('should throw error when Supabase is not configured', async () => {
      vi.mocked(db.isSupabaseConfigured).mockReturnValue(false);

      await expect(MealPlanService.savePlan(weekStart, mockMeals)).rejects.toThrow(
        'Supabase is not configured'
      );
    });

    it('should throw error when user is not authenticated', async () => {
      vi.mocked(db.getCurrentUser).mockResolvedValue(null);

      await expect(MealPlanService.savePlan(weekStart, mockMeals)).rejects.toThrow(
        'User not authenticated'
      );
    });

    it('should throw DatabaseError on upsert failure', async () => {
      const mockUpsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: {
              message: 'Database constraint violation',
              code: 'PGRST202',
              details: 'Some details',
            },
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await expect(MealPlanService.savePlan(weekStart, mockMeals)).rejects.toThrow(
        'Failed to save meal plan: Database constraint violation'
      );
    });

    it('should throw error for invalid weekStart date', async () => {
      const invalidDate = new Date('invalid');

      await expect(MealPlanService.savePlan(invalidDate, mockMeals)).rejects.toThrow(
        'Invalid week start date'
      );
    });

    it('should throw error for empty meals array', async () => {
      await expect(MealPlanService.savePlan(weekStart, [])).rejects.toThrow(
        'Cannot save empty meal plan'
      );
    });

    it('should throw error for invalid meal data', async () => {
      // Create invalid meal data that will fail Zod validation
      const invalidMeals = [{ invalid: 'data' }] as unknown as Meal[];

      await expect(MealPlanService.savePlan(weekStart, invalidMeals)).rejects.toThrow(
        'Invalid meal data structure'
      );
    });
  });

  describe('getPlanByWeek', () => {
    const weekStart = new Date('2024-12-16');

    it('should load plan successfully', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'plan-123',
                user_id: 'user-123',
                week_start: '2024-12-16',
                meals: mockMeals,
                created_at: '2024-12-16T00:00:00Z',
                updated_at: '2024-12-16T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const result = await MealPlanService.getPlanByWeek(weekStart);

      expect(result).toEqual(mockPlan);
    });

    it('should return null when no plan exists', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'No rows returned' },
            }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const result = await MealPlanService.getPlanByWeek(weekStart);

      expect(result).toBeNull();
    });

    it('should throw error when Supabase is not configured', async () => {
      vi.mocked(db.isSupabaseConfigured).mockReturnValue(false);

      await expect(MealPlanService.getPlanByWeek(weekStart)).rejects.toThrow(
        'Supabase is not configured'
      );
    });

    it('should throw error when user is not authenticated', async () => {
      vi.mocked(db.getCurrentUser).mockResolvedValue(null);

      await expect(MealPlanService.getPlanByWeek(weekStart)).rejects.toThrow(
        'User not authenticated'
      );
    });
  });

  describe('getCurrentWeekPlan', () => {
    it('should get plan for current week', async () => {
      // Mock getCurrentMondayDate
      vi.doMock('../../utils/date-helpers', () => ({
        getCurrentMondayDate: () => new Date('2024-12-16'),
        formatWeekStart: () => '2024-12-16',
      }));

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'plan-123',
                user_id: 'user-123',
                week_start: '2024-12-16',
                meals: mockMeals,
                created_at: '2024-12-16T00:00:00Z',
                updated_at: '2024-12-16T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const result = await MealPlanService.getCurrentWeekPlan();

      expect(result).toEqual(mockPlan);
    });
  });

  describe('deletePlan', () => {
    it('should delete plan successfully', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      });

      await expect(MealPlanService.deletePlan('plan-123')).resolves.toBeUndefined();

      expect(mockDelete).toHaveBeenCalled();
    });

    it('should throw error when delete fails', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: {
              message: 'Permission denied',
              code: 'PGRST403',
            },
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      });

      await expect(MealPlanService.deletePlan('plan-123')).rejects.toThrow(
        'Failed to delete meal plan: Permission denied'
      );
    });
  });

  describe('getUserPlans', () => {
    it('should get all user plans successfully', async () => {
      const mockPlans = [mockPlan, { ...mockPlan, id: 'plan-456', week_start: '2024-12-23' }];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockPlans,
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const result = await MealPlanService.getUserPlans();

      expect(result).toEqual(mockPlans);
    });

    it('should throw error when load fails', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: {
              message: 'Connection error',
              code: 'PGRST001',
            },
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      await expect(MealPlanService.getUserPlans()).rejects.toThrow(
        'Failed to load meal plans: Connection error'
      );
    });
  });
});