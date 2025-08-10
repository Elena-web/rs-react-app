import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import CardList from './CardList';

const mockStore = configureStore([]);

describe('CardList component', () => {
  let store: ReturnType<typeof mockStore>;

  const mockToggleSelect = jest.fn();
  const selectedIds = ['1'];

  beforeEach(() => {
    store = mockStore({
      selection: { selectedIds },
    });
  });

  it('renders Card components when not loading', () => {
    const items = [
      {
        id: '1',
        imageId: 'img1',
        title: 'Card 1',
        imageUrl: 'https://example.com/1.jpg',
        detailsUrl: 'https://example.com/details/1',
      },
      {
        id: '2',
        imageId: 'img2',
        title: 'Card 2',
        imageUrl: 'https://example.com/2.jpg',
        detailsUrl: 'https://example.com/details/2',
      },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList
            items={items}
            loading={false}
            selectedIds={selectedIds}
            onToggleSelect={mockToggleSelect}
          />
        </MemoryRouter>
      </Provider>
    );

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Card 1');
    expect(cards[1]).toHaveTextContent('Card 2');
  });

  it('renders nothing when items list is empty and loading is false', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList
            items={[]}
            loading={false}
            selectedIds={selectedIds}
            onToggleSelect={mockToggleSelect}
          />
        </MemoryRouter>
      </Provider>
    );

    const cards = screen.queryAllByTestId('card');
    expect(cards).toHaveLength(0);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
