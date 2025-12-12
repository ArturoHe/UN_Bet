# UN_Bet Frontend Testing Guide

## Overview
This project uses **Jest** and **React Testing Library** for unit and integration testing of React components and utilities.

## Test Setup

### Installed Dependencies
- `jest` - JavaScript testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM elements
- `@testing-library/user-event` - User interaction simulation
- `ts-jest` - TypeScript support for Jest
- `jest-environment-jsdom` - DOM environment for Jest
- `identity-obj-proxy` - Mock CSS modules

### Configuration Files
- `jest.config.cjs` - Main Jest configuration
- `tsconfig.spec.json` - TypeScript configuration for tests
- `src/setupTests.ts` - Test environment setup

## Running Tests

### Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

### File Naming Convention
- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Located in the same directory as the component/utility being tested

### Example Test File
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './index';

describe('MyComponent', () => {
  it('renders the component', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockFn = jest.fn();
    render(<MyComponent onClick={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## Current Test Coverage

### Components with Tests
1. **Button** (`src/components/Button/Button.test.tsx`)
   - Renders with correct text
   - Handles onClick events
   - Supports different button types (button, submit, reset)
   - Applies correct CSS classes

2. **ButtonAction** (`src/components/ButtonAction/ButtonAction.test.tsx`)
   - Renders button text
   - Handles clicks and standard HTML attributes
   - Supports disabled state
   - Accepts HTML button attributes

3. **LoginForm** (`src/components/LoginForm/LoginForm.test.tsx`)
   - Renders form fields (username, password)
   - Handles form submission
   - Integrates with API for authentication
   - Manages session storage
   - Handles errors gracefully

4. **CardLogin** (`src/components/CardLogin/CardLogin.test.tsx`)
   - Renders login card layout
   - Displays logo
   - Manages view state (initial, login, register, recover)
   - Shows appropriate forms based on user interaction

5. **ReturnLink** (`src/components/ReturnLink/ReturnLink.test.tsx`)
   - Renders navigation link
   - Correct href attribute

### Utilities with Tests
1. **axiosConfig** (`src/api/axiosConfig.test.ts`)
   - Axios instance configuration
   - Base URL and timeout settings
   - Default headers

## Testing Best Practices

### 1. Use Semantic Queries
```tsx
// ✅ Good
screen.getByRole('button', { name: 'Submit' })
screen.getByPlaceholderText('Username')
screen.getByText('Welcome')

// ❌ Avoid
screen.getByTestId('submit-button')
```

### 2. Test User Behavior, Not Implementation
```tsx
// ✅ Good
await userEvent.type(input, 'text');
await userEvent.click(button);

// ❌ Avoid
component.setState({ value: 'text' });
```

### 3. Mock External Dependencies
```tsx
jest.mock('../../api/axiosConfig');
const mockedApi = api as jest.Mocked<typeof api>;
mockedApi.get.mockResolvedValueOnce({ data: mockData });
```

### 4. Setup and Teardown
```tsx
beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});
```

### 5. Async Operations
```tsx
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

## Common Testing Patterns

### Testing Form Submission
```tsx
const user = userEvent.setup();
render(<LoginForm />);

await user.type(screen.getByPlaceholderText('Username'), 'testuser');
await user.type(screen.getByPlaceholderText('Password'), 'password');
await user.click(screen.getByRole('button', { name: /submit/i }));

await waitFor(() => {
  expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
    username: 'testuser',
    password: 'password',
  });
});
```

### Mocking API Calls
```tsx
jest.mock('../../api/axiosConfig');
const mockedApi = api as jest.Mocked<typeof api>;

it('handles successful API response', async () => {
  mockedApi.post.mockResolvedValueOnce({
    data: { access_token: 'test-token' },
  });

  // Test code here
});
```

### Testing Event Handlers
```tsx
it('calls onClick handler when button is clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} text="Click me" />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## CSS Modules in Tests

CSS modules are mocked using `identity-obj-proxy`, so you don't need to worry about styling in tests. The mock returns empty objects for CSS classes, allowing tests to focus on component logic.

```tsx
// CSS module import automatically mocked
import styles from './style.module.css';
// styles will be: { button: 'button', container: 'container', ... }
```

## Debugging Tests

### View Component Output
```tsx
import { render, screen } from '@testing-library/react';

render(<Component />);
screen.debug(); // Print DOM tree
```

### Watch Mode
```bash
npm run test:watch
```

Press:
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename pattern
- `t` - Filter by test name pattern
- `q` - Quit

## Coverage Goals

Current coverage includes:
- ✅ Core button components
- ✅ Authentication form
- ✅ Login card layout
- ✅ API utilities

### Next Steps for Coverage
- Add tests for more components (Navbar, Categories, SearchFilters)
- Add integration tests for multi-component workflows
- Add tests for utility functions
- Add snapshot tests for component rendering

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Troubleshooting

### CSS Module Import Errors
- Ensure `tsconfig.spec.json` is properly configured
- Check that `jest.config.cjs` has moduleNameMapper for CSS files

### Jest Matchers Not Found
- Make sure `@testing-library/jest-dom` is imported in `setupTests.ts`
- Verify `setupFilesAfterEnv` is configured in jest.config.cjs

### Async Test Timeouts
- Use `waitFor()` for elements that appear after async operations
- Increase timeout with `waitFor(() => {...}, { timeout: 5000 })`
