import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import { fetchCatCards } from '../../api/catApi';
import { mockImageResponse } from './__mocks__/mocks';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../api/catApi', () => ({
  fetchCatCards: jest.fn(),
}));

describe('MainBlock component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const mockCards = mockImageResponse.map((img) => ({
    id: img.id,
    imageUrl: img.url,
    title: img.breeds?.[0]?.name || 'Funny cat',
  }));

  it('renders cat cards after loading', async () => {
    (fetchCatCards as jest.Mock).mockResolvedValue({
      cards: mockCards,
      totalPages: 3,
    });

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

    expect(screen.queryByText(mockCards[0].title)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockCards[0].title)).toBeInTheDocument();
    });
  });

  it('renders "Funny cat" when images have no breeds', async () => {
    const mockFunnyCats = [
      { id: '1', imageUrl: 'image1.jpg', title: 'Funny cat' },
      { id: '2', imageUrl: 'image2.jpg', title: 'Funny cat' },
    ];

    (fetchCatCards as jest.Mock).mockResolvedValue({
      cards: mockFunnyCats,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
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

    (fetchCatCards as jest.Mock).mockRejectedValue(new Error('API error'));

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/api error/i);
    });
  });

  it('increments page when clicking Next button', async () => {
    (fetchCatCards as jest.Mock).mockResolvedValue({
      cards: mockCards,
      totalPages: 5,
    });

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCatCards).toHaveBeenCalledWith(expect.any(String), 2);
    });
  });

  it('decrements page when clicking Previous button', async () => {
    (fetchCatCards as jest.Mock).mockResolvedValue({
      cards: mockCards,
      totalPages: 5,
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <MainBlock />
      </MemoryRouter>
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(fetchCatCards).toHaveBeenCalledWith(expect.any(String), 1);
    });
  });

  it('shows loader during fetch and hides after', async () => {
    (fetchCatCards as jest.Mock).mockResolvedValue({
      cards: mockCards,
      totalPages: 3,
    });

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });
});
