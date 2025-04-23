import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock window.btoa and window.atob
const btoaMock = (str: string) => Buffer.from(str, 'binary').toString('base64');
const atobMock = (str: string) => Buffer.from(str, 'base64').toString('binary');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Set up the mocks
Object.defineProperty(window, 'btoa', { value: btoaMock });
Object.defineProperty(window, 'atob', { value: atobMock });
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
