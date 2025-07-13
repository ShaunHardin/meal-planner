import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroceryList } from '../GroceryList';
import { Meal } from '../../types/meal';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('GroceryList', () => {
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

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders grocery list with combined ingredients', () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('Combined ingredients from 2 meals')).toBeInTheDocument();
    
    // Check that ingredients are displayed
    expect(screen.getByText('Chicken breast')).toBeInTheDocument();
    expect(screen.getByText('Garlic')).toBeInTheDocument();
    expect(screen.getByText('Mixed vegetables')).toBeInTheDocument();
    expect(screen.getByText('Olive oil')).toBeInTheDocument();
    
    // Check combined quantities
    expect(screen.getByText('3 tablespoons')).toBeInTheDocument();
    expect(screen.getByText('3 cups')).toBeInTheDocument();
  });

  it('shows original quantities when ingredients are combined', () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    expect(screen.getByText('Combined from: 2 tbsp, 1 tbsp')).toBeInTheDocument();
    expect(screen.getByText('Combined from: 2 cups, 1 cup')).toBeInTheDocument();
  });

  it('handles empty meals array', () => {
    render(<GroceryList meals={[]} onClose={mockOnClose} />);
    
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('No meals selected. Generate some meals first!')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows correct item count', () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    expect(screen.getByText('4 unique items')).toBeInTheDocument();
  });

  it('shows correct item count for single item', () => {
    const singleMeal: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Simple Recipe',
        description: 'Very simple',
        prepMinutes: 5,
        cookMinutes: 0,
        ingredients: [
          { item: 'Bread', quantity: '2 slices' }
        ],
        steps: ['Toast bread']
      }
    ];

    render(<GroceryList meals={singleMeal} onClose={mockOnClose} />);
    
    expect(screen.getByText('1 unique item')).toBeInTheDocument();
    expect(screen.getByText('Combined ingredients from 1 meal')).toBeInTheDocument();
  });

  it('copies grocery list to clipboard when copy button is clicked', async () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    const copyButton = screen.getByText('Copy to Clipboard');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '• Chicken breast: 1 lb\n• Garlic: 3 cloves\n• Mixed vegetables: 3 cups\n• Olive oil: 3 tablespoons'
    );
  });

  it('renders items in alphabetical order', () => {
    render(<GroceryList meals={mockMeals} onClose={mockOnClose} />);
    
    const itemElements = screen.getAllByText(/^(Chicken breast|Garlic|Mixed vegetables|Olive oil)$/);
    const itemNames = itemElements.map(el => el.textContent);
    
    expect(itemNames).toEqual(['Chicken breast', 'Garlic', 'Mixed vegetables', 'Olive oil']);
  });

  it('displays ingredients without combination details when not combined', () => {
    const singleMeal: Meal[] = [
      {
        id: '1',
        day: 'Mon',
        name: 'Simple Recipe',
        description: 'Very simple',
        prepMinutes: 5,
        cookMinutes: 0,
        ingredients: [
          { item: 'Bread', quantity: '2 slices' },
          { item: 'Butter', quantity: '1 tbsp' }
        ],
        steps: ['Toast bread']
      }
    ];

    render(<GroceryList meals={singleMeal} onClose={mockOnClose} />);
    
    // Should not show "Combined from:" text for single items
    expect(screen.queryByText(/Combined from:/)).not.toBeInTheDocument();
  });
});