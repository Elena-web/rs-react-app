import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MainBlock from './MainBlock';
import * as catApi from '../../api/catApi';
import type { RootState } from '../../store/store';
import type { CatCard } from '../../features/selectionSlice';

const mockStore = configureStore<Partial<RootState>>([]);

jest.mock('../../api/catApi');
jest.mock('../../hooks/useLocalStorage', () => () => ['', jest.fn()]);
jest.mock('../../features/selectionSlice', () => ({
  clearSelection: jest.fn(() => ({ type: 'CLEAR_SELECTION' })),
  toggleSelection: jest.fn((id: string) => ({
    type: 'TOGGLE_SELECTION',
    payload: id,
  })),
}));

describe('MainBlock', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      selection: {
        selectedIds: [],
        selectedItems: {},
      },
    });

    (catApi.useGetAllBreedsQuery as jest.Mock).mockReturnValue({
      data: [{ id: 'abys' }],
    });
    (catApi.useGetBreedsByQueryQuery as jest.Mock).mockReturnValue({
      data: [],
    });
    (catApi.useGetCatImagesQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          url: 'https://example.com/cat.jpg',
          breeds: [{ name: 'Abyssinian', description: 'Active and playful' }],
        },
      ],
      isLoading: false,
      error: null,
    });
    (catApi.useGetTotalImageCountQuery as jest.Mock).mockReturnValue({
      data: 1,
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainBlock />}>
              <Route path="details/:id" element={<div>Details Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

  it('renders Header and CardList', async () => {
    renderComponent();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(await screen.findByText('Abyssinian')).toBeInTheDocument();
  });

  it('shows error message when imagesError is present', () => {
    (catApi.useGetCatImagesQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: true,
    });

    renderComponent();
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load data.');
  });

  it('renders Pagination when items are loaded', async () => {
    renderComponent();
    expect(await screen.findByText(/1\s*из\s*1/)).toBeInTheDocument();
  });

  it('renders SelectionBlock when items are selected', () => {
    store = mockStore({
      selection: {
        selectedIds: ['1'],
        selectedItems: {
          '1': {
            id: '1',
            imageId: 'img1',
            imageUrl: 'https://example.com/cat.jpg',
            title: 'Abyssinian',
            detailsUrl: '/details/1',
            breeds: [{ name: 'Abyssinian', description: 'Active and playful' }],
          } as CatCard,
        },
      },
    });
    renderComponent();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });
});
