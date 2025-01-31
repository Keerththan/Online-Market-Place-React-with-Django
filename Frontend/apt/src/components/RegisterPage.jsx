import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("buyer"); // Default to 'buyer'
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(""); // State for password mismatch error
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setSuccessMessage(""); // Clear success message if there's an error
      return;
    }

    // Reset password error if passwords match
    setPasswordError("");

    // Send registration data to backend
    axios
      .post("http://127.0.0.1:8000/inventory/register/", {
        username,
        email,
        password,
        user_type: userType,
        address,
        contact_number: contactNumber,
        district,
      })
      .then((response) => {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage("Registration failed. Please try again.");
        setSuccessMessage(""); // Clear success message if registration fails
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        {/* Password Mismatch Error */}
        {passwordError && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <select
              id="user_type"
              name="user_type"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="address"
              name="address"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="district"
              name="district"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
