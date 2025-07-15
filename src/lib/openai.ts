import OpenAI from "openai";
import { Meal } from "../types/meal";
import { z } from "zod";
import { MEAL_JSON_SCHEMA, MEAL_INSTRUCTIONS } from "./schemas";

export interface ConversationHistory {
  role: "user" | "assistant";
  content: string;
}

export class MealPlannerAI {
  private openai: OpenAI;
  private history: ConversationHistory[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({ 
      apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 1   // Reduce retries for faster failure
    });
  }

  async generateMeals(
    userPrompt: string,
    retryAttempt = false
  ): Promise<Meal[]> {
    const startTime = Date.now();
    
    // Use shared schema for consistency and performance
    const mealsResponseSchema = z.object({
      meals: Meal.array()
    });

    // Prepare the input with limited conversation history for better performance
    const prompt = retryAttempt
      ? `**Fix the JSON so it matches the schema exactly.** ${userPrompt}`
      : userPrompt;

    const input = this.buildOptimizedInputWithHistory(prompt);

    try {
      const response = await this.openai.responses.create({
        model: "gpt-4o-mini",
        instructions: MEAL_INSTRUCTIONS,
        text: {
          format: {
            type: "json_schema",
            name: "meals",
            schema: MEAL_JSON_SCHEMA,
          }
        },
        input,
      });

      const outputText = response.output_text;
      if (!outputText) {
        throw new Error("No output received from OpenAI");
      }

      // Add to conversation history (limit to prevent bloat)
      this.addToHistory(userPrompt, outputText);

      // Parse and validate the response
      const parsedData = JSON.parse(outputText);
      const validatedResponse = mealsResponseSchema.parse(parsedData);
      const meals = validatedResponse.meals;

      // Log performance metrics only in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        const duration = Date.now() - startTime;
        console.log(`OpenAI request completed in ${duration}ms`);
      }

      return meals;
    } catch (error) {
      // If this is our first attempt and we got a parsing error, try once more
      if (!retryAttempt && (error instanceof z.ZodError || error instanceof SyntaxError)) {
        // Only log retry attempt in non-test environments
        if (process.env.NODE_ENV !== 'test') {
          console.warn("First attempt failed, retrying with schema fix prompt:", error.message);
        }
        return this.generateMeals(userPrompt, true);
      }
      
      // Only log errors in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        const duration = Date.now() - startTime;
        console.error(`OpenAI request failed after ${duration}ms:`, error);
      }
      
      // If retry also failed or it's a different error, throw it
      throw error;
    }
  }

  async editMeals(editPrompt: string): Promise<Meal[]> {
    return this.generateMeals(editPrompt);
  }

  async rerollSingleMeal(
    originalPrompt: string,
    dayToReroll: string,
    existingMealNames: string[]
  ): Promise<Meal> {
    const rerollPrompt = `Replace the ${dayToReroll} meal with ONE different meal suggestion. Original request: "${originalPrompt}". Avoid duplicating these existing meals: ${existingMealNames.join(', ')}. Return exactly one meal for ${dayToReroll}.`;
    
    const meals = await this.generateMeals(rerollPrompt);
    
    // Find the meal for the requested day, or return the first meal if no day match
    const rerolledMeal = meals.find(meal => meal.day === dayToReroll) || meals[0];
    
    if (!rerolledMeal) {
      throw new Error('No meal generated for reroll');
    }
    
    return rerolledMeal;
  }

  clearHistory(): void {
    this.history = [];
  }

  getHistory(): ConversationHistory[] {
    return [...this.history];
  }

  private buildOptimizedInputWithHistory(currentPrompt: string): string {
    if (this.history.length === 0) {
      return currentPrompt;
    }

    // Limit history to last 2 exchanges to prevent context bloat
    const recentHistory = this.history.slice(-4); // Last 2 user+assistant pairs
    const historyString = recentHistory
      .map(entry => `${entry.role}: ${entry.content}`)
      .join("\n\n");

    return `${historyString}\n\nuser: ${currentPrompt}`;
  }

  private addToHistory(userPrompt: string, assistantResponse: string): void {
    this.history.push({ role: "user", content: userPrompt });
    this.history.push({ role: "assistant", content: assistantResponse });
    
    // Keep only last 6 exchanges (12 entries) to prevent memory bloat
    if (this.history.length > 12) {
      this.history = this.history.slice(-12);
    }
  }

  private buildInputWithHistory(currentPrompt: string): string {
    return this.buildOptimizedInputWithHistory(currentPrompt);
  }
}