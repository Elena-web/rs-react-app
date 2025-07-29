import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders input with value from localStorage if present', () => {
    localStorage.setItem('searchTerm', JSON.stringify('Bengal'));

    const mockOnSearch = jest.fn();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Siberian') as HTMLInputElement;
    expect(input.value).toBe('Bengal');
  });

  test('updates state and input value on change', async () => {
    const mockOnSearch = jest.fn();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Siberian') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, 'Sphynx');

    expect(input.value).toBe('Sphynx');
  });

  test('calls onSearch with trimmed value and updates localStorage', async () => {
    const mockOnSearch = jest.fn();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Siberian');
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.clear(input);
    await userEvent.type(input, '  Maine Coon  ');
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Maine Coon');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);

    const stored = localStorage.getItem('searchTerm');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored ?? '')).toBe('Maine Coon');
  });
});
