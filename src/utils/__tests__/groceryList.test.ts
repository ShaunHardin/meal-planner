import { describe, it, expect } from 'vitest';
import { createGroceryList } from '../groceryList';
import { Meal } from '../../types/meal';

describe('createGroceryList', () => {
  const mockMeals: Meal[] = [
    {
      id: '1',
      day: 'Mon',
      name: 'Pasta with Vegetables',
      description: 'Delicious pasta',
      prepMinutes: 10,
      cookMinutes: 20,
      ingredients: [
        { item: 'Olive oil', quantity: '2 tbsp' },
        { item: 'Garlic', quantity: '3 cloves' },
        { item: 'Mixed vegetables', quantity: '2 cups' }
      ],
      steps: ['Cook pasta', 'Sauté vegetables']
    },
    {
      id: '2',
      day: 'Tue',
      name: 'Chicken Stir-fry',
      description: 'Quick stir-fry',
      prepMinutes: 15,
      cookMinutes: 10,
      ingredients: [
        { item: 'Chicken breast', quantity: '1 lb' },
        { item: 'Olive oil', quantity: '1 tbsp' },
        { item: 'Mixed vegetables', quantity: '1 cup' }
      ],
      steps: ['Cook chicken', 'Add vegetables']
    }
  ];

  it('combines ingredients from multiple meals', () => {
    const groceryList = createGroceryList(mockMeals);
    
    expect(groceryList).toHaveLength(4);
    expect(groceryList.map(item => item.item)).toEqual([
      'Chicken breast',
      'Garlic',
      'Mixed vegetables', 
      'Olive oil'
    ]);
  });

  it('combines quantities for same ingredients', () => {
    const groceryList = createGroceryList(mockMeals);
    
    const oliveOilItem = groceryList.find(item => item.item === 'Olive oil');
    expect(oliveOilItem?.quantity).toBe('3 tablespoons');
    expect(oliveOilItem?.originalQuantities).toEqual(['2 tbsp', '1 tbsp']);

    const mixedVegItem = groceryList.find(item => item.item === 'Mixed vegetables');
    expect(mixedVegItem?.quantity).toBe('3 cups');
    expect(mixedVegItem?.originalQuantities).toEqual(['2 cups', '1 cup']);
  });

  it('handles single ingredient without combining', () => {
    const groceryList = createGroceryList(mockMeals);
    
    const chickenItem = groceryList.find(item => item.item === 'Chicken breast');
    expect(chickenItem?.quantity).toBe('1 lb');
    expect(chickenItem?.originalQuantities).toEqual(['1 lb']);
  });

  it('handles fractional quantities', () => {
    const mealsWithFractions: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Recipe 1',
        description: 'Test recipe',
        prepMinutes: 10,
        cookMinutes: 20,
        ingredients: [
          { item: 'Flour', quantity: '1/2 cup' },
          { item: 'Sugar', quantity: '1/4 cup' }
        ],
        steps: ['Mix ingredients']
      },
      {
        id: '2',
        day: 'Tue',
        name: 'Recipe 2',
        description: 'Test recipe',
        prepMinutes: 10,
        cookMinutes: 20,
        ingredients: [
          { item: 'Flour', quantity: '1/4 cup' },
          { item: 'Sugar', quantity: '1/4 cup' }
        ],
        steps: ['Mix ingredients']
      }
    ];

    const groceryList = createGroceryList(mealsWithFractions);
    
    const flourItem = groceryList.find(item => item.item === 'Flour');
    expect(flourItem?.quantity).toBe('3/4 cups');
    
    const sugarItem = groceryList.find(item => item.item === 'Sugar');
    expect(sugarItem?.quantity).toBe('1/2 cups');
  });

  it('handles non-measurable ingredients', () => {
    const mealsWithNonMeasurable: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Salad',
        description: 'Fresh salad',
        prepMinutes: 5,
        cookMinutes: 0,
        ingredients: [
          { item: 'Lettuce', quantity: '1 head' },
          { item: 'Tomatoes', quantity: '2 medium' },
          { item: 'Avocado', quantity: '1 medium' }
        ],
        steps: ['Chop vegetables']
      },
      {
        id: '2',
        day: 'Tue',
        name: 'Another Salad',
        description: 'Another fresh salad',
        prepMinutes: 5,
        cookMinutes: 0,
        ingredients: [
          { item: 'Lettuce', quantity: '1 head' },
          { item: 'Avocado', quantity: '1 medium' }
        ],
        steps: ['Chop vegetables']
      }
    ];

    const groceryList = createGroceryList(mealsWithNonMeasurable);
    
    const lettuceItem = groceryList.find(item => item.item === 'Lettuce');
    expect(lettuceItem?.quantity).toBe('1 head, 1 head');
    
    const avocadoItem = groceryList.find(item => item.item === 'Avocado');
    expect(avocadoItem?.quantity).toBe('1 medium, 1 medium');
  });

  it('normalizes item names case-insensitively', () => {
    const mealsWithCaseVariations: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Recipe 1',
        description: 'Test recipe',
        prepMinutes: 10,
        cookMinutes: 20,
        ingredients: [
          { item: 'olive oil', quantity: '1 tbsp' },
          { item: 'GARLIC', quantity: '2 cloves' }
        ],
        steps: ['Cook']
      },
      {
        id: '2',
        day: 'Tue',
        name: 'Recipe 2',
        description: 'Test recipe',
        prepMinutes: 10,
        cookMinutes: 20,
        ingredients: [
          { item: 'Olive Oil', quantity: '2 tbsp' },
          { item: 'garlic', quantity: '1 clove' }
        ],
        steps: ['Cook']
      }
    ];

    const groceryList = createGroceryList(mealsWithCaseVariations);
    
    expect(groceryList).toHaveLength(2);
    
    const oliveOilItem = groceryList.find(item => item.item === 'Olive oil');
    expect(oliveOilItem?.quantity).toBe('3 tablespoons');
    
    const garlicItem = groceryList.find(item => item.item === 'Garlic');
    expect(garlicItem?.quantity).toBe('3 cloves');
  });

  it('sorts grocery items alphabetically', () => {
    const groceryList = createGroceryList(mockMeals);
    const itemNames = groceryList.map(item => item.item);
    
    expect(itemNames).toEqual(['Chicken breast', 'Garlic', 'Mixed vegetables', 'Olive oil']);
  });

  it('handles empty meals array', () => {
    const groceryList = createGroceryList([]);
    expect(groceryList).toHaveLength(0);
  });

  it('handles meals with no ingredients', () => {
    const mealsWithNoIngredients: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Water',
        description: 'Just water',
        prepMinutes: 0,
        cookMinutes: 0,
        ingredients: [],
        steps: ['Drink water']
      }
    ];

    const groceryList = createGroceryList(mealsWithNoIngredients);
    expect(groceryList).toHaveLength(0);
  });
});