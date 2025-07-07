import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StructuredMealCard from '../StructuredMealCard';
import type { Meal } from '../../types/meal';

const mockMeal: Meal = {
  id: 'test-meal-1',
  day: 'Mon',
  name: 'Grilled Chicken Salad',
  description: 'A healthy and delicious grilled chicken salad with mixed greens',
  prepMinutes: 15,
  cookMinutes: 20,
  ingredients: [
    { item: 'chicken breast', quantity: '2 pieces' },
    { item: 'mixed greens', quantity: '2 cups' },
    { item: 'cherry tomatoes', quantity: '1 cup' }
  ],
  steps: [
    'Season chicken with salt and pepper',
    'Grill chicken for 6-7 minutes per side',
    'Slice chicken and serve over greens'
  ],
  tags: ['healthy', 'protein']
};

describe('StructuredMealCard', () => {
  it('renders meal name and description', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('A healthy and delicious grilled chicken salad with mixed greens')).toBeInTheDocument();
  });

  it('displays cooking times correctly', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('Prep: 15m')).toBeInTheDocument();
    expect(screen.getByText('Cook: 20m')).toBeInTheDocument();
  });

  it('renders all ingredients with quantities', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('chicken breast')).toBeInTheDocument();
    expect(screen.getByText('2 pieces')).toBeInTheDocument();
    expect(screen.getByText('mixed greens')).toBeInTheDocument();
    expect(screen.getByText('2 cups')).toBeInTheDocument();
  });

  it('displays cooking steps in order', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('Season chicken with salt and pepper')).toBeInTheDocument();
    expect(screen.getByText('Grill chicken for 6-7 minutes per side')).toBeInTheDocument();
    expect(screen.getByText('Slice chicken and serve over greens')).toBeInTheDocument();
  });

  it('renders tags when provided', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('healthy')).toBeInTheDocument();
    expect(screen.getByText('protein')).toBeInTheDocument();
  });

  it('handles meal without tags', () => {
    const mealWithoutTags = { ...mockMeal, tags: undefined };
    render(<StructuredMealCard meal={mealWithoutTags} />);
    
    // Should still render other content
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });

  it('handles empty tags array', () => {
    const mealWithEmptyTags = { ...mockMeal, tags: [] };
    render(<StructuredMealCard meal={mealWithEmptyTags} />);
    
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });

  it('displays day assignment', () => {
    render(<StructuredMealCard meal={mockMeal} />);
    
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('handles single ingredient and step', () => {
    const simpleMeal: Meal = {
      ...mockMeal,
      ingredients: [{ item: 'pasta', quantity: '1 lb' }],
      steps: ['Boil pasta until al dente']
    };
    
    render(<StructuredMealCard meal={simpleMeal} />);
    
    expect(screen.getByText('pasta')).toBeInTheDocument();
    expect(screen.getByText('1 lb')).toBeInTheDocument();
    expect(screen.getByText('Boil pasta until al dente')).toBeInTheDocument();
  });

  it('handles zero cooking time', () => {
    const noPrep = { ...mockMeal, prepMinutes: 0, cookMinutes: 0 };
    render(<StructuredMealCard meal={noPrep} />);
    
    expect(screen.getByText('Prep: 0m')).toBeInTheDocument();
    expect(screen.getByText('Cook: 0m')).toBeInTheDocument();
  });

  describe('reroll functionality', () => {
    it('renders reroll button when onReroll is provided', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} />);
      
      const rerollButton = screen.getByTitle('Re-roll meal suggestion');
      expect(rerollButton).toBeInTheDocument();
      expect(rerollButton).toHaveTextContent('🎲');
    });

    it('calls onReroll when dice button is clicked', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} />);
      
      const rerollButton = screen.getByTitle('Re-roll meal suggestion');
      fireEvent.click(rerollButton);
      
      expect(mockOnReroll).toHaveBeenCalledWith('test-meal-1');
    });

    it('disables reroll button when isRerolling is true', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} isRerolling={true} />);
      
      const rerollButton = screen.getByTitle('Re-roll meal suggestion');
      expect(rerollButton).toBeDisabled();
    });

    it('shows spinning animation when isRerolling is true', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} isRerolling={true} />);
      
      const dice = screen.getByText('🎲');
      expect(dice).toHaveClass('animate-spin');
    });

    it('shows loading placeholders for ingredients when isRerolling is true', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} isRerolling={true} />);
      
      // Should show loading placeholders instead of actual ingredients
      expect(screen.queryByText('chicken breast')).not.toBeInTheDocument();
      expect(screen.queryByText('2 pieces')).not.toBeInTheDocument();
      
      // Should show loading placeholders
      const placeholders = screen.getAllByText('', { selector: 'div.h-4.bg-gray-200.rounded' });
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('shows loading placeholders for instructions when isRerolling is true', () => {
      const mockOnReroll = vi.fn();
      render(<StructuredMealCard meal={mockMeal} onReroll={mockOnReroll} isRerolling={true} />);
      
      // Should show loading placeholders instead of actual steps
      expect(screen.queryByText('Season chicken with salt and pepper')).not.toBeInTheDocument();
      expect(screen.queryByText('Grill chicken for 6-7 minutes per side')).not.toBeInTheDocument();
      
      // Should show numbered placeholders
      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByText('2.')).toBeInTheDocument();
      expect(screen.getByText('3.')).toBeInTheDocument();
    });

    it('does not render reroll button when onReroll is not provided', () => {
      render(<StructuredMealCard meal={mockMeal} />);
      
      const rerollButton = screen.queryByTitle('Re-roll meal suggestion');
      expect(rerollButton).not.toBeInTheDocument();
    });
  });
});