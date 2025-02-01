import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/inventory/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  const handleBuyNow = () => {
    // Get buyer details from localStorage
    const buyer = JSON.parse(localStorage.getItem("user"));
    const buyer_id = buyer ? buyer.id : null;

    if (buyer_id) {
      const orderDetails = {
        buyer_id: buyer_id,
        product_id: product.id,
        seller_id:product.seller_id,
        quantity: quantity,
        total_price: product.product_price * quantity,
        product_name: product.product_name,  // Passing additional details
      };

      navigate("/checkout", { state: orderDetails }); // Pass order details to checkout
    } else {
      console.error("Buyer not logged in");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {product ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-8">
            <img
              src={`http://127.0.0.1:8000/inventory${product.product_image}`}
              alt={product.product_name}
              className="w-64 h-64 object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-800">{product.product_name}</h2>
              <p className="text-lg text-gray-600 mt-2">{product.product_category}</p>
              <p className="text-xl font-semibold text-gray-800 mt-4">${product.product_price}</p>

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
