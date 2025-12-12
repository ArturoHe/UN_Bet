import { render, screen, fireEvent } from '@testing-library/react';
import ButtonAction from './index';

describe('ButtonAction Component', () => {
  it('renders with correct text', () => {
    render(<ButtonAction text="Action" />);
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<ButtonAction text="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards button attributes correctly', () => {
    render(<ButtonAction text="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies correct CSS classes', () => {
    render(<ButtonAction text="Styled" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'container-fluid');
  });

  it('handles type attribute', () => {
    render(<ButtonAction text="Submit" type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
