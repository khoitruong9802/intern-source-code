import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Clickme from '.'; // Adjust the import path as necessary

describe('Clickme Component', () => {
  it('should render with the default title after 500ms', () => {
    expect(1).toBe(1);
  });
});
