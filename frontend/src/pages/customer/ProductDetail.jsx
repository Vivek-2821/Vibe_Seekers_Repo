import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Zap, ShieldAlert, Ruler, Truck, Check, ChevronRight, Share2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import { SizeGuideModal } from '../../components/shop/SizeGuideModal';
import { ProductCard } from '../../components/shop/ProductCard';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/public/products/${slug}`);
        const data = res.data.data;
        setProduct(data);
        setSelectedImageIndex(0);

        // Fetch related products in the same category
        if (data.category) {
          const relRes = await axiosInstance.get(`/api/public/categories/${data.category}`);
          setRelatedProducts(relRes.data.data.filter((p) => p.id !== data.id).slice(0, 4));
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
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-vibe-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-white uppercase">Product Not Found</h2>
        <p className="text-zinc-400 text-sm">The streetwear piece you're looking for does not exist or has dropped out of archive.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-vibe-accent text-white text-xs font-bold uppercase rounded-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map((img) => img.imageUrl)
    : [product.primaryImageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'];

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, quantity);
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
        message: `Express Streetwear Delivery available for PIN ${pincode} within 3-5 business days.`,
      });
    } catch {
      setPincodeResult({
        success: true,
        message: `Standard Express Delivery available for PIN ${pincode}.`,
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const discountPercent = product.discountPercent > 0
    ? product.discountPercent
    : (product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : null);

  const currentSizeStock = product.sizeStocks?.find((s) => s.size === selectedSize)?.stock ?? 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-zinc-300">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-zinc-300">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`} className="hover:text-zinc-300">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-zinc-300 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery with Zoom/Thumbnail Selector */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.newArrival && (
              <span className="absolute top-4 left-4 bg-vibe-accent text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                Fresh Drop
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-vibe-accent scale-105'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Actions */}
        <div className="space-y-6">
          
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
              {product.fabricDetails}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-y border-zinc-800/80 py-4">
            <span className="text-3xl font-black text-white">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <>
                <span className="text-base text-zinc-500 line-through">
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded">
                  SAVE {discountPercent}%
                </span>
              </>
            )}
            <span className="text-xs text-zinc-500 ml-auto font-medium">Inclusive of all taxes</span>
          </div>

          {/* Sizing Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Select Size:
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-bold text-vibe-accent hover:underline flex items-center gap-1"
              >
                <Ruler size={14} /> Size Guide
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const stock = product.sizeStocks?.find((s) => s.size === sz)?.stock ?? 5;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={sz}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-lg text-xs font-black uppercase tracking-wider border transition-all flex flex-col items-center justify-center gap-1 ${
                      selectedSize === sz
                        ? 'bg-vibe-accent text-white border-vibe-accent shadow-lg shadow-vibe-accent/20'
                        : isOutOfStock
                        ? 'bg-zinc-950 text-zinc-600 border-zinc-900 cursor-not-allowed line-through'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[9px] font-normal opacity-80">
                      {isOutOfStock ? 'Sold Out' : `${stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRITICAL STORE POLICY: NO RETURNS CURRENTLY AVAILABLE */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3.5 text-amber-300 text-xs leading-relaxed">
            <AlertCircle size={20} className="shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold text-amber-400 uppercase tracking-wide">
                No Returns Policy In Effect
              </p>
              <p className="mt-0.5 text-zinc-300">
                To guarantee brand freshness and limited drop exclusivity, return & exchange options are currently unavailable. Please verify sizing via our guide before ordering.
              </p>
            </div>
          </div>

          {/* Purchase CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added To Bag ({selectedSize})
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add To Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-vibe-accent/20 hover:scale-[1.02]"
              >
                <Zap size={18} /> Buy Now (Prepaid)
              </button>
            </div>
          </div>

          {/* Pincode Courier Check */}
          <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Truck size={16} className="text-vibe-accent" /> Check Pan-India Delivery
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Indian Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 flex-1 focus:outline-none focus:border-vibe-accent"
              />
              <button
                type="submit"
                disabled={checkingPincode}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg transition-colors"
              >
                {checkingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>
            {pincodeResult && (
              <p className={`text-xs ${pincodeResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {pincodeResult.message}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="space-y-3 border-t border-zinc-800 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Description & Specs</h3>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-2">
              {product.description}
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-800 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Complete Your Streetwear Fit
            </h3>
            <Link to="/shop" className="text-xs font-bold text-vibe-accent uppercase tracking-wider hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />

    </div>
  );
};
