import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { resolveImageUrl } from '../utils/imageUrl';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vibe_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && (item.productId != null || item.id != null) && !isNaN(Number(item.price)))
        .map((item) => ({
          ...item,
          productId: item.productId ?? item.id,
          price: Number(item.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
          size: String(item.size || 'M').toUpperCase(),
          color: item.color ? String(item.color) : 'Classic Black',
        }));
    } catch (e) {
      console.warn('Failed to parse cart from localStorage, resetting:', e);
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

  const addToCart = (product, optionsOrSize = {}, maybeColor = '', maybeQuantity = 1, maybeCustomization = null) => {
    if (!product || typeof product !== 'object') {
      console.warn('addToCart called without valid product object:', product);
      return;
    }

    let size;
    let color;
    let quantity;
    let customization;

    if (optionsOrSize && typeof optionsOrSize === 'object' && !Array.isArray(optionsOrSize)) {
      size = optionsOrSize.size;
      color = optionsOrSize.color;
      quantity = optionsOrSize.quantity;
      customization = optionsOrSize.customization;
    } else {
      size = optionsOrSize;
      color = maybeColor;
      quantity = maybeQuantity;
      customization = maybeCustomization;
    }

    // Default size: first size with stock > 0, or first size in sizeStocks, or 'M'
    let defaultSize = 'M';
    if (Array.isArray(product.sizeStocks) && product.sizeStocks.length > 0) {
      const available = product.sizeStocks.find((s) => (s.stock ?? s.stockQuantity ?? 0) > 0);
      defaultSize = available ? available.size : product.sizeStocks[0].size;
    }
    const chosenSize = String(size || defaultSize).toUpperCase();

    // Default color: first color in product.colors, or 'Classic Black'
    let defaultColor = 'Classic Black';
    if (product.colors) {
      const colorParts = String(product.colors).split(',').map((c) => c.trim()).filter(Boolean);
      if (colorParts.length > 0) defaultColor = colorParts[0];
    }
    const chosenColor = color ? String(color).trim() : defaultColor;

    const chosenQuantity = Math.max(1, Number(quantity) || 1);

    const customPlacement = customization?.placement || customization?.customizationPlacement || null;
    const customText = customization?.customText || customization?.text || null;
    const customDesignUrl = customization?.customDesignUrl || customization?.designUrl || null;

    // Resolve product image safely
    let rawImg = product.primaryImageUrl || product.imageUrl;
    if (!rawImg && Array.isArray(product.images) && product.images.length > 0) {
      rawImg = product.images[0]?.imageUrl || product.images[0]?.url || (typeof product.images[0] === 'string' ? product.images[0] : null);
    }
    const resolvedImg = resolveImageUrl(rawImg, '/assets/logo.png');

    setItems((prevItems) => {
      const prodId = product.id ?? product.productId;
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.productId === prodId &&
          item.size === chosenSize &&
          item.color === chosenColor &&
          (item.customText || '') === (customText || '') &&
          (item.customizationPlacement || '') === (customPlacement || '')
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity = (Number(updated[existingIndex].quantity) || 0) + chosenQuantity;
        return updated;
      }

      return [
        ...prevItems,
        {
          productId: prodId,
          name: product.name || 'Vibe Streetwear',
          slug: product.slug || String(prodId),
          price: Math.max(0, Number(product.price) || 0),
          mrp: product.mrp ? Number(product.mrp) : null,
          category: product.category || 'Streetwear',
          size: chosenSize,
          color: chosenColor,
          quantity: chosenQuantity,
          customizationPlacement: customPlacement,
          customText: customText,
          customDesignUrl: customDesignUrl,
          imageUrl: resolvedImg,
        },
      ];
    });

    openCart();
  };

  const addItem = addToCart;

  const updateQuantity = (productId, size, color, newQty) => {
    if (newQty <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size && (item.color || '') === (color || '')
          ? { ...item, quantity: Math.max(1, Number(newQty) || 1) }
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

  const subtotal = items.reduce((acc, item) => acc + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0);
  const itemCount = items.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);
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
      let disc = Math.round((subtotal * (Number(appliedCoupon.discountPercent) || 0)) / 100);
      if (appliedCoupon.maxDiscountAmount && disc > appliedCoupon.maxDiscountAmount) {
        disc = Number(appliedCoupon.maxDiscountAmount);
      }
      discountAmount = disc;
    }
  }

  const finalTotal = Math.max(0, (Number(subtotal) || 0) - (Number(discountAmount) || 0) + (Number(shippingEstimate) || 0));

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
        addToCart,
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
