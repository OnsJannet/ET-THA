import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the react-router-dom with basic implementations
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(), // Make this a jest.fn() that can be overridden
}));

// Mock the DataContext
jest.mock('../src/state/DataContext', () => ({
  useData: jest.fn(() => ({
    items: [],
    fetchItems: jest.fn().mockResolvedValue([]),
  })),
}));

// Suppress React Router future flag warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && 
    args[0].includes('React Router Future Flag Warning')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};