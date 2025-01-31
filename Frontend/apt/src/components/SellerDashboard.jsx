import { useNavigate } from "react-router-dom"; // Importing useNavigate
import { useState, useEffect } from "react"; 
import axios from "axios";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellerDetails, setSellerDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setSellerDetails(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (sellerDetails.id) {
      axios
        .get(`http://127.0.0.1:8000/inventory/products/seller/${sellerDetails.id}/`)
        .then((response) => setProducts(response.data))
        .catch((error) => console.error("Error fetching products", error));
    }
  }, [sellerDetails.id]);

  const handleProductAddedOrUpdated = () => {
    if (sellerDetails.id) {
      axios
        .get(`http://127.0.0.1:8000/inventory/products/seller/${sellerDetails.id}/`)
        .then((response) => setProducts(response.data))
        .catch((error) => console.error("Error refreshing products", error));
    }
  };

  const handleDeleteProduct = (productId) => {
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      axios
        .delete(`http://127.0.0.1:8000/inventory/products/${productId}/`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== productId));
        })
        .catch((error) => {
          console.error("Error deleting product", error);
        });
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-3xl font-bold text-center text-blue-500">Seller Panel</h2>
        <ul className="mt-6 space-y-4">
          <li>
            <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition">
              📦 Products
            </button>
          </li>
          <li>
            <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition">
              📑 Orders
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/login")} className="w-full px-4 py-2 bg-red-500 hover:bg-red-400 rounded-md transition">
              🚪 Logout
            </button>
          </li>
        </ul>

        {/* Display seller details */}
        {sellerDetails && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg text-sm text-gray-200">
            <h4 className="font-bold text-lg">Seller Details:</h4>
            <p><strong>Name:</strong> {sellerDetails.username}</p>
            <p><strong>Email:</strong> {sellerDetails.email}</p>
            <p><strong>Contact:</strong> {sellerDetails.contact_number}</p>
            <p><strong>Address:</strong> {sellerDetails.address}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">📋 Products</h2>
          <button 
            onClick={() => { setEditProduct(null); setIsModalOpen(true); }} 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            ➕ Add Product
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition duration-300">
                <h3 className="text-lg font-semibold text-gray-900">{product.product_name}</h3>
                <p className="text-gray-600 text-sm">${product.product_price}</p>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleEditProduct(product)} 
                    className="text-yellow-500 hover:text-yellow-600 transition">
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)} 
                    className="text-red-500 hover:text-red-600 transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No products available</p>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProductAddedOrUpdated={handleProductAddedOrUpdated} 
          sellerId={sellerDetails.id}
          editProduct={editProduct}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
