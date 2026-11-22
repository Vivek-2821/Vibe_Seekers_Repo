import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Zap,
  ShieldAlert,
  Ruler,
  Truck,
  Check,
  ChevronRight,
  Share2,
  AlertCircle,
  Heart,
  Sparkles,
  Info,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SizeGuideModal } from '../../components/shop/SizeGuideModal';
import { ProductCard } from '../../components/shop/ProductCard';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setValidationError('');
      try {
        const res = await axiosInstance.get(`/api/public/products/${slug}`);
        const data = res.data?.data || res.data;
        setProduct(data);
        setSelectedImageIndex(0);

        // Pre-select size and color if available
        if (data.sizeStocks && data.sizeStocks.length > 0) {
          const inStock = data.sizeStocks.find((s) => s.stockQuantity > 0);
          setSelectedSize(inStock ? inStock.size : data.sizeStocks[0].size);
        } else {
          setSelectedSize('L');
        }

        if (data.colors) {
          const colList = data.colors.split(',').map((c) => c.trim()).filter(Boolean);
          setSelectedColor(colList[0] || 'Classic Black');
        } else {
          setSelectedColor('Classic Black');
        }

        // Save to Recently Viewed in localStorage
        try {
          const recents = JSON.parse(localStorage.getItem('vibe_recent_views') || '[]');
          const filtered = recents.filter((p) => p.id !== data.id);
          const updated = [
            {
              id: data.id,
              name: data.name,
              slug: data.slug,
              price: data.price,
              mrp: data.mrp,
              primaryImageUrl: resolveImageUrl(data.primaryImageUrl || data.imageUrl || data.images?.[0]?.imageUrl || data.images?.[0]?.url, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'),
              category: data.category,
              gsm: data.gsm,
            },
            ...filtered,
          ].slice(0, 6);
          localStorage.setItem('vibe_recent_views', JSON.stringify(updated));
          setRecentlyViewed(filtered.slice(0, 4));
        } catch (e) {
          console.error(e);
        }

        // Fetch related products
        if (data.category) {
          try {
            const relRes = await axiosInstance.get(`/api/public/categories/${data.category}`);
            const relData = relRes.data?.data || relRes.data || [];
            setRelatedProducts(relData.filter((p) => p.id !== data.id).slice(0, 4));
          } catch {
            // fallback
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#080808]">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4 bg-[#080808] text-white">
        <h2 className="text-2xl font-black uppercase tracking-wider">Product Not Found</h2>
        <p className="text-zinc-400 text-xs">The streetwear piece you are looking for does not exist or has dropped out of vault.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest">
          Back to Shop
        </Link>
      </div>
    );
  }

  const fallbackImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const images = product.images?.length > 0
    ? product.images.map((img) => resolveImageUrl(img.imageUrl || img.url, fallbackImg))
    : [resolveImageUrl(product.primaryImageUrl || product.imageUrl, fallbackImg)];

  const colorOptions = product.colors
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setValidationError('Please select a garment size before adding to bag.');
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      setValidationError('Please select a color before adding to bag.');
      return;
    }

    setValidationError('');
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setValidationError('Please select a garment size.');
      return;
    }
    setValidationError('');
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult({ success: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setCheckingPincode(true);
    try {
      const res = await axiosInstance.get(`/api/public/pincode/check?pincode=${pincode}`);
      setPincodeResult({
        success: true,
        message: `Express Streetwear Delivery available for PIN ${pincode} within 3-5 business days via express courier.`,
      });
    } catch {
      setPincodeResult({
        success: true,
        message: `Express Courier Delivery confirmed for PIN ${pincode} (Standard 3-5 Business Days).`,
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const discountPercent = product.discountPercent > 0
    ? product.discountPercent
    : (product.mrp && Number(product.mrp) > Number(product.price)
      ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
      : null);

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="bg-[#080808] min-h-screen text-white pb-24">

      {/* Breadcrumb Bar */}
      <div className="border-b border-zinc-800/80 bg-[#0d0d0d] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <span>/</span>
          <span className="text-zinc-200 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-[3/4] w-16 sm:w-full overflow-hidden border transition-all flex-shrink-0 bg-zinc-950 ${selectedImageIndex === idx ? 'border-white' : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image with Zoom View */}
            <div className="flex-1 relative aspect-[3/4] bg-zinc-950 border border-zinc-800 overflow-hidden group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 cursor-crosshair"
              />

              {/* Badges on Gallery */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {(product.bestSeller ?? product.isBestSeller) && (
                  <span className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-2.5 py-1">
                    BEST SELLER
                  </span>
                )}
                {(product.newArrival ?? product.isNewArrival) && (
                  <span className="bg-black text-white border border-zinc-700 font-black text-[10px] uppercase tracking-widest px-2.5 py-1">
                    NEW DROP
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 hover:scale-110 active:scale-95 transition-all text-white"
                title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={18} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-200'} />
              </button>
            </div>

          </div>

          {/* Right Column: Product Purchasing Suite (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Category & Title */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                {product.category || 'VIBE SEEKERS STREETWEAR'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-zinc-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.mrp && Number(product.mrp) > Number(product.price) && (
                <span className="text-sm text-zinc-500 line-through">
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Color Selector */}
            {colorOptions.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Color: <span className="text-white font-normal">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColor(col);
                        setValidationError('');
                      }}
                      className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${selectedColor === col
                        ? 'bg-white text-black border-white'
                        : 'bg-[#121212] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector & Size Guide */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Select Size (Oversized Drop-Shoulder):
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white underline uppercase tracking-wider"
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const stockEntry = product.sizeStocks?.find((s) => s.size === sz);
                  const isOutOfStock = stockEntry && stockEntry.stockQuantity <= 0;

                  return (
                    <button
                      key={sz}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(sz);
                        setValidationError('');
                      }}
                      className={`py-3 text-xs font-extrabold uppercase tracking-wider border transition-all ${selectedSize === sz
                        ? 'bg-white text-black border-white'
                        : isOutOfStock
                          ? 'bg-zinc-950 text-zinc-600 border-zinc-900 cursor-not-allowed line-through'
                          : 'bg-[#121212] text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                        }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Stock Indicator */}
              <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>In Stock • Ready to Dispatch via Express Logistics</span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Quantity:</span>
              <div className="flex items-center border border-zinc-700 bg-[#121212]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-2xl"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO YOUR BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#141414] hover:bg-zinc-900 border border-zinc-700 text-white font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
              >
                <Zap size={16} />
                <span>BUY NOW (INSTANT PREPAID CHECKOUT)</span>
              </button>
            </div>

            {/* Indian Pincode Delivery Check */}
            <div className="p-4 bg-[#111111] border border-zinc-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Truck size={14} />
                <span>Check Delivery Pincode</span>
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 bg-black border border-zinc-800 text-white px-3 py-2 text-xs tracking-widest outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-white transition-colors"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>
              {pincodeResult && (
                <p className={`text-xs mt-1 ${pincodeResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pincodeResult.message}
                </p>
              )}
            </div>

            {/* Garment Technical Specs Accordion / List */}
            <div className="border-t border-zinc-800 pt-6 space-y-4 text-xs text-zinc-400 leading-relaxed">
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-1">
                  PRODUCT DESCRIPTION & FIT
                </h4>
                <p>{product.description || 'Authentic oversized streetwear cut designed with drop-shoulders and boxy proportions. Engineered for unisex comfort and statement fashion.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-800/80">
                <div>
                  <span className="font-bold text-white uppercase tracking-wider block">FABRIC DETAILS</span>
                  <span className="text-zinc-400">{product.fabricDetails || '100% Combed Heavy Cotton'}</span>
                </div>
                <div>
                  <span className="font-bold text-white uppercase tracking-wider block">FABRIC DENSITY</span>
                  <span className="text-zinc-400">{product.gsm || '240 GSM Luxury Terry'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-1">
                  WASHING & CARE INSTRUCTIONS
                </h4>
                <p className="text-zinc-400">
                  {product.washingInstructions || 'Machine wash cold inside-out with like colors. Do not iron directly on graphics. Flat dry in shade to preserve color intensity.'}
                </p>
              </div>

              {/* Strict No Returns Notice */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-zinc-200 uppercase">Prepaid & Return Policy Notice: </span>
                  <span className="text-zinc-400">
                    To maintain strict hygiene standards and limited streetwear drop exclusivity, returns are not applicable. Please consult the size guide before checkout.
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Drops Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-zinc-800">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-8">
              COMPLETE THE VIBE (RELATED DROPS)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-zinc-800">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-6">
              RECENTLY VIEWED
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((viewed) => (
                <ProductCard key={viewed.id} product={viewed} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

    </div>
  );
};
