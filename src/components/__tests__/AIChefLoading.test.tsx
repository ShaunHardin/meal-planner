import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AIChefLoading from '../AIChefLoading';

describe('AIChefLoading', () => {
  it('renders the main heading', () => {
    render(<AIChefLoading />);
    
    expect(screen.getByText('Your AI Chef is Working Hard!')).toBeInTheDocument();
    expect(screen.getByText('Crafting the perfect meal plan just for you...')).toBeInTheDocument();
  });

  it('starts with the first stage', () => {
    render(<AIChefLoading />);
    
    expect(screen.getByText('Flipping through thousands of cookbooks...')).toBeInTheDocument();
  });

  it('shows progress bars', () => {
    render(<AIChefLoading />);
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Current Stage Progress')).toBeInTheDocument();
  });

  it('displays all stages in the timeline', () => {
    render(<AIChefLoading />);
    
    expect(screen.getAllByText('Researching recipes')).toHaveLength(2); // Main title and timeline
    expect(screen.getByText('Analyzing your preferences')).toBeInTheDocument();
    expect(screen.getByText('Chopping ingredients')).toBeInTheDocument();
    expect(screen.getByText('Cooking test meals')).toBeInTheDocument();
    expect(screen.getByText('Tasting and perfecting')).toBeInTheDocument();
    expect(screen.getByText('Discarding imperfect meals')).toBeInTheDocument();
    expect(screen.getByText('Finalizing your meal plan')).toBeInTheDocument();
  });

  it('shows fun facts section', () => {
    render(<AIChefLoading />);
    
    expect(screen.getByText('Considering over 10,000 recipes...')).toBeInTheDocument();
  });

  it('has proper visual elements', () => {
    const { container } = render(<AIChefLoading />);
    
    // Check for gradient background
    const gradientDiv = container.querySelector('.bg-gradient-to-br');
    expect(gradientDiv).toBeInTheDocument();
  });

  it('shows initial stage correctly', async () => {
    render(<AIChefLoading />);
    
    // Initially should show first stage
    expect(screen.getAllByText('Researching recipes')).toHaveLength(2); // Main title and timeline
    expect(screen.getByText('Flipping through thousands of cookbooks...')).toBeInTheDocument();
  });
});