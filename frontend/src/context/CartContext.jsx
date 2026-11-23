import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { resolveImageUrl } from '../utils/imageUrl';

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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('vibe_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState({
    shippingEnabled: false,
    shippingAmount: 79.0,
  });

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await axiosInstance.get('/api/settings/shipping');
        const data = res.data?.data || res.data;
        if (data && typeof data.shippingEnabled !== 'undefined') {
          setShippingConfig({
            shippingEnabled: !!data.shippingEnabled,
            shippingAmount: Number(data.shippingAmount) || 79.0,
          });
        }
      } catch (err) {
        // Fallback default: free shipping
        console.warn('Could not load shipping settings from backend, default to free shipping', err);
      }
    };
    fetchShippingSettings();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vibe_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('vibe_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('vibe_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (product, size = 'L', color = '', quantity = 1, customization = null) => {
    const chosenColor = color || (product.colors ? product.colors.split(',')[0].trim() : 'Classic Black');
    const chosenSize = (size || 'L').toUpperCase();

    const customPlacement = customization?.placement || customization?.customizationPlacement || null;
    const customText = customization?.customText || customization?.text || null;
    const customDesignUrl = customization?.customDesignUrl || customization?.designUrl || null;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === chosenSize &&
          item.color === chosenColor &&
          (item.customText || '') === (customText || '') &&
          (item.customizationPlacement || '') === (customPlacement || '')
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
          size: chosenSize,
          color: chosenColor,
          quantity,
          customizationPlacement: customPlacement,
          customText: customText,
          customDesignUrl: customDesignUrl,
          imageUrl: resolveImageUrl(product.primaryImageUrl || product.imageUrl || (product.images?.[0]?.imageUrl ?? product.images?.[0]?.url ?? '')),
        },
      ];
    });

    openCart();
  };

  const updateQuantity = (productId, size, color, newQty) => {
    if (newQty <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size && (item.color || '') === (color || '')
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeItem = (productId, size, color) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.productId === productId && item.size === size && (item.color || '') === (color || ''))
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingEstimate = shippingConfig.shippingEnabled
    ? (Number(shippingConfig.shippingAmount) || 79.0)
    : 0;

  // Calculate discount amount based on applied coupon and subtotal
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      // Order amount dropped below threshold
      discountAmount = 0;
    } else {
      let disc = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscountAmount && disc > appliedCoupon.maxDiscountAmount) {
        disc = appliedCoupon.maxDiscountAmount;
      }
      discountAmount = disc;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingEstimate);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await axiosInstance.post('/api/public/coupons/validate', {
        code: code.trim(),
        orderAmount: subtotal,
      });
      const couponResult = res.data?.data || res.data;
      if (couponResult && couponResult.valid) {
        setAppliedCoupon(couponResult);
        setCouponError('');
        setCouponLoading(false);
        return true;
      } else {
        setCouponError(couponResult?.message || res.data?.message || 'Invalid coupon code');
        setCouponLoading(false);
        return false;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon code';
      setCouponError(msg);
      setCouponLoading(false);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

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
        discountAmount,
        finalTotal,
        shippingEstimate,
        shippingConfig,
        isShippingFree: !shippingConfig.shippingEnabled,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        appliedCoupon,
        couponError,
        couponLoading,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
