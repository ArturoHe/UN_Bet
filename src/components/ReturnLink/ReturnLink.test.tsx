import React from 'react';
import { render, screen } from '@testing-library/react';
import ReturnLink from './index';

describe('ReturnLink Component', () => {
  it('renders the return link', () => {
    render(<ReturnLink />);
    const link = screen.getByText(/volver/i);
    expect(link).toBeInTheDocument();
  });

  it('renders as an anchor tag', () => {
    render(<ReturnLink />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('has correct href', () => {
    render(<ReturnLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#');
  });
});
