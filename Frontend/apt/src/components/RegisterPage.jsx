import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
         "username": username,  
        "email": email,
        "password": password,
        "user_type": userType, 
        "address": address,
        "contact_number": contactNumber, 
        "district": district, 
      })
      .then((response) => {
        // Show success message
        setSuccessMessage("Registration successful! Redirecting to login...");

        // Redirect user to login page after 2 seconds
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Register</h2>

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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
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
              className="w-full px-4 py-2 mt-2 border bg-white rounded-md text-black"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
