// cartContext.js – Updated by Sharan Adhikari 24071844

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  //  Add item to cart
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  //  Remove item from cart by index
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
