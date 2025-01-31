import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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


/**
 * AddProductModal Component - Modernized Modal UI
 */
const AddProductModal = ({ isOpen, onClose, onProductAddedOrUpdated, sellerId, editProduct }) => {
  const [productData, setProductData] = useState({
    product_name: editProduct?.product_name || "",
    product_net_weight: editProduct?.product_net_weight || "",
    product_category: editProduct?.product_category || "",
    product_price: editProduct?.product_price || "",
    product_image: null,
  });

  useEffect(() => {
    if (editProduct) {
      setProductData({
        product_name: editProduct.product_name,
        product_net_weight: editProduct.product_net_weight,
        product_category: editProduct.product_category,
        product_price: editProduct.product_price,
        product_image: null,
      });
    }
  }, [editProduct]);

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
    formData.append("seller_id", sellerId);
    if (productData.product_image) {
      formData.append("product_image", productData.product_image);
    }

    try {
      if (editProduct) {
        await axios.patch(`http://127.0.0.1:8000/inventory/products/${editProduct.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/inventory/products/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onProductAddedOrUpdated();
      onClose();
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">{editProduct ? "Update Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="product_name" 
            value={productData.product_name} 
            placeholder="Product Name" 
            className="w-full mb-4 p-3 border border-gray-300 rounded-md" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="product_net_weight" 
            value={productData.product_net_weight} 
            placeholder="Net Weight (grams)" 
            className="w-full mb-4 p-3 border border-gray-300 rounded-md" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="product_category" 
            value={productData.product_category} 
            placeholder="Category" 
            className="w-full mb-4 p-3 border border-gray-300 rounded-md" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="product_price" 
            value={productData.product_price} 
            placeholder="Price ($)" 
            className="w-full mb-4 p-3 border border-gray-300 rounded-md" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="file" 
            name="product_image" 
            className="w-full mb-4 p-3 border border-gray-300 rounded-md" 
            onChange={handleImageChange} 
          />

          <div className="flex justify-between mt-4">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {editProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
