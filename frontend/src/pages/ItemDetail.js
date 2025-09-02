import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RelatedProducts from '../components/RelatedProducts';
import Skeleton from '../components/Skeleton';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    setError(null);

    fetch('http://localhost:3001/api/items/' + id)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch item: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (isMounted.current) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted.current) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Detail Skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Image Skeleton */}
              <div className="flex justify-center">
                <Skeleton width="100%" height="320px" className="max-w-md rounded-lg" />
              </div>

              {/* Info Skeleton */}
              <div className="space-y-6">
                <Skeleton width="96px" height="24px" />
                <Skeleton width="256px" height="32px" />
                
                <div>
                  <Skeleton width="128px" height="32px" />
                  <Skeleton width="192px" height="16px" className="mt-2" />
                </div>
                
                <div>
                  <Skeleton width="112px" height="20px" />
                  <Skeleton width="100%" className="mt-2" />
                  <Skeleton width="83%" className="mt-1" />
                  <Skeleton width="67%" className="mt-1" />
                </div>
                
                <div className="flex gap-4">
                  <Skeleton type="button" containerClassName="flex-1" />
                  <Skeleton type="button" containerClassName="flex-1" />
                </div>
                
                <div className="pt-8 border-t border-gray-200">
                  <Skeleton width="80px" height="20px" />
                  <div className="mt-4 space-y-2">
                    <Skeleton width="100%" />
                    <Skeleton width="83%" />
                    <Skeleton width="67%" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <Skeleton type="title" width="192px" height="28px" className="mt-12 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <Skeleton type="image" height="160px" className="mb-4 rounded-lg" />
                <Skeleton type="text" width="75%" className="mb-2 mx-auto" />
                <Skeleton type="text" width="50%" className="mb-4 mx-auto" />
                <Skeleton type="button" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Product Detail */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {item.category}
                </span>
                <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">{item.name}</h1>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900">${item.price.toLocaleString()}</span>
                    <span className="ml-3 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">In Stock</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Includes all taxes and fees</p>
                </div>

                <div className="mt-6">
                  <h2 className="text-sm font-medium text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-600">
                    Premium quality {item.name} from our {item.category} collection. Designed with innovation and crafted with precision to deliver exceptional performance and reliability.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Save for Later
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Features</h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Premium quality materials</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">1-year warranty included</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Free shipping on orders over $50</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts category={item.category} currentProductId={item.id} />
      </div>
    </div>
  );
}

export default ItemDetail;