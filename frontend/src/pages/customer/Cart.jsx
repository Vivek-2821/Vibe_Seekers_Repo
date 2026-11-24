import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/imageUrl';

export const Cart = () => {
  const {
    items = [],
    updateQuantity,
    removeItem,
    clearCart,
    subtotal = 0,
    discountAmount = 0,
    finalTotal = 0,
    shippingEstimate = 0,
    shippingEnabled = false,
    shippingAmount = 0,
    itemCount = 0,
    appliedCoupon = null,
    applyCoupon,
    removeCoupon,
    couponError = '',
    couponLoading = false,
  } = useCart() || {};
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = await applyCoupon(couponCode.trim());
    if (ok) setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#080808] min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto py-16 text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Your Shopping Bag Is Empty
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed uppercase tracking-wider">
            Explore our heavyweight t-shirts, fleece hoodies, and cargo statement drops.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-[0.2em] transition-all"
          >
            <span>Explore Drops</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-6 mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
              STREETWEAR BAG
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              REVIEW YOUR ITEMS ({itemCount})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-zinc-400 hover:text-red-400 uppercase tracking-wider transition-colors"
          >
            Empty Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="bg-[#121212] border border-zinc-800 p-4 sm:p-5 flex gap-4 sm:gap-6 items-center"
              >
                <Link
                  to={`/product/${item.slug}`}
                  className="w-20 sm:w-28 aspect-[3/4] bg-zinc-950 border border-zinc-800 shrink-0 overflow-hidden"
                >
                  <img
                    src={resolveImageUrl(item.imageUrl, '/assets/logo.png')}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-bold text-sm sm:text-base text-white hover:underline uppercase tracking-wide truncate block"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-zinc-400 font-medium">
                    <span className="bg-zinc-800 px-2 py-0.5 text-white uppercase text-[11px] font-bold">
                      SIZE: {item.size}
                    </span>
                    {item.color && (
                      <span className="bg-zinc-800 px-2 py-0.5 text-zinc-300 uppercase text-[11px]">
                        COLOR: {item.color}
                      </span>
                    )}
                    <span>•</span>
                    <span className="font-mono text-zinc-300">₹{Number(item.price || 0).toLocaleString('en-IN')} each</span>
                  </div>

                  {/* Customization Details Badge */}
                  {(item.customizationPlacement || item.customText || item.customDesignUrl) && (
                    <div className="mt-2.5 p-2 bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-vibe-accent/20 text-vibe-accent font-extrabold uppercase text-[9px] tracking-wider">
                          CUSTOM PRINT
                        </span>
                        {item.customizationPlacement && (
                          <span className="text-zinc-300">
                            Placement: <strong className="text-white">{item.customizationPlacement}</strong>
                          </span>
                        )}
                      </div>
                      {item.customText && (
                        <div className="text-zinc-400">
                          Text: <span className="text-white font-mono font-bold">"{item.customText}"</span>
                        </div>
                      )}
                      {item.customDesignUrl && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <img
                            src={resolveImageUrl(item.customDesignUrl)}
                            alt="Custom Artwork"
                            className="w-6 h-6 object-cover border border-zinc-700 bg-black"
                          />
                          <a
                            href={item.customDesignUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-vibe-accent hover:underline"
                          >
                            View Artwork
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-zinc-700 bg-black">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-extrabold text-white">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                      {item.mrp && Number(item.mrp) > Number(item.price) && (
                        <span className="block text-[11px] text-zinc-500 line-through">
                          ₹{(Number(item.mrp || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Strict Notice banner */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 flex items-start gap-3 text-xs text-zinc-400">
              <ShieldAlert size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white uppercase">Prepaid Streetwear Policy: </strong>
                All orders are dispatched via tracked express courier across India. Due to limited batch exclusivity and hygiene standards, returns are not applicable.
              </div>
            </div>
          </div>

          {/* Right: Summary & Promo Code (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#121212] border border-zinc-800 p-6 space-y-6 sticky top-28">

              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white pb-3 border-b border-zinc-800">
                ORDER SUMMARY
              </h3>

              {/* Coupon Form */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Promotional Coupon
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <div>
                        <span className="font-bold text-emerald-300 uppercase tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[11px] text-zinc-400">
                          {appliedCoupon.discountPercent}% discount applied
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-zinc-400 hover:text-red-400 underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER COUPON (VIBE10)"
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-zinc-800 text-xs font-mono uppercase tracking-wider text-white placeholder-zinc-500 outline-none focus:border-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'APPLY'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-400 mt-1.5">{couponError}</p>}
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-2.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-white">₹{Number(subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                {Number(discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₹{Number(discountAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier Shipping</span>
                  {Number(shippingEstimate || 0) > 0 ? (
                    <span className="font-bold text-white">₹{Number(shippingEstimate || 0).toFixed(2)}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold uppercase">FREE (₹0)</span>
                  )}
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-black text-white">
                  <span>ESTIMATED TOTAL</span>
                  <span className="tracking-wide">₹{Number(finalTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-2xl"
              >
                <span>PROCEED TO PREPAID CHECKOUT</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck size={13} className="text-zinc-400" />
                <span>100% Secure UPI / PhonePe / Card Gateway</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
