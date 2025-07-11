import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuickLoadingSpinner from '../QuickLoadingSpinner';

describe('QuickLoadingSpinner', () => {
  it('renders the loading message', () => {
    render(<QuickLoadingSpinner />);
    
    expect(screen.getByText('Your chef is updating the meal plan...')).toBeInTheDocument();
  });

  it('displays animated elements', () => {
    const { container } = render(<QuickLoadingSpinner />);
    
    // Check for chef hat icon (should be present)
    const chefIcon = container.querySelector('svg');
    expect(chefIcon).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<QuickLoadingSpinner />);
    
    const container = screen.getByText('Your chef is updating the meal plan...').closest('div');
    expect(container).toHaveClass('text-center');
  });
});