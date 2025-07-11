import { describe, it, expect } from 'vitest';
import { Meal, Ingredient } from '../meal';

describe('Meal Type Validation', () => {
  const validIngredient: Ingredient = {
    item: 'chicken breast',
    quantity: '2 pieces'
  };

  const validMeal: Meal = {
    id: 'meal-1',
    day: 'Mon',
    name: 'Grilled Chicken',
    description: 'A healthy grilled chicken dinner',
    prepMinutes: 15,
    cookMinutes: 20,
    ingredients: [validIngredient],
    steps: ['Season chicken', 'Grill for 20 minutes']
  };

  describe('Ingredient validation', () => {
    it('validates schema with Zod', () => {
      const result = Ingredient.safeParse(validIngredient);
      expect(result.success).toBe(true);
    });

    it('requires item field', () => {
      const invalid = { quantity: '1 cup' };
      const result = Ingredient.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('requires quantity field', () => {
      const invalid = { item: 'flour' };
      const result = Ingredient.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('validates string types', () => {
      const invalid = { item: 123, quantity: true };
      const result = Ingredient.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Meal validation', () => {
    it('validates complete meal schema', () => {
      const result = Meal.safeParse(validMeal);
      expect(result.success).toBe(true);
    });

    it('requires all mandatory fields', () => {
      const incomplete = {
        id: 'meal-1',
        name: 'Test Meal'
        // Missing other required fields
      };
      const result = Meal.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it('validates day enum values', () => {
      const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      validDays.forEach(day => {
        const meal = { ...validMeal, day };
        expect(Meal.safeParse(meal).success).toBe(true);
      });

      const invalidDay = { ...validMeal, day: 'Monday' };
      expect(Meal.safeParse(invalidDay).success).toBe(false);
    });

    it('validates number types for minutes', () => {
      const invalidPrep = { ...validMeal, prepMinutes: '15' };
      expect(Meal.safeParse(invalidPrep).success).toBe(false);

      const invalidCook = { ...validMeal, cookMinutes: '20' };
      expect(Meal.safeParse(invalidCook).success).toBe(false);
    });

    it('requires at least one ingredient', () => {
      const noIngredients = { ...validMeal, ingredients: [] };
      const result = Meal.safeParse(noIngredients);
      expect(result.success).toBe(false);
    });

    it('requires at least one step', () => {
      const noSteps = { ...validMeal, steps: [] };
      const result = Meal.safeParse(noSteps);
      expect(result.success).toBe(false);
    });


    it('validates ingredient array items', () => {
      const invalidIngredients = {
        ...validMeal,
        ingredients: [
          { item: 'chicken', quantity: '1 lb' },
          { item: 'salt' } // Missing quantity
        ]
      };
      const result = Meal.safeParse(invalidIngredients);
      expect(result.success).toBe(false);
    });

    it('validates steps as string array', () => {
      const invalidSteps = {
        ...validMeal,
        steps: ['Season chicken', 123, 'Serve']
      };
      const result = Meal.safeParse(invalidSteps);
      expect(result.success).toBe(false);
    });
  });

  describe('Type inference', () => {
    it('correctly infers Ingredient type', () => {
      const ingredient: Ingredient = {
        item: 'tomato',
        quantity: '2 cups'
      };
      
      // TypeScript compilation validates type structure
      expect(ingredient.item).toBe('tomato');
      expect(ingredient.quantity).toBe('2 cups');
    });

    it('correctly infers Meal type', () => {
      const meal: Meal = validMeal;
      
      // TypeScript compilation validates type structure
      expect(meal.id).toBe('meal-1');
      expect(meal.day).toBe('Mon');
    });
  });
});