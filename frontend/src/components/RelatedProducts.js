import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from './Skeleton';

function RelatedProducts({ category, currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    
    setLoading(true);
    fetch(`http://localhost:3001/api/items?category=${category}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch related products');
        }
        return res.json();
      })
      .then(data => {
        // Filter out the current product and limit to 3 related products
        const filteredProducts = data
          .filter(product => product.id !== currentProductId)
          .slice(0, 3);
        setRelatedProducts(filteredProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching related products:', err);
        setLoading(false);
      });
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="mt-12">
        <Skeleton type="title" width="192px" className="mb-6" />
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
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain rounded-lg mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
              }}
            />
            <h3 className="font-bold text-base mb-2 text-center line-clamp-2">
              {product.name}
            </h3>
            <p className="text-green-600 font-semibold mb-2 text-center">
              ${product.price.toLocaleString()}
            </p>
            <Link
              to={`/items/${product.id}`}
              className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;