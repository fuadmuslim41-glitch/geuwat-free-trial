import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuideTooltip, GuideTooltipProps } from './GuideTooltip';
import { GuideStep } from '@/types/guide';

describe('GuideTooltip - Keyboard Accessibility (Task 12.1)', () => {
  const mockStep: GuideStep = {
    id: 'test-step',
    route: '/test',
    targetSelector: '[data-tour="test"]',
    tooltipText: 'This is a test tooltip',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  };

  const defaultProps: GuideTooltipProps = {
    step: mockStep,
    currentStepIndex: 1,
    totalSteps: 5,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Escape key support', () => {
    it('should close guide when Escape key is pressed', () => {
      const onClose = jest.fn();
      render(<GuideTooltip {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Arrow key navigation', () => {
    it('should navigate to previous step when ArrowLeft is pressed (not on first step)', () => {
      const onPrev = jest.fn();
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} onPrev={onPrev} />);

      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it('should NOT navigate to previous step when ArrowLeft is pressed on first step', () => {
      const onPrev = jest.fn();
      render(<GuideTooltip {...defaultProps} currentStepIndex={0} onPrev={onPrev} />);

      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      expect(onPrev).not.toHaveBeenCalled();
    });

    it('should navigate to next step when ArrowRight is pressed', () => {
      const onNext = jest.fn();
      render(<GuideTooltip {...defaultProps} onNext={onNext} />);

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('should navigate to next step when ArrowRight is pressed on last step', () => {
      const onNext = jest.fn();
      render(
        <GuideTooltip
          {...defaultProps}
          currentStepIndex={4}
          totalSteps={5}
          onNext={onNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enter/Space key support on buttons', () => {
    it('should trigger Prev button action when Enter is pressed', () => {
      const onPrev = jest.fn();
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} onPrev={onPrev} />);

      const prevButton = screen.getByRole('button', { name: /sebelumnya/i });
      fireEvent.keyDown(prevButton, { key: 'Enter' });

      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it('should trigger Prev button action when Space is pressed', () => {
      const onPrev = jest.fn();
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} onPrev={onPrev} />);

      const prevButton = screen.getByRole('button', { name: /sebelumnya/i });
      fireEvent.keyDown(prevButton, { key: ' ' });

      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger Prev button action when Enter is pressed on first step', () => {
      const onPrev = jest.fn();
      render(<GuideTooltip {...defaultProps} currentStepIndex={0} onPrev={onPrev} />);

      const prevButton = screen.getByRole('button', { name: /sebelumnya/i });
      fireEvent.keyDown(prevButton, { key: 'Enter' });

      expect(onPrev).not.toHaveBeenCalled();
    });

    it('should trigger Next button action when Enter is pressed', () => {
      const onNext = jest.fn();
      render(<GuideTooltip {...defaultProps} onNext={onNext} />);

      const nextButton = screen.getByRole('button', { name: /lanjut ke langkah berikutnya/i });
      fireEvent.keyDown(nextButton, { key: 'Enter' });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('should trigger Next button action when Space is pressed', () => {
      const onNext = jest.fn();
      render(<GuideTooltip {...defaultProps} onNext={onNext} />);

      const nextButton = screen.getByRole('button', { name: /lanjut ke langkah berikutnya/i });
      fireEvent.keyDown(nextButton, { key: ' ' });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('should trigger Close button action when Enter is pressed', () => {
      const onClose = jest.fn();
      render(<GuideTooltip {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /tutup panduan/i });
      fireEvent.keyDown(closeButton, { key: 'Enter' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should trigger Close button action when Space is pressed', () => {
      const onClose = jest.fn();
      render(<GuideTooltip {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /tutup panduan/i });
      fireEvent.keyDown(closeButton, { key: ' ' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should show "Selesai" button on last step and trigger action with Enter', () => {
      const onNext = jest.fn();
      render(
        <GuideTooltip
          {...defaultProps}
          currentStepIndex={4}
          totalSteps={5}
          onNext={onNext}
        />
      );

      const finishButton = screen.getByRole('button', { name: /selesai/i });
      expect(finishButton).toBeInTheDocument();

      fireEvent.keyDown(finishButton, { key: 'Enter' });

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard focusability', () => {
    it('should have all buttons keyboard focusable with proper tabIndex', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} />);

      const prevButton = screen.getByRole('button', { name: /kembali ke langkah sebelumnya/i });
      const nextButton = screen.getByRole('button', { name: /lanjut ke langkah berikutnya/i });
      const closeButton = screen.getByRole('button', { name: /tutup panduan/i });

      expect(prevButton).toHaveAttribute('tabIndex', '0');
      expect(nextButton).toHaveAttribute('tabIndex', '0');
      expect(closeButton).toHaveAttribute('tabIndex', '0');
    });

    it('should have Prev button with tabIndex -1 when on first step', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={0} />);

      const prevButton = screen.getByRole('button', { name: /sebelumnya/i });

      expect(prevButton).toHaveAttribute('tabIndex', '-1');
      expect(prevButton).toBeDisabled();
    });

    it('should have Next button focusable on last step', () => {
      render(
        <GuideTooltip
          {...defaultProps}
          currentStepIndex={4}
          totalSteps={5}
        />
      );

      const finishButton = screen.getByRole('button', { name: /selesai/i });

      expect(finishButton).toHaveAttribute('tabIndex', '0');
      expect(finishButton).not.toBeDisabled();
    });
  });

  describe('Event cleanup', () => {
    it('should remove keyboard event listeners when component unmounts', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = render(<GuideTooltip {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });
});

describe('GuideTooltip - ARIA Attributes (Task 13)', () => {
  const mockStep: GuideStep = {
    id: 'test-step',
    route: '/test',
    targetSelector: '[data-tour="test"]',
    tooltipText: 'This is a test tooltip',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  };

  const defaultProps: GuideTooltipProps = {
    step: mockStep,
    currentStepIndex: 1,
    totalSteps: 5,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dialog ARIA attributes (Requirement 16.4)', () => {
    it('should have role="dialog" on tooltip container', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have aria-modal="true" on tooltip container', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-label on tooltip container', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Panduan interaktif');
    });

    it('should have aria-describedby linking to tooltip content', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'guide-tooltip-content');
      
      const content = document.getElementById('guide-tooltip-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent(mockStep.tooltipText);
    });
  });

  describe('Button ARIA labels (Requirement 16.4)', () => {
    it('should have descriptive aria-label on Prev button', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} />);
      
      const prevButton = screen.getByRole('button', { name: /kembali ke langkah sebelumnya/i });
      expect(prevButton).toBeInTheDocument();
      expect(prevButton).toHaveAttribute('aria-label', 'Kembali ke langkah sebelumnya');
    });

    it('should have aria-disabled on Prev button when on first step', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={0} />);
      
      const prevButton = screen.getByRole('button', { name: /kembali ke langkah sebelumnya/i });
      expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have descriptive aria-label on Close button', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /tutup panduan/i });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Tutup panduan');
    });

    it('should have descriptive aria-label on Next button', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={2} />);
      
      const nextButton = screen.getByRole('button', { name: /lanjut ke langkah berikutnya/i });
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).toHaveAttribute('aria-label', 'Lanjut ke langkah berikutnya');
    });

    it('should have different aria-label on last step (Selesai)', () => {
      render(<GuideTooltip {...defaultProps} currentStepIndex={4} totalSteps={5} />);
      
      const finishButton = screen.getByRole('button', { name: /selesai panduan/i });
      expect(finishButton).toBeInTheDocument();
      expect(finishButton).toHaveAttribute('aria-label', 'Selesai panduan');
    });
  });

  describe('Step indicator ARIA (Requirement 16.4)', () => {
    it('should have aria-current="step" on tooltip content', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const content = document.getElementById('guide-tooltip-content');
      expect(content).toHaveAttribute('aria-current', 'step');
    });
  });

  describe('Avatar image accessibility', () => {
    it('should have aria-hidden="true" on avatar image', () => {
      render(<GuideTooltip {...defaultProps} />);
      
      const avatar = screen.getByAltText('Avatar panduan');
      expect(avatar).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
