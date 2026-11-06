import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('zenith_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('zenith_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('zenith_coupon');
    }
  }, [coupon]);

  const addToCart = (product, quantity = 1) => {
    const qty = parseInt(quantity, 10);
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.countInStock || 99);
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            category: product.category,
            quantity: Math.min(qty, product.countInStock || 99),
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(qty, item.countInStock || 99) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'SAVE10') {
      const c = { code: 'SAVE10', type: 'percentage', value: 10, label: '10% Off' };
      setCoupon(c);
      return { success: true, message: 'Coupon SAVE10 applied (10% off)' };
    } else if (cleanCode === 'WELCOME20') {
      const c = { code: 'WELCOME20', type: 'fixed', value: 20, label: '$20 Off' };
      setCoupon(c);
      return { success: true, message: 'Coupon WELCOME20 applied ($20 off)' };
    } else {
      return { success: false, message: 'Invalid promo code. Try SAVE10 or WELCOME20' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Free shipping threshold at $150
  const freeShippingThreshold = 150;
  const shippingPrice = itemsPrice >= freeShippingThreshold || itemsPrice === 0 ? 0 : 15.00;
  
  // 8% tax calculation
  const taxPrice = itemsPrice > 0 ? parseFloat((itemsPrice * 0.08).toFixed(2)) : 0;
  
  // Discount
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = parseFloat((itemsPrice * (coupon.value / 100)).toFixed(2));
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, itemsPrice);
    }
  }

  const totalPrice = parseFloat(
    Math.max(0, itemsPrice + shippingPrice + taxPrice - discount).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount,
        totalPrice,
        coupon,
        freeShippingThreshold,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

