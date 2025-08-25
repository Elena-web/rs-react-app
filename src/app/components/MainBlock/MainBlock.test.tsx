import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import {
  fetchBreedsByQuery,
  fetchAllBreeds,
  fetchCatImages,
  fetchTotalImageCount,
} from '../../../api/catApi';
import {
  mockBreedResponse,
  mockImageResponse,
} from '../../../app/components/MainBlock/__mocks__/mocks';

import { Provider } from 'react-redux';
import { store } from '../../../store/store';

jest.mock('../../../api/catApi', () => ({
  fetchBreedsByQuery: jest.fn(),
  fetchAllBreeds: jest.fn(),
  fetchCatImages: jest.fn(),
  fetchTotalImageCount: jest.fn(),
}));

jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => ({
      get: jest.fn(),
    }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('MainBlock component', () => {
  const mockTotalImageCount = 27;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders cat cards after loading', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />);

    expect(
      screen.queryByText(mockBreedResponse[0].name)
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });

  it('displays error alert on API failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (fetchBreedsByQuery as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchAllBreeds as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchCatImages as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/api error/i);
    });
  });

  it('increments page when clicking Next button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />);

    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalled();
    });
  });

  it('decrements page when clicking Previous button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />);

    const prevButton = await screen.findByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalled();
    });
  });

  it('shows loader skeleton while fetching and then displays cards', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />);

    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });
});
