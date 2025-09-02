import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Items from "../pages/Items";
import { useData } from "../state/DataContext";

// Mock the DataContext
jest.mock("../state/DataContext", () => ({
  useData: jest.fn(),
}));

// Mock items data - simplified for testing
const mockItems = [
  {
    id: 1,
    name: "Laptop Pro",
    category: "Electronics",
    price: 2499,
    image: "/images/laptop.jpg",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 999,
    image: "/images/phone.jpg",
  },
];

describe("Items Page", () => {
  beforeEach(() => {
    useData.mockReturnValue({
      items: mockItems,
      fetchItems: jest.fn().mockResolvedValue(mockItems),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders product items after loading", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Items />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      // Look for specific elements that are unique to the grid view
      const shopNowButtons = screen.getAllByText("Shop Now");
      expect(shopNowButtons.length).toBeGreaterThan(0);

      // Check that we can find product names in some form
      const productElements = screen.queryAllByText(/Laptop Pro|Smartphone/i);
      expect(productElements.length).toBeGreaterThan(0);
    });
  });

  test("shows no products message when search has no results", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Items />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      // Wait for products to load
      const shopNowButtons = screen.getAllByText("Shop Now");
      expect(shopNowButtons.length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await act(async () => {
      fireEvent.change(searchInput, {
        target: { value: "NonExistentProduct" },
      });
    });

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
