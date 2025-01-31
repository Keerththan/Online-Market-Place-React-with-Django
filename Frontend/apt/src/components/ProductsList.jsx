import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    axios.get("http://localhost:8000/api/products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl font-semibold mt-4">{product.product_name}</h3>
            <p className="text-gray-600">{product.product_category}</p>
            <p className="text-lg font-semibold mt-2">${product.product_price}</p>
            <button className="bg-blue-500 text-white mt-4 py-2 px-6 rounded-md hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductsList;
