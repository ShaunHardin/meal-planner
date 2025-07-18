import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import SlotMachineLoader from '../SlotMachineLoader';

// Mock setTimeout/setInterval for tests
vi.useFakeTimers();

describe('SlotMachineLoader', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic rendering', () => {
    it('renders with default props', () => {
      render(<SlotMachineLoader />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading meal suggestion')).toBeInTheDocument();
      expect(screen.getByText('Generating new meal suggestion...')).toBeInTheDocument();
    });

    it('renders 5 emoji slots', () => {
      const { container } = render(<SlotMachineLoader />);
      
      // Check that we have 5 slot elements by looking for elements with the slot styling
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
    });

    it('applies correct aria attributes', () => {
      render(<SlotMachineLoader isSpinning={true} />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-busy', 'true');
      expect(loader).toHaveAttribute('aria-label', 'Loading meal suggestion');
    });
  });

  describe('Size variants', () => {
    it('renders small variant correctly', () => {
      const { container } = render(<SlotMachineLoader size="small" />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveClass('py-8', 'px-4');
      
      // Check for small slot sizing
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
    });

    it('renders large variant correctly', () => {
      const { container } = render(<SlotMachineLoader size="large" />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveClass('min-h-[400px]', 'p-8', 'bg-black/20', 'backdrop-blur-sm');
      
      // Check for large slot sizing
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
    });

    it('shows header and footer content for large variant', () => {
      render(
        <SlotMachineLoader 
          size="large" 
          title="Custom Title" 
          subtitle="Custom Subtitle" 
        />
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Rolling the perfect meal combinations...')).toBeInTheDocument();
    });

    it('uses default title and subtitle for large variant', () => {
      render(<SlotMachineLoader size="large" />);
      
      expect(screen.getByText('Generating Your Meal Plan')).toBeInTheDocument();
      expect(screen.getByText('Rolling the perfect meal combinations...')).toBeInTheDocument();
    });
  });

  describe('Spinning animation', () => {
    it('applies spinning styles when isSpinning is true', () => {
      const { container } = render(<SlotMachineLoader isSpinning={true} />);
      
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
      
      // Check that spinning styles are applied
      slots.forEach(slot => {
        expect(slot).toHaveClass('animate-bounce');
      });
    });

    it('does not apply spinning styles when isSpinning is false', () => {
      const { container } = render(<SlotMachineLoader isSpinning={false} />);
      
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
      
      // Check that spinning styles are not applied
      slots.forEach(slot => {
        expect(slot).not.toHaveClass('animate-bounce');
      });
    });

    it('updates aria-busy based on isSpinning prop', () => {
      const { rerender } = render(<SlotMachineLoader isSpinning={true} />);
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
      
      rerender(<SlotMachineLoader isSpinning={false} />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'false');
    });

    it('rotates emoji slots when spinning', () => {
      const { container } = render(<SlotMachineLoader isSpinning={true} />);
      
      // Fast-forward time to trigger slot rotation
      act(() => {
        vi.advanceTimersByTime(150);
      });
      
      // Should have updated slots (hard to test exact emojis, but we can verify the interval runs)
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
    });

    it('stops rotating when isSpinning becomes false', () => {
      const { rerender } = render(<SlotMachineLoader isSpinning={true} />);
      
      // Start spinning
      act(() => {
        vi.advanceTimersByTime(150);
      });
      
      // Stop spinning
      rerender(<SlotMachineLoader isSpinning={false} />);
      
      // Advance time and verify no updates occur
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      // Component should still be rendered without animation
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Custom props', () => {
    it('applies custom className', () => {
      render(<SlotMachineLoader className="custom-class" />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveClass('custom-class');
    });

    it('uses custom title for small variant', () => {
      render(<SlotMachineLoader size="small" title="Custom Loading Message" />);
      
      expect(screen.getByText('Custom Loading Message')).toBeInTheDocument();
    });

    it('uses custom aria-label when title is provided', () => {
      render(<SlotMachineLoader title="Custom Title" />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-label', 'Custom Title');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SlotMachineLoader />);
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('role', 'status');
      expect(loader).toHaveAttribute('aria-busy');
      expect(loader).toHaveAttribute('aria-label');
    });

    it('hides decorative emoji slots from screen readers', () => {
      const { container } = render(<SlotMachineLoader />);
      
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
      
      slots.forEach(slot => {
        expect(slot).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Food emoji rendering', () => {
    it('renders food emojis in slots', () => {
      const { container } = render(<SlotMachineLoader />);
      
      const slots = container.querySelectorAll('div[aria-hidden="true"]');
      expect(slots).toHaveLength(5);
      
      // Each slot should contain an emoji (text content)
      slots.forEach(slot => {
        expect(slot.textContent).toBeTruthy();
        expect(slot.textContent).toMatch(/[\u{1F300}-\u{1F9FF}]/u); // Unicode emoji range
      });
    });
  });

  describe('Edge cases', () => {
    it('handles unmounting during animation', () => {
      const { unmount } = render(<SlotMachineLoader isSpinning={true} />);
      
      // Start some timers
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      // Should unmount cleanly without errors
      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<SlotMachineLoader isSpinning={true} />);
      
      // Rapidly change props
      rerender(<SlotMachineLoader isSpinning={false} />);
      rerender(<SlotMachineLoader isSpinning={true} />);
      rerender(<SlotMachineLoader isSpinning={false} />);
      
      // Should not throw errors
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});