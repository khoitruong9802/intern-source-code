import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Error from '../../../src/components/Error';

describe('Error Component', () => {
  test('should render the error message', () => {
    const message = 'An error occurred!';
    render(<Error message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument(); // Check if the error message is displayed
  });

  test('should render the reload button', () => {
    render(<Error message="Error!" />);

    const button = screen.getByRole('button', { name: /reload this page/i });
    expect(button).toBeInTheDocument(); // Check if the reload button is present
  });

  test('should call window.location.reload when the button is clicked', async () => {
    // Create a mock for window.location
    const originalLocation = window.location;
    delete window.location; // Delete the original location
    window.location = { reload: vi.fn() }; // Mock the reload function

    render(<Error message="Error!" />);

    const button = screen.getByRole('button', { name: /reload this page/i });
    await userEvent.click(button); // Simulate a click on the button

    expect(window.location.reload).toHaveBeenCalled(); // Verify that window.location.reload was called

    // Restore the original location object
    window.location = originalLocation;
  });
});
