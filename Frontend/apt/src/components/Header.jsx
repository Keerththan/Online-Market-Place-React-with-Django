import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to get the current path
import { useState, useEffect } from "react"; // Only import useEffect and useState
import { FaUser } from "react-icons/fa"; // Importing FontAwesome user icon

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in by fetching user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user data if logged in
    }
  }, [location.pathname]); // Add location.pathname as a dependency

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    localStorage.removeItem("access_token"); // Remove JWT token if stored
    setUser(null); // Reset user state
    navigate("/"); // Redirect to home page
  };

  return (
    <header className="bg-gray-900 text-white p-5 shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center mx-auto">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 cursor-pointer">
          Nitro
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="hidden md:flex space-x-8 text-lg font-medium">
            <li>
              <a href="#home" className="hover:text-blue-400 transition duration-300">
                Home
              </a>
            </li>
            <li>
              <a href="#products" className="hover:text-blue-400 transition duration-300">
                Products
              </a>
            </li>
            <li>
              <a href="#faqs" className="hover:text-blue-400 transition duration-300">
                FAQs
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-400 transition duration-300">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Conditional Login / Logout Button */}
        <div>
          {/* If we are on the Seller Dashboard, don't show the login/logout button */}
          {location.pathname !== "/sellerDash" && (
            <div>
              {user ? (
                // Check if the user is a buyer or seller and display accordingly
                <button
                  onClick={handleLogout}
                  className={`px-5 py-2 rounded-md transition-all duration-300 hover:scale-105 ${
                    user.user_type === "buyer"
                      ? "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:bg-teal-700"
                      : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:bg-pink-700"
                  }`}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
