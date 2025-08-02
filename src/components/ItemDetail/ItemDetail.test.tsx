import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ItemDetail from './ItemDetail';
import * as catApi from '../../api/catApi';
import '@testing-library/jest-dom';

jest.mock('../../api/catApi');

const mockBreed = {
  id: 'abc',
  name: 'Abyssinian',
  description: 'This is a cat breed description',
} as const;

const mockImageUrl = 'https://example.com/cat.jpg';

describe('ItemDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders breed details successfully', async () => {
    (catApi.fetchBreedAndImageUrl as jest.Mock).mockResolvedValue({
      breed: mockBreed,
      imageUrl: mockImageUrl,
    });

    render(
      <MemoryRouter initialEntries={['/details/abc']}>
        <Routes>
          <Route path="/details/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockBreed.name)).toBeInTheDocument();
    });

    expect(screen.getByAltText(mockBreed.name)).toHaveAttribute(
      'src',
      mockImageUrl
    );
    expect(screen.getByText(mockBreed.description)).toBeInTheDocument();
  });

  it('shows error if API call fails', async () => {
    (catApi.fetchBreedAndImageUrl as jest.Mock).mockRejectedValue(
      new Error('API failed')
    );

    render(
      <MemoryRouter initialEntries={['/details/abc']}>
        <Routes>
          <Route path="/details/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: API failed');
    });
  });

  it('shows "Invalid ID" if id param is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/details']}>
        <Routes>
          <Route path="/details" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: Invalid ID');
    });
  });
});
