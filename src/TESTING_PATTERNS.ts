/**
 * Testing Patterns and Examples
 * Reference guide for writing new tests
 */

// ============================================
// 1. BASIC COMPONENT TEST
// ============================================
// import { render, screen } from '@testing-library/react';
// import MyComponent from './index';
//
// describe('MyComponent', () => {
//   it('renders with correct text', () => {
//     render(<MyComponent />);
//     expect(screen.getByText('Expected Text')).toBeInTheDocument();
//   });
// });

// ============================================
// 2. COMPONENT WITH PROPS TEST
// ============================================
// describe('Button Component', () => {
//   it('renders with custom text', () => {
//     render(<Button text="Click Me" />);
//     expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
//   });
//
//   it('calls onClick when clicked', () => {
//     const mockFn = jest.fn();
//     render(<Button onClick={mockFn} text="Click" />);
//     fireEvent.click(screen.getByRole('button'));
//     expect(mockFn).toHaveBeenCalledTimes(1);
//   });
// });

// ============================================
// 3. FORM SUBMISSION TEST
// ============================================
// import userEvent from '@testing-library/user-event';
// import { waitFor } from '@testing-library/react';
//
// describe('LoginForm', () => {
//   it('submits form with user data', async () => {
//     const mockSubmit = jest.fn();
//     const user = userEvent.setup();
//     
//     render(<LoginForm onSubmit={mockSubmit} />);
//     
//     await user.type(screen.getByPlaceholderText('Username'), 'testuser');
//     await user.type(screen.getByPlaceholderText('Password'), 'pass123');
//     await user.click(screen.getByRole('button', { name: /submit/i }));
//     
//     await waitFor(() => {
//       expect(mockSubmit).toHaveBeenCalledWith({
//         username: 'testuser',
//         password: 'pass123',
//       });
//     });
//   });
// });

// ============================================
// 4. API MOCKING TEST
// ============================================
// import api from '../../api/axiosConfig';
// jest.mock('../../api/axiosConfig');
//
// describe('DataFetcher Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//
//   it('displays data from API', async () => {
//     const mockedApi = api as jest.Mocked<typeof api>;
//     mockedApi.get.mockResolvedValueOnce({
//       data: { id: 1, name: 'Test Data' },
//     });
//
//     render(<DataFetcher />);
//     
//     await waitFor(() => {
//       expect(screen.getByText('Test Data')).toBeInTheDocument();
//     });
//   });
//
//   it('handles API errors', async () => {
//     const mockedApi = api as jest.Mocked<typeof api>;
//     mockedApi.get.mockRejectedValueOnce(new Error('API Error'));
//
//     render(<DataFetcher />);
//     
//     await waitFor(() => {
//       expect(screen.getByText(/error/i)).toBeInTheDocument();
//     });
//   });
// });

// ============================================
// 5. STATE MANAGEMENT TEST
// ============================================
// describe('Counter Component', () => {
//   it('increments counter on button click', async () => {
//     const user = userEvent.setup();
//     render(<Counter initialValue={0} />);
//     
//     const button = screen.getByRole('button', { name: /increment/i });
//     await user.click(button);
//     
//     expect(screen.getByText('1')).toBeInTheDocument();
//   });
// });

// ============================================
// 6. CONDITIONAL RENDERING TEST
// ============================================
// describe('UserProfile', () => {
//   it('shows login button when not authenticated', () => {
//     render(<UserProfile isAuthenticated={false} />);
//     expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
//   });
//
//   it('shows user info when authenticated', () => {
//     render(<UserProfile isAuthenticated={true} username="john" />);
//     expect(screen.getByText('john')).toBeInTheDocument();
//   });
// });

// ============================================
// 7. SESSION STORAGE TEST
// ============================================
// describe('AuthComponent', () => {
//   beforeEach(() => {
//     sessionStorage.clear();
//   });
//
//   it('saves token to session storage', async () => {
//     const user = userEvent.setup();
//     render(<LoginForm />);
//     
//     await user.type(screen.getByPlaceholderText('Username'), 'user');
//     await user.type(screen.getByPlaceholderText('Password'), 'pass');
//     await user.click(screen.getByRole('button', { name: /login/i }));
//     
//     await waitFor(() => {
//       expect(sessionStorage.getItem('token')).toBe('some-token');
//     });
//   });
// });

// ============================================
// 8. DROPDOWN/SELECT TEST
// ============================================
// describe('Dropdown Component', () => {
//   it('opens dropdown on click', async () => {
//     const user = userEvent.setup();
//     render(<Dropdown />);
//     
//     await user.click(screen.getByRole('button'));
//     expect(screen.getByText('Option 1')).toBeInTheDocument();
//   });
//
//   it('selects option on click', async () => {
//     const handleSelect = jest.fn();
//     const user = userEvent.setup();
//     render(<Dropdown onSelect={handleSelect} />);
//     
//     await user.click(screen.getByRole('button'));
//     await user.click(screen.getByText('Option 1'));
//     
//     expect(handleSelect).toHaveBeenCalledWith('option1');
//   });
// });

// ============================================
// 9. UTILITY FUNCTION TEST
// ============================================
// import { formatCurrency } from './utils';
//
// describe('formatCurrency', () => {
//   it('formats number as currency', () => {
//     expect(formatCurrency(1000)).toBe('$1,000.00');
//   });
//
//   it('handles decimal values', () => {
//     expect(formatCurrency(99.5)).toBe('$99.50');
//   });
// });

// ============================================
// 10. SNAPSHOT TEST
// ============================================
// describe('Card Component', () => {
//   it('matches snapshot', () => {
//     const { container } = render(
//       <Card title="Test" description="Test description" />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });
// });

export const TESTING_PATTERNS = {
  basicComponent: 'Pattern 1',
  componentWithProps: 'Pattern 2',
  formSubmission: 'Pattern 3',
  apiMocking: 'Pattern 4',
  stateManagement: 'Pattern 5',
  conditionalRendering: 'Pattern 6',
  sessionStorage: 'Pattern 7',
  dropdownSelect: 'Pattern 8',
  utilityFunctions: 'Pattern 9',
  snapshotTesting: 'Pattern 10',
};
