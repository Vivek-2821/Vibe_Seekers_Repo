import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { resolveImageUrl } from '../../utils/imageUrl';

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponLoading,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-zinc-800 text-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-white" size={20} />
                <h3 className="font-bold tracking-widest text-sm uppercase">
                  Your Bag ({items.reduce((acc, i) => acc + (Number(i?.quantity) || 1), 0)})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-[#141414] px-6 py-2.5 border-b border-zinc-800/60 text-xs flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Free Express Delivery Pan-India
              </span>
              <span className="text-zinc-400 font-mono">₹0 FEE</span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-800/60">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                    <ShoppingBag size={30} />
                  </div>
                  <h4 className="text-base font-bold tracking-wider uppercase mb-1">Your bag is empty</h4>
                  <p className="text-zinc-400 text-xs max-w-xs mb-6">
                    Explore our latest drops in heavyweight streetwear tees, hoodies, and jackets.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                    className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-none"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="py-4 flex gap-4">
                    <img
                      src={resolveImageUrl(item.imageUrl, '/assets/logo.png')}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded bg-zinc-900 border border-zinc-800 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            SIZE: {item.size}
                          </span>
                          {item.color && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-white tracking-wide">
                            ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                          {item.mrp && Number(item.mrp) > Number(item.price) && (
                            <span className="block text-[10px] text-zinc-500 line-through">
                              ₹{(Number(item.mrp || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customization Details Badge */}
                      {(item.customizationPlacement || item.customText || item.customDesignUrl) && (
                        <div className="mt-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded text-[10px] text-zinc-400 space-y-0.5">
                          <div>
                            <span className="text-vibe-accent font-bold uppercase">Print:</span> {item.customizationPlacement || 'Custom'}
                          </div>
                          {item.customText && (
                            <div>
                              <span className="text-zinc-500">Text:</span> "{item.customText}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary if items > 0 */}
            {items.length > 0 && (
              <div className="border-t border-zinc-800 bg-zinc-950 p-6 space-y-4">
                {/* Coupon Code Section */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <div>
                          <span className="font-bold text-emerald-300 uppercase tracking-wider">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-zinc-400 ml-2">
                            ({appliedCoupon.discountPercent}% OFF applied)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-zinc-400 hover:text-red-400 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Coupon Code (e.g. VIBE10)"
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 text-xs uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 rounded"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors rounded"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-400 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">₹{Number(subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {Number(discountAmount || 0) > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{Number(discountAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {Number(shippingEstimate || 0) > 0 ? (
                      <span className="font-bold text-white">₹{Number(shippingEstimate || 0).toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-emerald-400 uppercase font-semibold">Free (₹0)</span>
                    )}
                  </div>
                  <div className="border-t border-zinc-800 pt-2 flex justify-between text-base font-bold text-white">
                    <span>Estimated Total</span>
                    <span className="tracking-wide">₹{Number(finalTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                  >
                    <span>Checkout Now</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/cart');
                    }}
                    className="w-full py-2.5 bg-zinc-900 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 transition-colors text-center block"
                  >
                    View Bag Details
                  </button>
                </div>

                <div className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-zinc-400" />
                  <span>100% Secure Prepaid UPI & Card Checkout • No Returns Applicable</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
