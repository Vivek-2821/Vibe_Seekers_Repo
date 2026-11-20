import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vibe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vibe_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product, size = 'L', quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          mrp: product.mrp ? Number(product.mrp) : null,
          category: product.category,
          size: size.toUpperCase(),
          quantity,
          imageUrl: product.primaryImageUrl || (product.images?.[0]?.imageUrl ?? ''),
        },
      ];
    });
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeItem = (productId, size) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingEstimate = 0; // Free shipping across India on prepaid streetwear orders!

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        shippingEstimate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
