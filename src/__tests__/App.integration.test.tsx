import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Integration Tests', () => {
  describe('OpenAI Workflow Integration', () => {
    it('completes full workflow: input -> validation -> API call -> display response', async () => {
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
      
      // 3. Wait for API response and check success display
      await waitFor(() => {
        expect(screen.getByText('AI Meal Suggestions')).toBeInTheDocument();
      });
      
      // 4. Verify response content is displayed in AI response section
      const aiResponseContainer = screen.getByTestId('ai-response-success');
      expect(within(aiResponseContainer).getByText(/here are 4 meal suggestions/i)).toBeInTheDocument();
      expect(within(aiResponseContainer).getByText(/vegetarian pasta bowl/i)).toBeInTheDocument();
      
      // 5. Verify meal grid container is shown (without waiting for timeout-delayed content)
      expect(screen.getByTestId('meal-grid')).toBeInTheDocument();
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
      
      expect(screen.getByText('OpenAI API error')).toBeInTheDocument();
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
      
      // Should show network error message
      const errorContainer = screen.getByTestId('ai-response-error');
      expect(errorContainer).toBeInTheDocument();
      // Network errors from MSW show "Failed to fetch"
      expect(within(errorContainer).getByText(/failed to fetch/i)).toBeInTheDocument();
    });


  });

});