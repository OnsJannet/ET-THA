import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductSlider = ({ items }) => {
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  return (
    <div className="relative h-screen overflow-hidden bg-blue-50">
      <div
        ref={scrollRef}
        className="flex h-full overflow-x-hidden snap-mandatory snap-x"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 snap-align-start"
          >
            <div className="relative z-10 max-w-7xl w-full">
              {/* Mobile */}
              <div className="block lg:hidden text-center">
                <span className="inline-block bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                  {item.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {item.name}
                </h1>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-6">
                  ${item.price.toLocaleString()}
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto mb-6 object-contain rounded-xl max-h-60 sm:max-h-80"
                  draggable={false}
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                  <Link
                    to={`/items/${item.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                  >
                    Shop Now
                  </Link>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">
                <div className="text-left">
                  <span className="inline-block bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                    {item.category}
                  </span>
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {item.name}
                  </h1>
                  <p className="text-lg xl:text-xl text-gray-600 mb-8 max-w-lg">
                    Experience premium quality and innovative design with our
                    flagship product.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="text-3xl xl:text-4xl font-bold text-green-600">
                      ${item.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-400 line-through">
                      ${Math.round(item.price * 1.2).toLocaleString()}
                    </div>
                    <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      SAVE 20%
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/items/${item.id}`}
                      className="bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-700 transition-colors duration-300 text-center"
                    >
                      Shop Now
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain rounded-xl w-full max-w-sm xl:max-w-md max-h-96"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Navigation */}
      <button
        onClick={goToPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-200 text-gray-600 p-2 sm:p-3 rounded-full hover:bg-white hover:border-gray-300 hover:text-gray-800 transition-all duration-300 z-20 shadow-md"
        aria-label="Previous slide"
      >
        &#8592;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-200 text-gray-600 p-2 sm:p-3 rounded-full hover:bg-white hover:border-gray-300 hover:text-gray-800 transition-all duration-300 z-20 shadow-md"
        aria-label="Next slide"
      >
        &#8594;
      </button>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/80 border border-gray-200 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-gray-700 z-20 backdrop-blur-sm">
        {currentSlide + 1} / {items.length}
      </div>
    </div>
  );
};

export default ProductSlider;