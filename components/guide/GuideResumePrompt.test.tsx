/**
 * Unit tests for GuideResumePrompt Component
 * 
 * Tests the resume prompt display and user interactions.
 * Validates Requirements 7.5
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GuideResumePrompt } from './GuideResumePrompt';
import { useGuide } from '@/contexts/GuideContext';

// Mock the useGuide hook
jest.mock('@/contexts/GuideContext', () => ({
  useGuide: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('GuideResumePrompt', () => {
  const mockResumeGuide = jest.fn();
  const mockResetGuide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isPaused is false', () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: false,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    const { container } = render(<GuideResumePrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when guide is completed', () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: true,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    const { container } = render(<GuideResumePrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when isPaused is true and not completed', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    // Wait for the component to appear (300ms delay)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }, { timeout: 500 });

    expect(screen.getByText('Panduan Terhenti')).toBeInTheDocument();
    expect(screen.getByText(/Anda memiliki panduan yang belum selesai/)).toBeInTheDocument();
  });

  it('should display Resume and Dismiss buttons', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Lanjutkan panduan')).toBeInTheDocument();
    expect(screen.getByLabelText('Tutup panduan')).toBeInTheDocument();
  });

  it('should call resumeGuide when Resume button is clicked', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const resumeButton = screen.getByLabelText('Lanjutkan panduan');
    fireEvent.click(resumeButton);

    expect(mockResumeGuide).toHaveBeenCalledTimes(1);
  });

  it('should call resetGuide when Dismiss button is clicked', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dismissButton = screen.getByLabelText('Tutup panduan');
    fireEvent.click(dismissButton);

    expect(mockResetGuide).toHaveBeenCalledTimes(1);
  });

  it('should have proper ARIA attributes for accessibility', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'resume-prompt-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'resume-prompt-description');
  });

  it('should display avatar image', async () => {
    (useGuide as jest.Mock).mockReturnValue({
      isPaused: true,
      isCompleted: false,
      resumeGuide: mockResumeGuide,
      resetGuide: mockResetGuide,
    });

    render(<GuideResumePrompt />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const avatar = screen.getByAltText('Guide Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/images/kepala1.png');
  });
});
