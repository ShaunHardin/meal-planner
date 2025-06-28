import OpenAI from "openai";
import { Meal } from "../types/meal";
import { z } from "zod";

export interface ConversationHistory {
  role: "user" | "assistant";
  content: string;
}

export class MealPlannerAI {
  private openai: OpenAI;
  private history: ConversationHistory[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateMeals(
    userPrompt: string,
    retryAttempt = false
  ): Promise<Meal[]> {
    // Build the JSON schema manually since zodToJsonSchema may not work correctly
    const mealsResponseSchema = z.object({
      meals: Meal.array()
    });
    const jsonSchema = {
      type: "object",
      properties: {
        meals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              day: { 
                type: "string", 
                enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
              },
              name: { type: "string" },
              description: { type: "string" },
              prepMinutes: { type: "number" },
              cookMinutes: { type: "number" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item: { type: "string" },
                    quantity: { type: "string" }
                  },
                  required: ["item", "quantity"],
                  additionalProperties: false
                },
                minItems: 1
              },
              steps: {
                type: "array",
                items: { type: "string" },
                minItems: 1
              },
              tags: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["id", "day", "name", "description", "prepMinutes", "cookMinutes", "ingredients", "steps"],
            additionalProperties: false
          }
        }
      },
      required: ["meals"],
      additionalProperties: false
    };

    // Prepare the input with conversation history
    const prompt = retryAttempt
      ? `**Fix the JSON so it matches the schema exactly.** ${userPrompt}`
      : userPrompt;

    const input = this.buildInputWithHistory(prompt);

    try {
      const response = await this.openai.responses.create({
        model: "gpt-4o-mini",
        instructions:
          "You are an expert meal-planning engine. Return ONLY JSON that matches the schema. Return an object with a 'meals' array containing meal objects. Each meal should have a unique ID, be assigned to a specific day, and include complete cooking information with ingredients and step-by-step instructions.",
        text: {
          format: {
            type: "json_schema",
            name: "meals",
            schema: jsonSchema,
          }
        },
        input,
      });

      const outputText = response.output_text;
      if (!outputText) {
        throw new Error("No output received from OpenAI");
      }

      // Add to conversation history
      this.history.push({ role: "user", content: userPrompt });
      this.history.push({ role: "assistant", content: outputText });

      // Parse and validate the response
      const parsedData = JSON.parse(outputText);
      const validatedResponse = mealsResponseSchema.parse(parsedData);
      const meals = validatedResponse.meals;

      return meals;
    } catch (error) {
      // If this is our first attempt and we got a parsing error, try once more
      if (!retryAttempt && error instanceof Error) {
        console.warn("First attempt failed, retrying with schema fix prompt:", error.message);
        return this.generateMeals(userPrompt, true);
      }
      
      // If retry also failed or it's a different error, throw it
      throw error;
    }
  }

  async editMeals(editPrompt: string): Promise<Meal[]> {
    return this.generateMeals(editPrompt);
  }

  clearHistory(): void {
    this.history = [];
  }

  getHistory(): ConversationHistory[] {
    return [...this.history];
  }

  private buildInputWithHistory(currentPrompt: string): string {
    if (this.history.length === 0) {
      return currentPrompt;
    }

    const historyString = this.history
      .map(entry => `${entry.role}: ${entry.content}`)
      .join("\n\n");

    return `${historyString}\n\nuser: ${currentPrompt}`;
  }
}