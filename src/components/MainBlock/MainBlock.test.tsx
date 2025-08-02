import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import {
  fetchBreedsByQuery,
  fetchCatImages,
  fetchTotalImageCount,
} from '../../api/catApi';
import { mockBreedResponse, mockImageResponse } from './__mocks__/mocks';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../api/catApi', () => ({
  fetchBreedsByQuery: jest.fn(),
  fetchCatImages: jest.fn(),
  fetchTotalImageCount: jest.fn(),
}));

describe('MainBlock component', () => {
  const mockTotalImageCount = 27;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders cat cards after loading', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <MainBlock />
      </MemoryRouter>
    );

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
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <MainBlock />
      </MemoryRouter>
    );

    await waitFor(() => {
      const funnyCats = screen.getAllByText('Funny cat');
      expect(funnyCats.length).toBeGreaterThan(0);
    });
  });

  it('displays error alert on API failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (fetchBreedsByQuery as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchCatImages as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <MainBlock />
      </MemoryRouter>
    );

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/api error/i);
    });
  });

  it('increments page when clicking Next button', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <MainBlock />
      </MemoryRouter>
    );

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
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <MainBlock />
      </MemoryRouter>
    );

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

  it('shows loader while fetching and then displays cards', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);
    (fetchTotalImageCount as jest.Mock).mockResolvedValue(mockTotalImageCount);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <MainBlock />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText(mockBreedResponse[0].name)).toBeInTheDocument();
    });
  });
});
