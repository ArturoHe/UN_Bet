/**
 * Test coverage guide for UN_Bet Frontend
 * 
 * This document outlines the test structure and coverage goals for the project.
 */

export const TEST_COVERAGE_GUIDE = {
  components: {
    description: 'Unit tests for React components',
    coverage: [
      'Button.test.tsx - Basic button component with onClick handling',
      'ButtonAction.test.tsx - Button with extended HTML attributes',
      'LoginForm.test.tsx - Form submission and validation',
      'CardLogin.test.tsx - Card layout component',
      'ReturnLink.test.tsx - Navigation link component',
    ],
  },
  api: {
    description: 'Tests for API utilities and axios configuration',
    coverage: [
      'axiosConfig.test.ts - Axios instance configuration and defaults',
    ],
  },
  integration: {
    description: 'Integration tests for component interactions',
    coverage: [
      'Components working together with API calls',
      'Form submissions with API integration',
      'Authentication flow',
    ],
  },
  bestPractices: [
    'Mock external dependencies (axios, API calls)',
    'Test user interactions using @testing-library/user-event',
    'Use meaningful test descriptions',
    'Setup and teardown with beforeEach/afterEach',
    'Test accessibility with role-based queries',
  ],
  runTests: {
    command: 'npm test',
    watch: 'npm run test:watch',
    coverage: 'npm run test:coverage',
  },
};
