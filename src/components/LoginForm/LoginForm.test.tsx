import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './index';
import api from '../../api/axiosConfig';

// Mock the axios config
jest.mock('../../api/axiosConfig');

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders login form with input fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renders forgot password and return links', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('calls onRecoverPassword when forgot password is clicked', () => {
    const handleRecover = jest.fn();
    render(<LoginForm onRecoverPassword={handleRecover} />);
    
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));
    expect(handleRecover).toHaveBeenCalledTimes(1);
  });

  it('calls onReturn when return link is clicked', () => {
    const handleReturn = jest.fn();
    render(<LoginForm onReturn={handleReturn} />);
    
    fireEvent.click(screen.getByText('Volver'));
    expect(handleReturn).toHaveBeenCalledTimes(1);
  });

  it('handles form submission with valid credentials', async () => {
    const mockToken = 'test-token-123';
    const mockUserId = 'user-123';
    const mockUsername = 'testuser';

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: mockToken },
    });

    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { id: mockUserId, username: mockUsername },
    });

    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(sessionStorage.getItem('jwtToken')).toBe(mockToken);
      expect(sessionStorage.getItem('username')).toBe(mockUsername);
      expect(sessionStorage.getItem('id')).toBe(mockUserId);
    });
  });

  it('shows alert on login error', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
    
    window.alert = jest.fn();

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText('Usuario'), 'user');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'pass');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error en el inicio de sesión');
    });
  });

  it('requires username and password fields', () => {
    render(<LoginForm />);
    
    const usernameInput = screen.getByPlaceholderText('Usuario') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Contraseña') as HTMLInputElement;
    
    expect(usernameInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });
});
