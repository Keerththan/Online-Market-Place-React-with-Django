import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Importing useNavigate for redirection

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate for redirecting

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/inventory/login/", { email, password })
      .then((response) => {
        // Assuming the response contains JWT tokens and user details
        const { access, refresh, user } = response.data;
       
        
        // Save tokens to localStorage or cookies for later use
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        // Optionally save user info if needed
        localStorage.setItem("user", JSON.stringify(user));
        

        // Navigate to the appropriate page based on user type
        if (user.user_type === "seller") {
          navigate("/sellerDash");  // Redirect to Seller Dashboard if user is seller
        } else if (user.user_type === "buyer") {
          navigate("/");  // Redirect to Home if user is buyer
        } else {
          navigate("/"); // Redirect to default route if user type is unknown
        }
      })
      .catch((error) => {
        setErrorMessage("Invalid email or password.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-blue-300 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* Register Button */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}  // Navigate to the register page
              className="text-blue-600 hover:underline"
            >
              <div>Register here</div>
            </button>
          </p>    
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
