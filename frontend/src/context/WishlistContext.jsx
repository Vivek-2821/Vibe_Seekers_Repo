import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vibe_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync with backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendWishlist();
    }
  }, [isAuthenticated]);

  // Persist guest wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vibe_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  const fetchBackendWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/customer/wishlist');
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setWishlist(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist from server', err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.productId) === productId);
  };

  const toggleWishlist = async (product) => {
    const pId = product.id;
    const exists = isInWishlist(pId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item.id || item.productId) !== pId));
      if (isAuthenticated) {
        try {
          await axiosInstance.delete(`/api/customer/wishlist/${pId}`);
        } catch (err) {
          console.error('Error removing from server wishlist', err);
        }
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      if (isAuthenticated) {
        try {
          await axiosInstance.post(`/api/customer/wishlist/${pId}`);
        } catch (err) {
          console.error('Error adding to server wishlist', err);
        }
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => (item.id || item.productId) !== productId));
    if (isAuthenticated) {
      try {
        await axiosInstance.delete(`/api/customer/wishlist/${productId}`);
      } catch (err) {
        console.error('Error removing from server wishlist', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
