import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('L');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const primaryImage = product.primaryImageUrl || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const secondaryImage = product.images?.[1]?.imageUrl || primaryImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent = product.discountPercent > 0
    ? product.discountPercent
    : (product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : null);

  return (
    <div className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Product Image Frame */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-zinc-950 block">
        {/* Main Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.newArrival && (
            <span className="bg-vibe-accent text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
              Fresh Drop
            </span>
          )}
          {discountPercent && (
            <span className="bg-zinc-900/90 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-zinc-800">
            {product.category}
          </span>
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <span className="p-3 bg-zinc-900/90 text-white rounded-full hover:scale-110 transition-transform shadow-xl">
            <Eye size={20} />
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-vibe-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
            {product.fabricDetails || 'Heavyweight Cotton • Streetwear Fit'}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-lg font-black text-white">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-zinc-500 line-through">
                ₹{Number(product.mrp).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection & Quick Add */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Size:</span>
            <div className="flex gap-1">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                    selectedSize === sz
                      ? 'bg-vibe-accent text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 hover:bg-vibe-accent hover:text-white text-zinc-200'
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Added ({selectedSize})
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> Add to Cart
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
