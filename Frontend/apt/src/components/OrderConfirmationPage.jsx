import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state || {};

  useEffect(() => {
    if (orderDetails.order_id) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl text-center">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
          <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
        </div>

        {/* Order Summary */}
        <div className="mt-6 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>
          <div className="mt-4 text-left">
            

            <p><strong>Product:</strong> {orderDetails.product_name}</p>
            <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
            <p><strong>Total Price:</strong> ${orderDetails.price}</p>
            <p><strong>Delivery Address:</strong> {orderDetails.address}</p>
            <p><strong>Phone:</strong> {orderDetails.mobile_number}</p>
            <p><strong>Payment Method:</strong> {orderDetails.payment_method}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
