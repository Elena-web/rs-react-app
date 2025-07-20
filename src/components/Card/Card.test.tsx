import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card component', () => {
  it('renders with provided title and imageUrl', () => {
    const title = 'Cute Cat';
    const imageUrl = 'https://example.com/cat.jpg';

    render(<Card title={title} imageUrl={imageUrl} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', imageUrl);
    expect(img).toHaveAttribute('alt', title);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders fallback image when imageUrl is missing', () => {
    const title = 'Fallback Cat';
    render(<Card title={title} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });

  it('uses fallback image when imageUrl is empty string', () => {
    const title = 'Empty URL Cat';
    render(<Card title={title} imageUrl="   " />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placekitten.com/300/200');
  });
});
