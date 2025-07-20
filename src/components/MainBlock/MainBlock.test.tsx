import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainBlock from './MainBlock';
import { mockBreedResponse, mockImageResponse } from './__mocks__/mocks';

import { fetchBreedsByQuery, fetchCatImages } from '../../api/catApi';

jest.mock('../../api/catApi', () => ({
  fetchBreedsByQuery: jest.fn(),
  fetchCatImages: jest.fn(),
}));

describe('MainBlock component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders cat cards after loading', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(<MainBlock />);

    expect(screen.queryByText(mockBreedResponse[0].name)).not.toBeInTheDocument();
   
    await waitFor(() => {
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();      
      if (mockImageResponse.some(img => !img.breeds || img.breeds.length === 0)) {
        expect(screen.getByText('Funny cat')).toBeInTheDocument();
      }
    });
  });

  it('displays error alert on API failure', async () => {
    (fetchBreedsByQuery as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchCatImages as jest.Mock).mockRejectedValue(new Error('API error'));

    render(<MainBlock />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/api error/i);
    });
  });

  it('handles pagination buttons', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(<MainBlock />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        2, // страница увеличена
        expect.any(Array)
      );
    });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        1, // страница минимальна
        expect.any(Array)
      );
    });
  });

  it('throws and catches fatalError in ErrorBoundary', async () => {
    class TestErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      render() {
        if (this.state.hasError) {
          return <div data-testid="error-boundary">Error caught!</div>;
        }
        return this.props.children;
      }
    }

    render(
      <TestErrorBoundary>
        <MainBlock />
      </TestErrorBoundary>
    );

    const errorButton = screen.getByRole('button', { name: /trigger error/i });
    fireEvent.click(errorButton);

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });
});
