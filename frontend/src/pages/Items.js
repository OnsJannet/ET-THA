import React, { useEffect, useRef, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import ProductSlider from "../components/ProductSlider";
import Pagination from "../components/Pagination";

// Constants for pagination
const ITEMS_PER_PAGE = 4;

function Items() {
  const { items: rawItems, fetchItems } = useData();
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Grid & Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const items = rawItems || [];

  // Fetch items
  useEffect(() => {
    fetchItems()
      .then(() => setLoading(false))
      .catch((err) => console.error("Fetch error:", err));
  }, [fetchItems]);

  // Slider helpers
  const getSlideWidth = () => scrollRef.current?.clientWidth || 0;

  const goToSlide = (slideIndex) => {
    if (!items.length) return;
    const totalSlides = items.length;
    let normalizedIndex =
      ((slideIndex % totalSlides) + totalSlides) % totalSlides;
    setCurrentSlide(normalizedIndex);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = normalizedIndex * getSlideWidth();
    }
  };

  const goToNext = () => goToSlide(currentSlide + 1);
  const goToPrev = () => goToSlide(currentSlide - 1);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, items.length]);

  // Grid items filtering
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Slider Section */}
      <ProductSlider items={items} />

      {/* Grid Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Products
              </h2>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {filteredItems.length} items
              </span>
            </div>

            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your search.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-lg flex flex-col items-center transition-all duration-300 hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4"
                    />
                    <h3 className="font-bold text-base sm:text-lg mb-2 text-center line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-semibold mb-2">
                      ${item.price.toLocaleString()}
                    </p>
                    <Link
                      to={`/items/${item.id}`}
                      className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full text-center"
                    >
                      Shop Now
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;