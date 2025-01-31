import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellerDetails, setSellerDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal state

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

  const handleProductAdded = () => {
    if (sellerDetails.id) {
      axios
        .get(`http://127.0.0.1:8000/inventory/products/seller/${sellerDetails.id}/`)
        .then((response) => setProducts(response.data))
        .catch((error) => console.error("Error refreshing products", error));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteProduct = (productId) => {
    axios
      .delete(`http://127.0.0.1:8000/inventory/products/${productId}/`)
      .then(() => {
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
          <li><a href="#dashboard" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a></li>
          <li><a href="#products" className="block py-2 px-4 hover:bg-gray-700">Products</a></li>
          <li><a href="#orders" className="block py-2 px-4 hover:bg-gray-700">Orders</a></li>
          <li><button onClick={handleLogout} className="block py-2 px-4 hover:bg-gray-700 w-full">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-black">📋 Products</h2>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            ➕ Add Product
          </button>

          <div className="space-y-4 mt-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
                  <div>{product.product_name}</div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:underline">🗑️ Delete</button>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProductAdded={handleProductAdded} 
          sellerId={sellerDetails.id}
        />
      )}
    </div>
  );
};

export default SellerDashboard;

/**
 * AddProductModal Component - Modal to Add a New Product
 */
const AddProductModal = ({ isOpen, onClose, onProductAdded, sellerId }) => {
  const [productData, setProductData] = useState({
    product_name: "",
    product_net_weight: "",
    product_category: "",
    product_price: "",
    product_image: null,
  });

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", productData.product_name);
    formData.append("product_net_weight", productData.product_net_weight);
    formData.append("product_category", productData.product_category);
    formData.append("product_price", productData.product_price);
    formData.append("seller_id", sellerId); // Add seller ID
    if (productData.product_image) {
      formData.append("product_image", productData.product_image);
    }

    try {
      await axios.post("http://127.0.0.1:8000/inventory/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onProductAdded(); // Refresh products list after adding
      onClose(); // Close modal
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Product</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="product_name" placeholder="Product Name" className="w-full mb-2 p-2 border" onChange={handleChange} required />
          <input type="number" name="product_net_weight" placeholder="Net Weight (grams)" className="w-full mb-2 p-2 border" onChange={handleChange} required />
          <input type="text" name="product_category" placeholder="Category" className="w-full mb-2 p-2 border" onChange={handleChange} required />
          <input type="number" name="product_price" placeholder="Price ($)" className="w-full mb-2 p-2 border" onChange={handleChange} required />
          <input type="file" name="product_image" className="w-full mb-2 p-2 border" onChange={handleImageChange} />

          <div className="flex justify-between mt-4">
            <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};
