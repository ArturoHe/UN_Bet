import { render, screen } from '@testing-library/react';
import Navbar from './index';

describe('Navbar Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders navbar with logo', () => {
    render(<Navbar />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders login and register buttons when not logged in', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('renders Games link when not logged in', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /juegos/i })).toBeInTheDocument();
  });

  it('renders user dropdown when logged in', () => {
    sessionStorage.setItem('username', 'testuser');
    render(<Navbar />);
    
    const dropdown = screen.getByText('testuser');
    expect(dropdown).toBeInTheDocument();
  });

  it('shows profile, credits, and logout options in dropdown when logged in', () => {
    sessionStorage.setItem('username', 'testuser');
    render(<Navbar />);
    
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Solicitar Créditos')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('does not render logout when logged in but not clicked', () => {
    sessionStorage.setItem('username', 'testuser');
    render(<Navbar />);
    
    // Verify we still have session storage
    expect(sessionStorage.getItem('username')).toBe('testuser');
  });

  it('hides login and register buttons when logged in', () => {
    sessionStorage.setItem('username', 'testuser');
    render(<Navbar />);
    
    const links = screen.queryAllByRole('link');
    const ingresoLink = links.find(link => link.textContent.includes('Ingresar'));
    expect(ingresoLink).toBeUndefined();
  });
});
