import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect, useState } from "react"; // Only import useEffect and useState
import axios from "axios";
import imge from "../../public/images/headphone.jpg"; // Image path

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/inventory/products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Container for the whole page */}
      <div className="flex-1 mx-auto px-4 py-6">
        {/* Header with logo, login, and navigation */}
        <header className="bg-gray-600 text-white p-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-bold">
              <span className="text-white">Nitro</span>
            </div>

            {/* Login Button */}
            <div>
              <button
                onClick={() => navigate("/login")} // Navigate to the login page
                className="text-blue-600 hover:underline"
              >
                <div>Login</div>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <a href="#home" className="text-white hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-white hover:text-gray-300">
                  Products
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-white hover:text-gray-300">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="mt-6">
          <h2 className="text-black text-2xl font-semibold text-center mb-6">
            Our Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <img
                    src={imge}
                    // src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="text-black text-xl font-semibold mt-4">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600">{product.product_category}</p>
                  <p className="text-black text-lg font-semibold mt-2">
                    ${product.product_price}
                  </p>
                  <button className="bg-blue-500 text-white mt-4 py-2 px-6 rounded-md hover:bg-blue-600">
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
