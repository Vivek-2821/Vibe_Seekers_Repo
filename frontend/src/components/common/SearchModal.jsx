import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  // Debounced search suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/public/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error('Error fetching search suggestions', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    navigate(`/shop?keyword=${encodeURIComponent(suggestion)}`);
    onClose();
  };

  const trendingSearches = [
    'Heavyweight Tee',
    'Acid Wash',
    'Oversized Hoodie',
    'Black Boxy',
    '240 GSM',
    'Cargo Jacket',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center pt-24 px-4 sm:px-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors rounded-full bg-zinc-900 border border-zinc-800"
            aria-label="Close search"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-2xl">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={22} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search oversized tees, hoodies, acid wash..."
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

            {/* Live Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-[#121212] border border-zinc-800 divide-y divide-zinc-800/80"
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-5 py-3.5 text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-900/80 flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Search size={15} className="text-zinc-500 group-hover:text-white" />
                      <span>{item}</span>
                    </span>
                    <ArrowRight size={14} className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
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
                    onClick={() => {
                      navigate(`/shop?keyword=${encodeURIComponent(tag)}`);
                      onClose();
                    }}
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
