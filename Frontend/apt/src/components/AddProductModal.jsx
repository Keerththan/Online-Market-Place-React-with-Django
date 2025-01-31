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
          // Update existing product
          await axios.patch(`http://127.0.0.1:8000/inventory/products/${editProduct.id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          // Add new product
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
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-4">{editProduct ? "Edit Product" : "Add Product"}</h2>
  
          <form onSubmit={handleSubmit}>
            <input type="text" name="product_name" value={productData.product_name} placeholder="Product Name" className="w-full mb-2 p-2 border" onChange={handleChange} required />
            <input type="number" name="product_net_weight" value={productData.product_net_weight} placeholder="Net Weight (grams)" className="w-full mb-2 p-2 border" onChange={handleChange} required />
            <input type="text" name="product_category" value={productData.product_category} placeholder="Category" className="w-full mb-2 p-2 border" onChange={handleChange} required />
            <input type="number" name="product_price" value={productData.product_price} placeholder="Price ($)" className="w-full mb-2 p-2 border" onChange={handleChange} required />
            <input type="file" name="product_image" className="w-full mb-2 p-2 border" onChange={handleImageChange} />
  
            <div className="flex justify-between mt-4">
              <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-md" onClick={onClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{editProduct ? "Update Product" : "Add Product"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  