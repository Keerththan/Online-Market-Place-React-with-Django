import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetailPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch the product details by ID
    axios
      .get(`http://127.0.0.1:8000/inventory/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  const handleAddToCart = () => {
    // Handle adding the product to the cart
    console.log("Added to Cart", product, quantity);
    // Optionally, you could save this to localStorage or send it to an API
  };

  const handleBuyNow = () => {
    // Handle the buy action, possibly navigating to a checkout page
    console.log("Buying product:", product, quantity);
    navigate("/checkout"); // Navigate to the checkout page (you can change this URL)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {product ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-8">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-64 h-64 object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-800">{product.product_name}</h2>
              <p className="text-lg text-gray-600 mt-2">{product.product_category}</p>
              <p className="text-xl font-semibold text-gray-800 mt-4">${product.product_price}</p>

              {/* Quantity Selector */}
              <div className="mt-4">
                <label htmlFor="quantity" className="text-sm text-gray-600">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 mt-1 p-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>

              <div className="mt-6 space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
