import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../api/productApi";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { FiShoppingCart, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams(); // ចាប់យក ID ពី URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getProductDetails(id);
        if (response.data.success) {
          setProduct(response.data.data);
        }
      } catch (err) {
        toast.error("មិនអាចទាញយកព័ត៌មានលម្អិតបានឡើយ!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(
      `បានបន្ថែម ${product.name} ចំនួន ${quantity} គ្រឿងទៅក្នុងកន្ត្រកទំនិញ!`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-customBg">
        <Navbar />
        <div className="text-center py-20 text-gray-400 animate-pulse text-sm">
          កំពុងទាញយកព័ត៌មានលម្អិត...
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-customBg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ប៊ូតុងត្រឡប់ក្រោយ */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-accent mb-6 transition cursor-pointer"
        >
          <FiArrowLeft /> ត្រឡប់ក្រោយ
        </button>

        {/* 📱💻 Responsive Grid: 1 ជួរលើ Mobile, 2 ជួរលើ Tablet ឡើងទៅ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          {/* ផ្នែកខាងឆ្វេង៖ បង្ហាញរូបភាព */}
          <div className="w-full aspect-square bg-customBg rounded-xl overflow-hidden flex items-center justify-center p-4">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://placehold.co/500x500?text=No+Image"
              }
              alt={product.name}
              className="object-contain max-h-[90%] w-auto"
            />
          </div>

          {/* ផ្នែកខាងស្តាំ៖ ព័ត៌មានលម្អិត */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="px-3 py-1 bg-purple-50 text-accent text-[11px] font-bold rounded-md uppercase tracking-wider border border-purple-100">
                {product.brand || "ស្មាតហ្វូន"}
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-primary mt-3 tracking-tight">
                {product.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-black text-accent mt-4">
                ${product.price}
              </div>

              <div className="w-full h-[1px] bg-gray-100 my-5"></div>

              <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                {product.description || "មិនមានការពិពណ៌នាសម្រាប់ផលិតផលនេះឡើយ។"}
              </p>

              {/* លក្ខណៈពិសេសៗគ្រាន់ឱ្យមើលទៅពេញលេញ */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <FiCheckCircle className="text-emerald-500 text-sm" />{" "}
                  ធានាជូនរយៈពេល ១ ឆ្នាំពេញពីក្រុមហ៊ុន
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <FiCheckCircle className="text-emerald-500 text-sm" />{" "}
                  ថែមជូនស្រោមទូរស័ព្ទ និងស្គ្រីនការពារថ្លា
                </div>
              </div>
            </div>

            {/* ប៊ូតុងបញ្ជាទិញ */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-gray-500">
                  ចំនួនដែលត្រូវទិញ៖
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-customBg overflow-hidden">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => q - 1)}
                    className="px-3 py-1.5 font-bold text-primary hover:bg-gray-200 disabled:opacity-30 cursor-pointer text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-primary">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 font-bold text-primary hover:bg-gray-200 disabled:opacity-30 cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right text-[11px] text-gray-400 font-medium">
                មានស្តុកសរុប៖{" "}
                <span className="font-bold text-primary">{product.stock}</span>{" "}
                គ្រឿង
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 hover:bg-opacity-90 shadow-lg shadow-purple-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-sm sm:text-base cursor-pointer"
              >
                <FiShoppingCart />{" "}
                {product.stock === 0
                  ? "ទំនិញនេះអស់ពីស្តុកហើយ"
                  : "បន្ថែមទៅកន្ត្រកទំនិញ"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
