import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import ItemDetail from "../pages/ItemDetail";

// Mock the modules
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock console.error to suppress error logging
jest.spyOn(console, "error").mockImplementation(() => {});

describe("ItemDetail Page", () => {
  const mockItem = {
    id: 1,
    name: "Laptop Pro",
    category: "Electronics",
    price: 2499,
    image: "/images/laptop.jpg",
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Mock useParams
    useParams.mockReturnValue({ id: "1" });

    // Mock useNavigate
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

    // Mock fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/items/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItem),
        });
      }

      return Promise.reject(new Error("Not found"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error.mockClear();
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test("renders product details after loading", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ItemDetail />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();

      // Check for the main product price more specifically
      // Look for the price in the product info section
      const priceContainer = screen
        .getByText("Includes all taxes and fees")
        .closest("div");
      const priceElement = priceContainer.querySelector('[class*="text-3xl"]');
      expect(priceElement).toBeInTheDocument();

      // Handle the non-breaking space character ( )
      const priceText = priceElement.textContent.replace(/\D/g, "");
      expect(priceText).toBe("2499");
    });
  });

  test("renders error state when product fetch fails", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch"))
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <ItemDetail />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/error loading product/i)).toBeInTheDocument();
    });
  });

  // Alternative: Test without checking the exact price format
  test("renders product with correct details (price agnostic)", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ItemDetail />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      // Check for specific elements that should be present
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();

      // Verify that a price element exists without checking format
      const priceElements = screen.getAllByText(/\$/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });
});
