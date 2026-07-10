import React, { createContext, useState, useContext, useEffect } from "react";
import { apiAddToCart, apiGetCart, apiRemoveFromCart } from "../api/cartApi";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // 📥 អនុគមន៍ទាញយកទិន្នន័យពី Backend DB
  const fetchCartFromServer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      const response = await apiGetCart();
      if (response.data.success) {
        // ដោយសារ Backend ប្រើ .populate("items.product")
        // ដូច្នេះយើងត្រូវរៀបចំទម្រង់ array ឱ្យស្រួលប្រើលើ Frontend
        const formattedItems = response.data.data.items.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
          stock: item.product.stock,
          brand: item.product.brand,
          quantity: item.quantity,
        }));
        setCartItems(formattedItems);
      }
    } catch (err) {
      console.error("មិនអាចទាញទិន្នន័យកន្ត្រកបានឡើយ");
    }
  };

  // ទាញទិន្នន័យពេលដំបូងបង្អស់
  useEffect(() => {
    fetchCartFromServer();
  }, []);

  // ➕ មុខងារបន្ថែមទំនិញ (Add/Update) ទៅ Backend
  const addToCart = async (product, quantity) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("សូមចូលប្រើប្រាស់គណនីរបស់អ្នកសិន!");
      return false;
    }

    try {
      const response = await apiAddToCart(product._id, quantity);
      if (response.data.success) {
        await fetchCartFromServer(); // ទាញយកទិន្នន័យថ្មីចុងក្រោយពី Server
        return true;
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "មានបញ្ហាក្នុងការដាក់ចូលកន្ត្រក!",
      );
      return false;
    }
  };

  // 🔄 មុខងារកែប្រែចំនួន (ថែម/ថយ) ក្នុងទំព័រ Cart
  const updateQuantity = async (id, amount) => {
    // ដោយសារ Backend API /cart របស់លោកអ្នកប្រើប្រាស់វិធីបូកថែម (+= quantity)
    // ដូច្នេះយើងគ្រាន់តែបាញ់លេខ amount (1 ឬ -1) ទៅកាន់ API ចំៗជាការស្រេច
    try {
      const response = await apiAddToCart(id, amount);
      if (response.data.success) {
        await fetchCartFromServer();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "មិនអាចកែប្រែចំនួនបានទេ!");
    }
  };

  // ❌ មុខងារលុបទំនិញមួយចេញពីកន្ត្រក
  const removeFromCart = async (id) => {
    try {
      const response = await apiRemoveFromCart(id);
      if (response.data.success) {
        toast.success("បានលុបទំនិញចេញពីកន្ត្រករួចរាល់!");
        await fetchCartFromServer();
      }
    } catch (err) {
      toast.error("មិនអាចលុបទំនិញនេះបានឡើយ!");
    }
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        fetchCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
