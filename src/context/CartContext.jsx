import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('shopezCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Sync cart with local storage on state change
  useEffect(() => {
    localStorage.setItem('shopezCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);

      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id
            ? { ...x, qty: Math.min(product.countInStock, x.qty + qty) }
            : x
        );
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  // Update Item Quantity in Cart
  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x._id === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Pricing calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsPrice: Number(itemsPrice.toFixed(2)),
        shippingPrice: Number(shippingPrice.toFixed(2)),
        taxPrice: Number(taxPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
