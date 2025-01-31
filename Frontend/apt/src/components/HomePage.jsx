import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import Header from "./Header";  // Import the Header component

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch products data
    axios
      .get("http://127.0.0.1:8000/inventory/products/")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Render Header Component */}

      {/* Main Content */}
      <main className="px-10 py-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Our Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl overflow-hidden"
                onClick={() => navigate(`/product/${product.id}`)} // Navigate to product detail page on click
              >
                <div className="relative h-80 w-full group">
                  <img
                    src={`http://127.0.0.1:8000/inventory${product.product_image}`}
                    alt={product.product_name}
                    className="object-contain w-full h-full group-hover:opacity-75 transition-opacity duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600 mb-2">{product.product_category}</p>
                  <p className="text-xl font-semibold text-gray-800">${product.product_price}</p>
                  <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
