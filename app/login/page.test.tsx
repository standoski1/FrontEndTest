import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = login as jest.MockedFunction<typeof login>;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockAuthResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    };

    mockLogin.mockResolvedValueOnce(mockAuthResponse);

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});