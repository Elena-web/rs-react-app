import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardList from './CardList';

jest.mock('../Card/Card', () => (props: { title: string; imageUrl?: string }) => (
  <div data-testid="card">{props.title}</div>
));

jest.mock('../CardSkeleton/CardSkeleton', () => () => <div data-testid="card-skeleton">Loading...</div>);

describe('CardList component', () => {
  it('renders Card components when not loading', () => {
    const items = [
      { title: 'Card 1', imageUrl: 'https://example.com/1.jpg' },
      { title: 'Card 2', imageUrl: 'https://example.com/2.jpg' },
    ];

    render(<CardList items={items} loading={false} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Card 1');
    expect(cards[1]).toHaveTextContent('Card 2');
  });

  it('renders CardSkeleton components when loading is true', () => {
    render(<CardList items={[]} loading={true} />);

    const skeletons = screen.getAllByTestId('card-skeleton');
    expect(skeletons).toHaveLength(6);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveTextContent('Loading...');
    });
  });
});
