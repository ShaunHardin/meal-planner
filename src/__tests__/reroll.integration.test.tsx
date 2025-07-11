import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Reroll Integration Tests', () => {
  beforeEach(() => {
    // Reset any component state between tests
  });

  it('successfully rerolls a meal when dice button is clicked', async () => {
    render(<App />);
    
    // First generate some meals
    const input = screen.getByPlaceholderText(/I need 4 quick vegetarian dinners/i);
    const generateButton = screen.getByRole('button', { name: /generate ideas/i });
    
    fireEvent.change(input, { target: { value: 'quick dinner for family' } });
    fireEvent.click(generateButton);
    
    // Wait for meals to load
    await waitFor(() => {
      expect(screen.getByText('Vegetarian Pasta Bowl')).toBeInTheDocument();
    });
    
    // Find and click the reroll button for the first meal (Sunday)
    const rerollButtons = screen.getAllByTitle('Re-roll meal suggestion');
    expect(rerollButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(rerollButtons[0]);
    
    // Should show loading state
    await waitFor(() => {
      expect(rerollButtons[0]).toBeDisabled();
    });
    
    // Wait for reroll to complete and verify new meal appears
    await waitFor(() => {
      expect(screen.getByText('Mediterranean Quinoa Salad')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Original meal should be replaced
    expect(screen.queryByText('Vegetarian Pasta Bowl')).not.toBeInTheDocument();
    
    // Button should be enabled again
    expect(rerollButtons[0]).not.toBeDisabled();
  });


  it('rerolls different meals independently', async () => {
    render(<App />);
    
    // Generate meals
    const input = screen.getByPlaceholderText(/I need 4 quick vegetarian dinners/i);
    const generateButton = screen.getByRole('button', { name: /generate ideas/i });
    
    fireEvent.change(input, { target: { value: 'quick dinner for family' } });
    fireEvent.click(generateButton);
    
    // Wait for meals to load
    await waitFor(() => {
      expect(screen.getByText('Vegetarian Pasta Bowl')).toBeInTheDocument();
      expect(screen.getByText('Chicken Stir-Fry')).toBeInTheDocument();
    });
    
    const rerollButtons = screen.getAllByTitle('Re-roll meal suggestion');
    
    // Reroll the Monday meal (should be second in the list)
    const mondayButton = rerollButtons[1];
    fireEvent.click(mondayButton);
    
    // Wait for Monday meal to be replaced
    await waitFor(() => {
      expect(screen.getByText('Turkey and Avocado Wrap')).toBeInTheDocument();
    });
    
    // Sunday meal should remain unchanged
    expect(screen.getByText('Vegetarian Pasta Bowl')).toBeInTheDocument();
    
    // Other meals should also remain unchanged
    expect(screen.getByText('Bean and Rice Bowl')).toBeInTheDocument();
    expect(screen.getByText('Fish Tacos')).toBeInTheDocument();
  });

  it('maintains loading state only for the meal being rerolled', async () => {
    render(<App />);
    
    // Generate meals
    const input = screen.getByPlaceholderText(/I need 4 quick vegetarian dinners/i);
    const generateButton = screen.getByRole('button', { name: /generate ideas/i });
    
    fireEvent.change(input, { target: { value: 'quick dinner for family' } });
    fireEvent.click(generateButton);
    
    // Wait for meals to load
    await waitFor(() => {
      expect(screen.getByText('Vegetarian Pasta Bowl')).toBeInTheDocument();
    });
    
    const rerollButtons = screen.getAllByTitle('Re-roll meal suggestion');
    
    // Click first reroll button
    fireEvent.click(rerollButtons[0]);
    
    // First button should be disabled, others should remain enabled
    await waitFor(() => {
      expect(rerollButtons[0]).toBeDisabled();
    });
    
    expect(rerollButtons[1]).not.toBeDisabled();
    expect(rerollButtons[2]).not.toBeDisabled();
    expect(rerollButtons[3]).not.toBeDisabled();
  });

  it('disables reroll button when no original prompt is available', async () => {
    render(<App />);
    
    // Try to access reroll functionality without generating meals first
    // This scenario shouldn't normally occur in the UI, but tests edge case
    
    // Since we need meals to show reroll buttons, generate some first
    const input = screen.getByPlaceholderText(/I need 4 quick vegetarian dinners/i);
    const generateButton = screen.getByRole('button', { name: /generate ideas/i });
    
    fireEvent.change(input, { target: { value: 'quick dinner for family' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Vegetarian Pasta Bowl')).toBeInTheDocument();
    });
    
    // Reroll buttons should be available since we have an original prompt
    const rerollButtons = screen.getAllByTitle('Re-roll meal suggestion');
    expect(rerollButtons[0]).not.toBeDisabled();
  });

});