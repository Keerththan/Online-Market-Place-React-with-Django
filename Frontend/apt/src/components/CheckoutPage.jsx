import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState(location.state || {});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      buyer_id: orderDetails.buyer_id,
      product_id: orderDetails.product_id,
      seller_id: orderDetails.seller_id,
      quantity: orderDetails.quantity,
      price: orderDetails.total_price,
      address: address,
      mobile_number: phoneNumber,
      payment_method: paymentMethod,
      product_name:orderDetails.product_name
    };
    console.log(orderData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/inventory/orders/create/', orderData);
      console.log(response.data);
      // Navigate to an order confirmation page after successful submission
      navigate("/order-confirmation", { state: orderData });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Checkout</h2>

        <div className="mb-4">
          <p><strong>Product:</strong> {orderDetails.product_name}</p>
          <p><strong>Price:</strong> ${orderDetails.total_price}</p>
          <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm text-gray-600">Delivery Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-sm text-gray-600">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Complete Purchase
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
