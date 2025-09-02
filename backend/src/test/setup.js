// Global test setup
jest.setTimeout(10000);

// Mock console.error to reduce test noise
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Error in stats endpoint')) {
    // Allow expected error messages
    originalError(...args);
  }
};