import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp, Sparkles, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { resolveImageUrl } from '../../utils/imageUrl';
import { smartProductSearch } from '../../utils/searchUtils';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load products catalog once when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (allProducts.length === 0) {
        setLoading(true);
        axiosInstance
          .get('/api/public/products?pageSize=100')
          .then((res) => {
            const data = res.data?.data || res.data || {};
            const list = Array.isArray(data) ? data : (data.content || []);
            setAllProducts(list);
          })
          .catch((err) => console.warn('Could not load products for live search', err))
          .finally(() => setLoading(false));
      }
    } else {
      setQuery('');
      setMatchingProducts([]);
    }
  }, [isOpen]);

  // Instant Smart Similar-Word Matching
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setMatchingProducts([]);
      return;
    }

    const results = smartProductSearch(allProducts, trimmed);
    setMatchingProducts(results.slice(0, 8));
  }, [query, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.slug}`);
    onClose();
  };

  const trendingSearches = [
    'Oversized Tees',
    'Acid Wash',
    'Fleece Hoodies',
    'Urban Jackets',
    'Customize T-Shirts',
    '240 GSM',
  ];

  const handleTrendingClick = (tag) => {
    navigate(`/shop?keyword=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center pt-20 sm:pt-24 px-4 sm:px-6 overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors rounded-full bg-zinc-900 border border-zinc-800"
            aria-label="Close search"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-2xl pb-16">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={22} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tees, hoodies, jackets, acid wash, customize..."
                className="w-full bg-[#121212] border-2 border-zinc-800 focus:border-white text-white text-base sm:text-lg pl-14 pr-14 py-4 rounded-none outline-none tracking-wide transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </form>

            {/* Live Instant Smart Search Results */}
            {query.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-[#121212] border border-zinc-800 divide-y divide-zinc-800/80 shadow-2xl max-h-[60vh] overflow-y-auto"
              >
                {matchingProducts.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                      <span>Matching Vault Garments ({matchingProducts.length})</span>
                      <span className="text-vibe-accent">Smart Similar-Word Search</span>
                    </div>

                    {matchingProducts.map((p) => {
                      const img = resolveImageUrl(
                        p.primaryImageUrl || p.imageUrl || p.images?.[0]?.imageUrl || p.images?.[0]?.url,
                        '/assets/logo.png'
                      );

                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="w-full px-4 py-3 text-left hover:bg-zinc-900/80 flex items-center justify-between gap-4 group transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={img}
                              alt={p.name}
                              className="w-12 h-14 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-white group-hover:text-vibe-accent transition-colors truncate">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                                <span className="uppercase font-semibold tracking-wider bg-zinc-800 px-1.5 py-0.2 rounded text-[10px]">
                                  {p.category}
                                </span>
                                {p.gsm && <span>• {p.gsm}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-black text-white">
                              ₹{Number(p.price).toLocaleString('en-IN')}
                            </span>
                            <ArrowRight size={14} className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      );
                    })}

                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 bg-zinc-950 hover:bg-white hover:text-black text-zinc-300 text-xs font-bold uppercase tracking-wider text-center transition-colors border-t border-zinc-800"
                    >
                      View All Results for "{query}" →
                    </button>
                  </>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-sm font-bold uppercase tracking-wider text-white">
                      No streetwear pieces matched your search
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try searching for alternative keywords like "tees", "hoodie", "jacket", or "acid wash".
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Trending & Quick Categories */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                <TrendingUp size={14} />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTrendingClick(tag)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors uppercase tracking-wider font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
