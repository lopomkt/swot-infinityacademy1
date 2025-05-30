
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup global test environment
beforeAll(() => {
  // Mock environment variables
  Object.defineProperty(import.meta.env, 'VITE_GROQ_API_KEY', {
    value: 'test-groq-api-key',
    writable: true,
  });

  Object.defineProperty(import.meta.env, 'DEV', {
    value: true,
    writable: true,
  });

  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  // Mock fetch
  global.fetch = vi.fn();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});
