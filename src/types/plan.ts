import { z } from "zod";
import { Meal } from "./meal";

export const Plan = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  week_start: z.string(), // ISO date string for Monday of the week
  meals: z.array(Meal),
  created_at: z.string(), // ISO timestamp
  updated_at: z.string(), // ISO timestamp
});

export type Plan = z.infer<typeof Plan>;

// API response types
export const SavePlanRequest = z.object({
  week_start: z.string(),
  meals: z.array(Meal),
});

export const SavePlanResponse = z.object({
  success: z.boolean(),
  plan: Plan.optional(),
  error: z.string().optional(),
});

export const LoadPlanResponse = z.object({
  success: z.boolean(),
  plan: Plan.optional(),
  error: z.string().optional(),
});

export type SavePlanRequest = z.infer<typeof SavePlanRequest>;
export type SavePlanResponse = z.infer<typeof SavePlanResponse>;
export type LoadPlanResponse = z.infer<typeof LoadPlanResponse>;

// Database error types
export class DatabaseError extends Error {
  code?: string;
  details?: string;

  constructor(options: { message: string; code?: string; details?: string }) {
    super(options.message);
    this.name = 'DatabaseError';
    this.code = options.code;
    this.details = options.details;
  }
}