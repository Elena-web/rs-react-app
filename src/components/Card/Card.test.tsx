import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card component', () => {
  it('renders with provided title and imageUrl', () => {
    const id = '1';
    const title = 'Cute Cat';
    const imageUrl = 'https://example.com/cat.jpg';

    render(
      <MemoryRouter>
        <Card id={id} title={title} imageUrl={imageUrl} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', imageUrl);
    expect(img).toHaveAttribute('alt', title);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders fallback image when imageUrl is missing', () => {
    const id = '2';
    const title = 'Fallback Cat';
    render(
      <MemoryRouter>
        <Card id={id} title={title} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('uses fallback image when imageUrl is empty string', () => {
    const id = '3';
    const title = 'Empty URL Cat';
    render(
      <MemoryRouter>
        <Card id={id} title={title} imageUrl="   " />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('renders fallback image when imageUrl is null', () => {
    const id = '4';
    const title = 'Null URL Cat';
    render(
      <MemoryRouter>
        <Card id={id} title={title} imageUrl={null} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('renders fallback image when imageUrl is undefined', () => {
    const id = '5';
    const title = 'Undefined URL Cat';
    render(
      <MemoryRouter>
        <Card id={id} title={title} imageUrl={undefined} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });
});
