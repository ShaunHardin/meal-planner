import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StructuredMealGrid from '../StructuredMealGrid';
import type { Meal } from '../../types/meal';

const mockMeals: Meal[] = [
  {
    id: 'meal-1',
    day: 'Mon',
    name: 'Chicken Salad',
    description: 'Healthy chicken salad',
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [{ item: 'chicken', quantity: '1 lb' }],
    steps: ['Cook chicken', 'Make salad'],
    tags: ['healthy']
  },
  {
    id: 'meal-2',
    day: 'Tue',
    name: 'Pasta Bowl',
    description: 'Quick pasta dinner',
    prepMinutes: 5,
    cookMinutes: 10,
    ingredients: [{ item: 'pasta', quantity: '1 lb' }],
    steps: ['Boil pasta', 'Add sauce'],
    tags: ['quick']
  }
];

describe('StructuredMealGrid', () => {
  it('renders all meals in grid format', () => {
    render(<StructuredMealGrid meals={mockMeals} />);
    
    expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('Pasta Bowl')).toBeInTheDocument();
  });

  it('handles empty meals array', () => {
    render(<StructuredMealGrid meals={[]} />);
    
    // Should show empty state message
    expect(screen.getByText('No meals planned yet')).toBeInTheDocument();
  });

  it('renders single meal', () => {
    render(<StructuredMealGrid meals={[mockMeals[0]]} />);
    
    expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
    expect(screen.queryByText('Pasta Bowl')).not.toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    render(<StructuredMealGrid meals={mockMeals} />);
    
    const grid = screen.getByTestId('structured-meal-grid');
    expect(grid).toBeInTheDocument();
    // Check if grid container has the right classes
    const gridContainer = grid.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders meals with unique keys', () => {
    render(<StructuredMealGrid meals={mockMeals} />);
    
    // Each meal should be rendered with proper structure
    expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('Pasta Bowl')).toBeInTheDocument();
  });

  it('handles meals with different days', () => {
    const mealsWithDays = [
      { ...mockMeals[0], day: 'Sun' as const },
      { ...mockMeals[1], day: 'Sat' as const }
    ];
    
    render(<StructuredMealGrid meals={mealsWithDays} />);
    
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('maintains responsive layout', () => {
    render(<StructuredMealGrid meals={mockMeals} />);
    
    const grid = screen.getByTestId('structured-meal-grid');
    expect(grid).toBeInTheDocument();
  });
});