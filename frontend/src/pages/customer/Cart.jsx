import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldAlert, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal, shippingEstimate, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Your Shopping Bag Is Empty
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Explore our heavyweight t-shirts, fleece hoodies, and cargo statement jackets.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-vibe-accent hover:bg-vibe-accentHover text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all"
        >
          <span>Explore Streetwear</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const grandTotal = subtotal + shippingEstimate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Title */}
      <div className="border-b border-zinc-800 pb-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Shopping Bag
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Review Your Items ({itemCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-zinc-400 hover:text-red-400 uppercase tracking-wider transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Bag Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center"
            >
              <Link
                to={`/product/${item.slug}`}
                className="w-20 sm:w-24 aspect-[4/5] rounded-lg overflow-hidden bg-zinc-950 shrink-0"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-bold text-sm sm:text-base text-white hover:text-vibe-accent transition-colors truncate block"
                >
                  {item.name}
                </Link>

                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                  <span className="bg-zinc-800 px-2 py-0.5 rounded font-bold text-white">
                    Size: {item.size}
                  </span>
                  <span>₹{item.price.toLocaleString('en-IN')} each</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity modifier */}
                  <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-950">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm sm:text-base text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Policy Notice Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
            <ShieldAlert size={20} className="shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Note on Returns & Exclusivity:</strong> We currently do not offer returns or exchanges on placed orders. All items are quality-inspected before dispatch. Please verify your sizes before proceeding to checkout.
            </span>
          </div>

        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span className="flex items-center gap-1">
                  <Truck size={14} /> Express Pan-India Shipping
                </span>
                <span className="font-bold uppercase tracking-wider">Free (₹0)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Mode</span>
                <span className="font-bold text-vibe-accent">Prepaid UPI Only</span>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
              <span className="font-black uppercase text-sm text-white">Total Amount</span>
              <span className="text-2xl font-black text-white">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-vibe-accent/25 hover:scale-[1.02]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <p className="text-[11px] text-zinc-500 text-center">
              Requires user login • Secure PhonePe QR & UPI confirmation
            </p>
          </div>

          <Link
            to="/shop"
            className="block text-center text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>

    </div>
  );
};
