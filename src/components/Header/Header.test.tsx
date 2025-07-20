import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Header from './Header';

vi.mock('../Search/Search', () => ({
  default: ({ onSearch }: { onSearch: (term: string) => void }) => (
    <button onClick={() => onSearch('Maine Coon')}>Mock Search</button>
  ),
}));

describe('Header Component', () => {
  test('renders title and subtitles', () => {
    const mockOnSearch = vi.fn();
    render(<Header onSearch={mockOnSearch} />);

    expect(
      screen.getByText(/Discover Your Purrfect Breed/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Use the field below to find the cat breed/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Maine, Bengal, Sphynx/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Search/)).toBeInTheDocument();
  });

  test('calls onSearch when Search component triggers it', async () => {
    const mockOnSearch = vi.fn();
    render(<Header onSearch={mockOnSearch} />);

    const button = screen.getByText('Mock Search');
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Maine Coon');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});