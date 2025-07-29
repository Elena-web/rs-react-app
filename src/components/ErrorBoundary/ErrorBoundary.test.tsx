import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('catches errors and displays fallback UI', () => {
    const ProblemChild = () => {
      throw new Error('Test error');
    };

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it('reloads the page when clicking "Try again"', async () => {
    const mockReload = jest.fn();

    const ProblemChild = () => {
      throw new Error('Reload test error');
    };

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary reloadFn={mockReload}>
        <ProblemChild />
      </ErrorBoundary>
    );

    const button = await screen.findByRole('button', { name: /try again/i });
    await userEvent.click(button);

    expect(mockReload).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
