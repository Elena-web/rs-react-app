import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../../features/selectionSlice';
import Card from './Card';

const store = configureStore({
  reducer: {
    selection: selectionReducer,
  },
});

describe('Card component', () => {
  const mockToggleSelect = jest.fn();

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it('renders with provided title and imageUrl', () => {
    const id = '1';
    const title = 'Cute Cat';
    const imageUrl = 'https://example.com/cat.jpg';

    renderWithProviders(
      <Card
        id={id}
        title={title}
        imageUrl={imageUrl}
        isSelected={false}
        onToggleSelect={mockToggleSelect}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', imageUrl);
    expect(img).toHaveAttribute('alt', title);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders fallback image when imageUrl is missing', () => {
    const id = '2';
    const title = 'Fallback Cat';

    renderWithProviders(
      <Card
        id={id}
        title={title}
        isSelected={false}
        onToggleSelect={mockToggleSelect}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('uses fallback image when imageUrl is empty string', () => {
    const id = '3';
    const title = 'Empty URL Cat';

    renderWithProviders(
      <Card
        id={id}
        title={title}
        imageUrl="   "
        isSelected={false}
        onToggleSelect={mockToggleSelect}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('renders fallback image when imageUrl is null', () => {
    const id = '4';
    const title = 'Null URL Cat';

    renderWithProviders(
      <Card
        id={id}
        title={title}
        imageUrl={null}
        isSelected={false}
        onToggleSelect={mockToggleSelect}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('renders fallback image when imageUrl is undefined', () => {
    const id = '5';
    const title = 'Undefined URL Cat';

    renderWithProviders(
      <Card
        id={id}
        title={title}
        imageUrl={undefined}
        isSelected={false}
        onToggleSelect={mockToggleSelect}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });
});
