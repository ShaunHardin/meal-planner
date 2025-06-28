import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OpenAIResponseDisplay from '../OpenAIResponseDisplay';

describe('OpenAIResponseDisplay', () => {
  describe('Visibility', () => {
    it('does not render when no response, loading, or error', () => {
      const { container } = render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={false}
          error={null}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('renders when loading', () => {
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={true}
          error={null}
        />
      );
      
      expect(screen.getByText('AI Meal Suggestions')).toBeInTheDocument();
    });

    it('renders when there is an error', () => {
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={false}
          error="Something went wrong"
        />
      );
      
      expect(screen.getByText('AI Meal Suggestions')).toBeInTheDocument();
    });

    it('renders when there is a response', () => {
      render(
        <OpenAIResponseDisplay 
          response="Here are your meal suggestions..."
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('AI Meal Suggestions')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner and message when loading', () => {
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={true}
          error={null}
        />
      );
      
      expect(screen.getByText('Generating personalized meal suggestions...')).toBeInTheDocument();
      // Check for loading spinner (Loader2 icon)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('does not show loading content when not loading', () => {
      render(
        <OpenAIResponseDisplay 
          response="Some response"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.queryByText('Generating personalized meal suggestions...')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when there is an error', () => {
      const errorMessage = 'Network connection failed';
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={false}
          error={errorMessage}
        />
      );
      
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('shows error icon when there is an error', () => {
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={false}
          error="Some error"
        />
      );
      
      // Check that error styling is applied (red colors)
      expect(screen.getByText('Error')).toHaveClass('text-red-900');
    });
  });

  describe('Success State', () => {
    it('displays response content when successful', () => {
      const responseText = 'Here are 4 meal suggestions:\n1. Pasta\n2. Salad\n3. Soup\n4. Sandwich';
      render(
        <OpenAIResponseDisplay 
          response={responseText}
          isLoading={false}
          error={null}
        />
      );
      
      // Check that the response content is displayed (text may be split across elements)
      expect(screen.getByText(/here are 4 meal suggestions/i)).toBeInTheDocument();
      expect(screen.getByText(/pasta/i)).toBeInTheDocument();
    });

    it('preserves whitespace formatting in response', () => {
      const responseText = 'Line 1\n\nLine 3 with spaces   ';
      render(
        <OpenAIResponseDisplay 
          response={responseText}
          isLoading={false}
          error={null}
        />
      );
      
      // Check that the pre element has the correct class for preserving whitespace
      const preElement = document.querySelector('pre');
      expect(preElement).toHaveClass('whitespace-pre-wrap');
      expect(screen.getByText(/line 1/i)).toBeInTheDocument();
    });

    it('shows success icon when there is a response without error', () => {
      render(
        <OpenAIResponseDisplay 
          response="Success response"
          isLoading={false}
          error={null}
        />
      );
      
      // Check for CheckCircle icon in header
      const header = screen.getByText('AI Meal Suggestions').closest('h3');
      expect(header?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Priority States', () => {
    it('shows error even when there is a response', () => {
      render(
        <OpenAIResponseDisplay 
          response="Some response"
          isLoading={false}
          error="An error occurred"
        />
      );
      
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
      expect(screen.queryByText('Some response')).not.toBeInTheDocument();
    });

    it('shows loading state even when there is an error', () => {
      render(
        <OpenAIResponseDisplay 
          response=""
          isLoading={true}
          error="Previous error"
        />
      );
      
      expect(screen.getByText('Generating personalized meal suggestions...')).toBeInTheDocument();
      // When loading is true, error should not be displayed
      expect(screen.queryByTestId('ai-response-error')).not.toBeInTheDocument();
    });
  });
});