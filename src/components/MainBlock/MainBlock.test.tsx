import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import { fetchBreedsByQuery, fetchCatImages } from '../../api/catApi';
import { mockBreedResponse, mockImageResponse } from './__mocks__/mocks';

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

    expect(
      screen.queryByText(mockBreedResponse[0].name)
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });

  it('renders "Funny cat" when images have no breeds', async () => {
    const mockImageResponseWithNoBreeds = [
      { id: '1', url: 'image1.jpg', breeds: [] },
      { id: '2', url: 'image2.jpg', breeds: [] },
    ];

    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(
      mockImageResponseWithNoBreeds
    );

    render(<MainBlock />);

    await waitFor(() => {
      const funnyCats = screen.getAllByText('Funny cat');
      expect(funnyCats.length).toBeGreaterThan(0);
    });
  });

  it('displays error alert on API failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (fetchBreedsByQuery as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchCatImages as jest.Mock).mockRejectedValue(new Error('API error'));

    render(<MainBlock />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/api error/i);
    });
  });

  it('increments page when clicking Next button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(<MainBlock />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        2,
        expect.any(Array)
      );
    });
  });

  it('decrements page when clicking Previous button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(<MainBlock />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        2,
        expect.any(Array)
      );
    });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        1,
        expect.any(Array)
      );
    });
  });

  it('catches fatal error in ErrorBoundary and shows fallback UI', async () => {
    class TestErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      constructor(props: { children: React.ReactNode }) {
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
    await userEvent.click(errorButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  it('renders cat cards after loading', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(<MainBlock />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });
});
