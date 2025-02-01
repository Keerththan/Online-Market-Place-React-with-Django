import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import ProductDetailPage from "./components/ProductDetailPage";
import CheckoutPage from "./components/CheckoutPage.jsx";
import OrderConfirmationPage from "./components/OrderConfirmationPage.jsx";


import "./App.css";
import SellerDashboard from "./components/SellerDashboard";
import Header from "./components/Header.jsx";

function App() {
  return (
    <>
      
      <Router>
      <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/sellerDash" element={<SellerDashboard />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />{" "}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          {/* Product Detail Route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
