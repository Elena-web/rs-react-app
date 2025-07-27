import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MainBlock from './MainBlock';
import { fetchBreedsByQuery, fetchCatImages } from '@api/catApi';
import { mockBreedResponse, mockImageResponse } from './__mocks__/mocks';
import { MemoryRouter } from 'react-router-dom';

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

    render(
      <MemoryRouter>
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

    (fetchBreedsByQuery as jest.Mock).mockRejectedValue(new Error('API error'));
    (fetchCatImages as jest.Mock).mockRejectedValue(new Error('API error'));

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
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <MainBlock />
      </MemoryRouter>
    );

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

  it('renders cat cards after loading', async () => {
    (fetchBreedsByQuery as jest.Mock).mockResolvedValue(mockBreedResponse);
    (fetchCatImages as jest.Mock).mockResolvedValue(mockImageResponse);

    render(
      <MemoryRouter>
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
