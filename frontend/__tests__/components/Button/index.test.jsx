import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Button from '../../../src/components/Button';

describe('Button Component', () => {
  test('should render with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  test('should render in loading state', () => {
    render(<Button isLoading>Click Me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled(); // Button should be disabled in loading state
    expect(button).toHaveTextContent('Loading...');
    expect(button.querySelector('svg')).toBeInTheDocument(); // Check for loading spinner
  });

  test('should be disabled when isDisabled is true', () => {
    render(<Button isDisabled>Click Me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('should call onClick when clicked', async () => {
    const handleClick = vi.fn(); // Create a mock function
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button); // Use userEvent to simulate a click

    expect(handleClick).toHaveBeenCalledTimes(1); // Check if onClick was called
  });
});
