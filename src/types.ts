// Meal planning types
export type MealState = 'loading' | 'suggested' | 'accepted';

export interface MealIdea {
  title: string;
  summary: string;
  recipe_steps: string[];
  ingredients: string[];
  state: MealState;
}

export interface MealSlot {
  id: number;
  idea?: MealIdea;
}