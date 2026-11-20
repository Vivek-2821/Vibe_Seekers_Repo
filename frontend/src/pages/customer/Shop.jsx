import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { ProductCard } from '../../components/shop/ProductCard';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filter state
  const selectedCategory = searchParams.get('category') || '';
  const selectedSize = searchParams.get('size') || '';
  const searchQuery = searchParams.get('keyword') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const categories = [
    { label: 'All Streetwear', value: '' },
    { label: 'Oversized T-Shirts', value: 'TSHIRTS' },
    { label: 'Fleece Hoodies', value: 'HOODIES' },
    { label: 'Urban Jackets', value: 'JACKETS' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory || undefined,
          size: selectedSize || undefined,
          keyword: searchQuery || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy,
          page: 0,
          pageSize: 40,
        };

        const res = await axiosInstance.get('/api/public/products', { params });
        setProducts(res.data.data.content || []);
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSize, searchQuery, sortBy, minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = !!(selectedCategory || selectedSize || searchQuery || minPrice || maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header & Title */}
      <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Official Store Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            {selectedCategory
              ? categories.find((c) => c.value === selectedCategory)?.label
              : 'Streetwear Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Prepaid orders only • Pan-India doorstep delivery • Free shipping on all orders
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold uppercase text-white"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
            <ArrowUpDown size={15} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-200 uppercase focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-zinc-900 text-white">Newest Drop</option>
              <option value="price_asc" className="bg-zinc-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900 text-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          
          {hasActiveFilters && (
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">Filters Applied</span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-vibe-accent hover:underline flex items-center gap-1"
              >
                <X size={14} /> Clear All
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="border border-zinc-800/80 rounded-xl p-5 bg-zinc-900/30 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Category</h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => updateFilter('category', cat.value)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg font-bold transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-vibe-accent text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="border border-zinc-800/80 rounded-xl p-5 bg-zinc-900/30 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Select Size</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateFilter('size', '')}
                className={`text-xs font-bold py-2 rounded-lg border transition-all ${
                  !selectedSize
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                All
              </button>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateFilter('size', sz)}
                  className={`text-xs font-bold py-2 rounded-lg border transition-all ${
                    selectedSize === sz
                      ? 'bg-vibe-accent text-white border-vibe-accent'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div className="border border-zinc-800/80 rounded-xl p-5 bg-zinc-900/30 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Price Range (₹)</h3>
            <div className="space-y-2">
              {[
                { label: 'Under ₹1,500', min: '', max: '1500' },
                { label: '₹1,500 – ₹2,500', min: '1500', max: '2500' },
                { label: 'Above ₹2,500', min: '2500', max: '' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (p.min) newParams.set('minPrice', p.min); else newParams.delete('minPrice');
                    if (p.max) newParams.set('maxPrice', p.max); else newParams.delete('maxPrice');
                    setSearchParams(newParams);
                  }}
                  className="w-full text-left text-xs py-1.5 text-zinc-400 hover:text-vibe-accent font-medium transition-colors"
                >
                  • {p.label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden">
            <div className="w-80 bg-zinc-950 border-l border-zinc-800 h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="font-black uppercase text-sm text-white">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-zinc-400">Category</h4>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      updateFilter('category', cat.value);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg font-bold ${
                      selectedCategory === cat.value
                        ? 'bg-vibe-accent text-white'
                        : 'text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Size */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-zinc-400">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        updateFilter('size', sz);
                        setMobileFilterOpen(false);
                      }}
                      className={`text-xs font-bold py-2 rounded-lg border ${
                        selectedSize === sz
                          ? 'bg-vibe-accent text-white border-vibe-accent'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-zinc-900 text-xs font-bold text-red-400 rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-zinc-900/40 rounded-xl aspect-[4/5] animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl p-8 space-y-4">
              <p className="text-zinc-400 font-bold text-sm">No streetwear pieces match your filter criteria.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-vibe-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
