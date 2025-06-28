import { z } from "zod";

export const Ingredient = z.object({
  item: z.string(),
  quantity: z.string(),
});

export const Meal = z.object({
  id: z.string(),
  day: z.enum(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),
  name: z.string(),
  description: z.string(),
  prepMinutes: z.number(),
  cookMinutes: z.number(),
  ingredients: Ingredient.array().min(1),
  steps: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
});

export type Ingredient = z.infer<typeof Ingredient>;
export type Meal = z.infer<typeof Meal>;