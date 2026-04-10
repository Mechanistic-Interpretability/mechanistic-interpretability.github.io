// Jest setup file
// This runs before each test file

// Import testing-library jest-dom matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 0);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Suppress console errors during tests (optional)
// const originalError = console.error;
// console.error = (...args) => {
//   if (/Warning.*not wrapped in act/.test(args[0])) {
//     return;
//   }
//   originalError.call(console, ...args);
// };
