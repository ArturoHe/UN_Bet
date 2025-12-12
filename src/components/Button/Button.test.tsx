import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as submit button when type is submit', () => {
    render(<Button text="Submit" type="submit" />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders as button by default', () => {
    render(<Button text="Default" />);
    const button = screen.getByRole('button', { name: /default/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies correct CSS classes', () => {
    render(<Button text="Styled" />);
    const button = screen.getByRole('button', { name: /styled/i });
    expect(button).toHaveClass('btn', 'btn-primary', 'container-fluid');
  });
});
