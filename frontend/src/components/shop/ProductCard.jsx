import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { resolveImageUrl } from '../../utils/imageUrl';

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(() => {
    // Pick first available size with stock > 0 if available, else 'L'
    if (product.sizeStocks && product.sizeStocks.length > 0) {
      const available = product.sizeStocks.find((s) => (s.stock ?? s.stockQuantity ?? 0) > 0);
      return available ? available.size : product.sizeStocks[0].size;
    }
    return 'L';
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.colors) {
      const list = product.colors.split(',').map((c) => c.trim()).filter(Boolean);
      return list[0] || 'Classic Black';
    }
    return 'Classic Black';
  });

  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const rawPrimary = product.primaryImageUrl || product.imageUrl || product.images?.[0]?.imageUrl || product.images?.[0]?.url;
  const rawSecondary = product.images?.[1]?.imageUrl || product.images?.[1]?.url || rawPrimary;
  const fallbackImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const primaryImage = resolveImageUrl(rawPrimary, fallbackImg);
  const secondaryImage = resolveImageUrl(rawSecondary, primaryImage);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize, selectedColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFavorited = isInWishlist(product.id);

  const discountPercent = product.discountPercent > 0
    ? product.discountPercent
    : (product.mrp && Number(product.mrp) > Number(product.price)
        ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
        : null);

  // Parse color options if provided
  const colorOptions = product.colors
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#121212] border border-zinc-800/80 hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Frame */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-950 block">
        {/* Primary and secondary hover image flip */}
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Badges: New Arrival / Best Seller / Discount */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {(product.bestSeller ?? product.isBestSeller) && (
            <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              BEST SELLER
            </span>
          )}
          {(product.newArrival ?? product.isNewArrival) && (
            <span className="bg-black/90 text-white border border-zinc-700 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              NEW DROP
            </span>
          )}
          {discountPercent && (
            <span className="bg-emerald-500 text-black text-[9px] font-extrabold uppercase px-2 py-0.5">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-300'}`}
          />
        </button>

        {/* Fabric / GSM Tag */}
        {(product.gsm || product.fabricDetails) && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-black/85 backdrop-blur-md text-zinc-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-zinc-800">
              {product.gsm || '240 GSM'}
            </span>
          </div>
        )}
      </Link>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
            {product.category || 'STREETWEAR'}
          </span>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-zinc-100 hover:text-white transition-colors uppercase tracking-wider line-clamp-1 mt-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm sm:text-base font-extrabold text-white tracking-wide">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-zinc-500 line-through font-normal">
                ₹{Number(product.mrp || 0).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color Selection Dots if available */}
          {colorOptions.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Color:</span>
              <div className="flex gap-1 overflow-x-auto">
                {colorOptions.slice(0, 3).map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`text-[9px] px-1.5 py-0.5 border uppercase font-medium transition-colors ${
                      selectedColor === col
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size Selection & Quick Add Button */}
        <div className="mt-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between gap-1 mb-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`flex-1 py-1 text-[10px] font-bold tracking-wider uppercase border transition-all ${
                  selectedSize === sz
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-500 text-black'
                : 'bg-zinc-800 hover:bg-white text-white hover:text-black border border-zinc-700 hover:border-white'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>QUICK ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
