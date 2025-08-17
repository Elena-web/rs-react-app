import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import {
  fetchBreedsByQuery,
  fetchAllBreeds,
  fetchCatImages,
  fetchTotalImageCount,
} from '../../api/catApi';
import { mockBreedResponse, mockImageResponse } from '../../app/components/MainBlock/__mocks__/mocks';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from '../../store/store';

jest.mock('../../api/catApi', () => ({
  fetchBreedsByQuery: jest.fn(),
  fetchAllBreeds: jest.fn(),
  fetchCatImages: jest.fn(),
  fetchTotalImageCount: jest.fn(),
}));

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
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

    renderWithProviders(<MainBlock />, { route: '/?page=1' });

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

    renderWithProviders(<MainBlock />, { route: '/?page=1' });

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

    renderWithProviders(<MainBlock />, { route: '/?page=1' });

    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        1,
        expect.any(Array)
      );
    });
  });

  it('decrements page when clicking Previous button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />, { route: '/?page=2' });

    const prevButton = await screen.findByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(fetchCatImages).toHaveBeenCalledWith(
        expect.any(Number),
        0,
        expect.any(Array)
      );
    });
  });

  it('shows loader skeleton while fetching and then displays cards', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchAllBreeds as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    renderWithProviders(<MainBlock />, { route: '/?page=1' });

    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });
});
