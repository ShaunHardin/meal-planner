import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Integration Tests', () => {
  describe('OpenAI Workflow Integration', () => {
    it('completes full workflow: input -> validation -> API call -> display structured meals', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // 1. Enter valid prompt (long enough to pass validation)
      const textarea = screen.getByLabelText(/describe the dinners/i);
      const validPrompt = 'I need 4 quick vegetarian meals for this week that are healthy and delicious';
      await user.clear(textarea);
      await user.type(textarea, validPrompt);
      
      // 2. Click generate button
      const generateButton = screen.getByRole('button', { name: /generate ideas/i });
      expect(generateButton).toBeEnabled();
      await user.click(generateButton);
      
      // 3. Wait for structured meal grid to appear
      await waitFor(() => {
        expect(screen.getByTestId('structured-meal-grid')).toBeInTheDocument();
      });
      
      // 4. Check for successful meal display (structured meals should be shown)
      // The grid should no longer show "No meals planned yet"
      expect(screen.queryByText('No meals planned yet')).not.toBeInTheDocument();
    });

    it('handles validation errors correctly', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Enter invalid prompt (too short)
      const textarea = screen.getByLabelText(/describe the dinners/i);
      await user.type(textarea, 'short');
      
      // Button should be disabled
      const generateButton = screen.getByRole('button', { name: /generate ideas/i });
      expect(generateButton).toBeDisabled();
      
      // Validation message should appear
      expect(screen.getByText('Prompt must be at least 10 characters long')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Enter prompt that triggers error in mock
      const textarea = screen.getByLabelText(/describe the dinners/i);
      await user.clear(textarea);
      await user.type(textarea, 'This prompt contains error keyword to trigger failure');
      
      // Click generate button
      const generateButton = screen.getByRole('button', { name: /generate ideas/i });
      await user.click(generateButton);
      
      // Wait for error display
      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
      
      // Should show structured response error
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });

    it('handles network errors', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Enter prompt that triggers network error in mock
      const textarea = screen.getByLabelText(/describe the dinners/i);
      await user.clear(textarea);
      await user.type(textarea, 'This prompt contains network-error to trigger network failure');
      
      // Click generate button
      const generateButton = screen.getByRole('button', { name: /generate ideas/i });
      await user.click(generateButton);
      
      // Wait for error display
      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
      
      // Network errors from MSW show "Failed to fetch"
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });


  });

});