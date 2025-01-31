import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect, useState } from "react"; // Only import useEffect and useState
import axios from "axios";
import { FaUser } from "react-icons/fa"; // Importing FontAwesome user icon

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // Store user info to check if logged in

  useEffect(() => {
    // Check if the user is logged in by fetching user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user data if logged in
    }

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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user details
    localStorage.removeItem("access_token"); // Remove JWT token if stored
    setUser(null); // Reset user state
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Container for the whole page */}
      <div className="flex flex-col mx-auto px-4 py-6 space-y-8">
        {/* Header with logo, login/logout, and navigation */}
        <header className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center max-w-screen-xl mx-auto">
            {/* Logo */}
            <div className="text-3xl font-bold text-blue-500">Nitro</div>

            {/* Conditional Login/Logout Button */}
            <div>
              {user ? (
                // If user is logged in, show Logout button
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              ) : (
                // If no user is logged in, show the login button
                <button
                  onClick={() => navigate("/login")} // Navigate to the login page
                  className="text-blue-400 hover:text-blue-500 font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4">
            <ul className="flex justify-center space-x-8">
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
        <main>
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
                    <p className="text-gray-600 mb-2">
                      {product.product_category}
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      ${product.product_price}
                    </p>
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
    </div>
  );
};

export default HomePage;
