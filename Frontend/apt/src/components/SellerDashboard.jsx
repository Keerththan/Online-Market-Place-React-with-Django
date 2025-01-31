import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sellerDetails, setSellerDetails] = useState({});

  // Fetch products and orders
  useEffect(() => {
    // Get the seller details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setSellerDetails(JSON.parse(storedUser)); // Parse the stored user object
    } else {
      console.error("No user details found in localStorage");
    }

    // Fetch products
    axios
      .get("http://127.0.0.1:8000/inventory/products/") // Replace with actual API
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });

    // Fetch orders
    axios
      .get("http://127.0.0.1:8000/inventory/orders/") // Replace with actual API
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user"); // Optional: remove user data from localStorage on logout
    navigate("/login");
  };

  const handleAcceptOrder = (orderId) => {
    axios
      .patch(`http://localhost:8000/api/orders/${orderId}/accept/`) // Replace with actual API
      .then((response) => {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "Accepted" } : order)));
      })
      .catch((error) => {
        console.error("Error accepting order", error);
      });
  };

  const handleRejectOrder = (orderId) => {
    axios
      .patch(`http://localhost:8000/api/orders/${orderId}/reject/`) // Replace with actual API
      .then((response) => {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "Rejected" } : order)));
      })
      .catch((error) => {
        console.error("Error rejecting order", error);
      });
  };

  const handleDeleteProduct = (productId) => {
    axios
      .delete(`http://localhost:8000/api/products/${productId}/`) // Replace with actual API
      .then((response) => {
        setProducts(products.filter((product) => product.id !== productId));
      })
      .catch((error) => {
        console.error("Error deleting product", error);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <div className="text-2xl font-bold">📌 Sidebar</div>
        <ul className="mt-6 space-y-4">
          <li>
            <a href="#dashboard" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a>
          </li>
          <li>
            <a href="#products" className="block py-2 px-4 hover:bg-gray-700">Products</a>
          </li>
          <li>
            <a href="#orders" className="block py-2 px-4 hover:bg-gray-700">Orders</a>
          </li>
          <li>
            <button onClick={handleLogout} className="block py-2 px-4 hover:bg-gray-700 w-full ">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {/* Seller Details */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-black">Seller Details</h2>
          <div className="mt-4">
            <p>Name: {sellerDetails.id}</p>
            <p>Email: {sellerDetails.email}</p>
            <p>Username: {sellerDetails.username}</p>
            <p>Address: {sellerDetails.address}</p>
            <p>Contact: {sellerDetails.contact_number}</p>
          </div>
        </div>

        {/* Products List */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-black">📋 Products</h2>
          <div className="space-y-4 mt-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
                  <div>{product.name}</div>
                  <div className="space-x-4">
                    <button className="text-yellow-500 hover:underline">✏️ Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:underline">🗑️ Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
            <button className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-3xl font-semibold text-black">📦 Orders from Buyers</h2>
          <div className="space-y-4 mt-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
                  <div>🏷️ Order {order.id}</div>
                  <div className="space-x-4">
                    <button onClick={() => handleAcceptOrder(order.id)} className="text-green-500 hover:underline">✅ Accept</button>
                    <button onClick={() => handleRejectOrder(order.id)} className="text-red-500 hover:underline">❌ Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No orders available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
