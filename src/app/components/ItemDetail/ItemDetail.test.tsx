import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ItemDetail from './ItemDetail';
import * as catApi from '../../../api/catApi';
import '@testing-library/jest-dom';

jest.mock('../../../api/catApi');

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({
    get: (key: string) => {
      if (key === 'id') return 'abc';
      return null;
    },
  })),
}));

const mockedCatApi = jest.mocked(catApi);
const mockedNavigation = jest.mocked(jest.requireMock('next/navigation'), {
  shallow: false,
});

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
    mockedCatApi.fetchBreedAndImageUrl.mockResolvedValue({
      breed: mockBreed,
      imageUrl: mockImageUrl,
    });

    render(<ItemDetail />);

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
    mockedCatApi.fetchBreedAndImageUrl.mockRejectedValue(
      new Error('API failed')
    );

    render(<ItemDetail />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: API failed');
    });
  });

  it('shows "Invalid ID" if id param is missing', async () => {
    mockedNavigation.useSearchParams.mockReturnValue({
      get: () => null,
    });

    render(<ItemDetail />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: Invalid ID');
    });
  });
});
