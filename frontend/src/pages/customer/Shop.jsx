import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Check, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { ProductCard } from '../../components/shop/ProductCard';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  // Active filter state from URL search params
  const selectedCategory = searchParams.get('category') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const searchQuery = searchParams.get('keyword') || '';
  const filterType = searchParams.get('filter') || ''; // 'new', 'bestseller'
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
  const popularColors = ['Black', 'White', 'Acid', 'Grey', 'Olive', 'Charcoal'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory || undefined,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          keyword: searchQuery || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          newArrivalOnly: filterType === 'new' ? true : undefined,
          bestSellerOnly: filterType === 'bestseller' ? true : undefined,
          sortBy,
          page: 0,
          pageSize: 60,
        };

        const res = await axiosInstance.get('/api/public/products', { params });
        const data = res.data?.data || res.data || {};
        setProducts(data.content || []);
        setTotalElements(data.totalElements || (data.content ? data.content.length : 0));
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSize, selectedColor, searchQuery, filterType, sortBy, minPrice, maxPrice]);

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

  const hasActiveFilters = !!(
    selectedCategory ||
    selectedSize ||
    selectedColor ||
    searchQuery ||
    filterType ||
    minPrice ||
    maxPrice
  );

  return (
    <div className="bg-[#080808] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header & Page Title */}
        <div className="border-b border-zinc-800 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
              <span>VAULT CATALOG</span>
              {filterType === 'new' && <span className="text-white font-extrabold">• NEW DROPS</span>}
              {filterType === 'bestseller' && <span className="text-white font-extrabold">• BEST SELLERS</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mt-1">
              {selectedCategory
                ? categories.find((c) => c.value === selectedCategory)?.label
                : filterType === 'new'
                ? 'NEW ARRIVALS'
                : filterType === 'bestseller'
                ? 'BEST SELLERS'
                : 'STREETWEAR COLLECTION'}
            </h1>
            <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">
              Showing {products.length} {products.length === 1 ? 'garment' : 'garments'} • Free express courier delivery pan-India
            </p>
          </div>

          {/* Sort & Filter Toggle Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-zinc-800 text-xs font-bold uppercase tracking-wider text-white"
            >
              <SlidersHorizontal size={15} />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center bg-[#141414] border border-zinc-800 px-3 py-2">
              <ArrowUpDown size={14} className="text-zinc-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-wider text-white outline-none cursor-pointer pr-4"
              >
                <option value="newest" className="bg-zinc-900">Newest Drops</option>
                <option value="price_asc" className="bg-zinc-900">Price: Low to High</option>
                <option value="price_desc" className="bg-zinc-900">Price: High to Low</option>
                <option value="popularity" className="bg-zinc-900">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-[#111] border border-zinc-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
              Active Filters:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider">
                Category: {selectedCategory}
                <button onClick={() => updateFilter('category', '')}><X size={12} /></button>
              </span>
            )}
            {filterType && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider">
                {filterType === 'new' ? 'New Drops' : 'Best Sellers'}
                <button onClick={() => updateFilter('filter', '')}><X size={12} /></button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider">
                Size: {selectedSize}
                <button onClick={() => updateFilter('size', '')}><X size={12} /></button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider">
                Color: {selectedColor}
                <button onClick={() => updateFilter('color', '')}><X size={12} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider">
                Search: "{searchQuery}"
                <button onClick={() => updateFilter('keyword', '')}><X size={12} /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-zinc-400 hover:text-white underline uppercase tracking-wider ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-zinc-800/80">
            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                Garment Category
              </h4>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('category', cat.value)}
                    className={`w-full text-left text-xs font-medium uppercase tracking-wider py-1.5 px-2 flex items-center justify-between transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Badges Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                Drop Type
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilter('filter', filterType === 'new' ? '' : 'new')}
                  className={`w-full text-left text-xs font-medium uppercase tracking-wider py-1.5 px-2 flex items-center justify-between transition-colors ${
                    filterType === 'new' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span>New Drops Only</span>
                  {filterType === 'new' && <Check size={14} />}
                </button>
                <button
                  onClick={() => updateFilter('filter', filterType === 'bestseller' ? '' : 'bestseller')}
                  className={`w-full text-left text-xs font-medium uppercase tracking-wider py-1.5 px-2 flex items-center justify-between transition-colors ${
                    filterType === 'bestseller' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span>Best Sellers Only</span>
                  {filterType === 'bestseller' && <Check size={14} />}
                </button>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                Size
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', selectedSize === sz ? '' : sz)}
                    className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      selectedSize === sz
                        ? 'bg-white text-black border-white'
                        : 'bg-[#141414] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                Color Tone
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularColors.map((col) => (
                  <button
                    key={col}
                    onClick={() => updateFilter('color', selectedColor === col ? '' : col)}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-colors ${
                      selectedColor === col
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-[#141414] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                Price (INR)
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    updateFilter('minPrice', '');
                    updateFilter('maxPrice', '1499');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  Under ₹1,499
                </button>
                <button
                  onClick={() => {
                    updateFilter('minPrice', '1500');
                    updateFilter('maxPrice', '2499');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  ₹1,500 - ₹2,499
                </button>
                <button
                  onClick={() => {
                    updateFilter('minPrice', '2500');
                    updateFilter('maxPrice', '');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  ₹2,500 and Above
                </button>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* Products Grid (3 cols on lg) */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-zinc-900 animate-pulse border border-zinc-800" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#0d0d0d] border border-zinc-800 p-8">
                <p className="text-base font-bold uppercase tracking-wider text-white mb-2">
                  No products matched your criteria
                </p>
                <p className="text-xs text-zinc-400 mb-6">
                  Try broadening your filters or searching for alternative streetwear keywords.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
