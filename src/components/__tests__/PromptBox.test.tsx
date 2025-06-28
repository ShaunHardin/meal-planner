import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptBox from '../PromptBox';

describe('PromptBox', () => {
  const defaultProps = {
    prompt: '',
    setPrompt: vi.fn(),
    onGenerate: vi.fn(),
    showGrid: false,
    isGenerating: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Validation', () => {
    it('shows validation error for prompts less than 10 characters', async () => {
      const user = userEvent.setup();
      render(<PromptBox {...defaultProps} prompt="short" />);
      
      const textarea = screen.getByLabelText(/describe the dinners/i);
      await user.clear(textarea);
      await user.type(textarea, 'short');
      
      expect(screen.getByText('Prompt must be at least 10 characters long')).toBeInTheDocument();
    });

    it('shows validation error for prompts over 500 characters', async () => {
      const longPrompt = 'a'.repeat(501);
      render(<PromptBox {...defaultProps} prompt={longPrompt} />);
      
      expect(screen.getByText('Prompt must be 500 characters or less')).toBeInTheDocument();
    });

    it('does not show validation error for valid prompts', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} />);
      
      expect(screen.queryByText(/prompt must be/i)).not.toBeInTheDocument();
    });

    it('calls setPrompt when user types', async () => {
      const user = userEvent.setup();
      const setPrompt = vi.fn();
      render(<PromptBox {...defaultProps} setPrompt={setPrompt} />);
      
      const textarea = screen.getByLabelText(/describe the dinners/i);
      await user.type(textarea, 'Hello');
      
      // userEvent.type calls setPrompt for each character typed
      expect(setPrompt).toHaveBeenCalledTimes(5); // 'Hello' is 5 characters
      expect(setPrompt).toHaveBeenCalledWith('H');
      expect(setPrompt).toHaveBeenCalledWith('e');
    });
  });

  describe('Generate Button', () => {
    it('is disabled when prompt is empty', () => {
      render(<PromptBox {...defaultProps} prompt="" />);
      
      const button = screen.getByRole('button', { name: /generate ideas/i });
      expect(button).toBeDisabled();
    });

    it('is disabled when prompt is too short', () => {
      render(<PromptBox {...defaultProps} prompt="short" />);
      
      const button = screen.getByRole('button', { name: /generate ideas/i });
      expect(button).toBeDisabled();
    });

    it('is disabled when prompt is too long', () => {
      const longPrompt = 'a'.repeat(501);
      render(<PromptBox {...defaultProps} prompt={longPrompt} />);
      
      const button = screen.getByRole('button', { name: /generate ideas/i });
      expect(button).toBeDisabled();
    });

    it('is enabled for valid prompts', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} />);
      
      const button = screen.getByRole('button', { name: /generate ideas/i });
      expect(button).toBeEnabled();
    });

    it('is disabled when generating', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} isGenerating={true} />);
      
      const button = screen.getByRole('button', { name: /generating ideas/i });
      expect(button).toBeDisabled();
    });

    it('calls onGenerate when clicked with valid prompt', async () => {
      const user = userEvent.setup();
      const onGenerate = vi.fn();
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      
      render(<PromptBox {...defaultProps} prompt={validPrompt} onGenerate={onGenerate} />);
      
      const button = screen.getByRole('button', { name: /generate ideas/i });
      await user.click(button);
      
      expect(onGenerate).toHaveBeenCalledTimes(1);
    });

    it('does not show button when showGrid is true', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} showGrid={true} />);
      
      expect(screen.queryByRole('button', { name: /generate ideas/i })).not.toBeInTheDocument();
    });
  });

  describe('UI States', () => {
    it('applies error styling when validation fails', () => {
      render(<PromptBox {...defaultProps} prompt="short" />);
      
      const textarea = screen.getByLabelText(/describe the dinners/i);
      expect(textarea).toHaveClass('border-red-300');
    });

    it('applies normal styling when validation passes', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} />);
      
      const textarea = screen.getByLabelText(/describe the dinners/i);
      expect(textarea).toHaveClass('border-gray-300');
      expect(textarea).not.toHaveClass('border-red-300');
    });

    it('shows loading text when generating', () => {
      const validPrompt = 'I need 4 quick vegetarian meals for dinner';
      render(<PromptBox {...defaultProps} prompt={validPrompt} isGenerating={true} />);
      
      expect(screen.getByText('Generating Ideas...')).toBeInTheDocument();
    });
  });
});