import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 💡 ទាញយកទិន្នន័យកន្ត្រកទំនិញចាស់ពី LocalStorage បើមាន
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("seyha_cart");
    return localData ? JSON.parse(localData) : [];
  });

  // រក្សាទុកក្នុង LocalStorage រាល់ពេលកន្ត្រកប្រែប្រួល
  useEffect(() => {
    localStorage.setItem("seyha_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ មុខងារបន្ថែមទំនិញចូលកន្ត្រក
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => item._id === product._id);
      if (exist) {
        // បើមានទូរស័ព្ទនេះក្នុងកន្ត្រករួចហើយ ត្រូវបូកថែមចំនួន (តែមិនឱ្យលើសស្តុក)
        return prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );
      }
      // បើមិនទាន់មានទេ បញ្ចូលគ្រឿងថ្មី
      return [...prevItems, { ...product, quantity }];
    });
  };

  //  មុខងារកែប្រែចំនួន (ថែម/ថយ) ក្នុងទំព័រ Cart ចំៗ
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + amount, item.stock),
              ),
            }
          : item,
      ),
    );
  };

  //  មុខងារលុបទំនិញមួយចេញពីកន្ត្រក
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  //  មុខងារលុបសម្អាតកន្ត្រកទាំងមូល (ពេល Checkout រួច)
  const clearCart = () => setCartItems([]);

  //  គណនាចំនួនមុខទំនិញសរុបសម្រាប់បង្ហាញលើ badge ម៉ឺនុយ
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
