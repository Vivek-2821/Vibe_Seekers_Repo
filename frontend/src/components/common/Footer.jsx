import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, ShieldAlert, Truck, CreditCard, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-sm">
      
      {/* Trust Highlights Section */}
      <div className="border-b border-zinc-900 py-10 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-vibe-accent rounded-lg">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Pan-India Delivery</h4>
              <p className="text-xs text-zinc-500 mt-1">Reliable, express door-to-door courier logistics to every Indian pincode.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-vibe-accent rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Prepaid UPI Checkout</h4>
              <p className="text-xs text-zinc-500 mt-1">Instant QR scan & UPI payments with 12-digit UTR verification.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-vibe-accent rounded-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Heavyweight Drip</h4>
              <p className="text-xs text-zinc-500 mt-1">240+ GSM terry cotton, acid washes, and bold statement silhouettes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-amber-500 rounded-lg">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Clear Sizing & Policy</h4>
              <p className="text-xs text-zinc-500 mt-1">Return options are currently unavailable. Check size charts before checkout.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/logo.png"
                alt="VIBE SEEKERS"
                className="h-16 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400 max-w-sm">
              VIBE SEEKERS is an authentic Indian streetwear clothing label founded to redefine oversized fashion, heavyweight fabrics, and bold underground silhouettes.
            </p>
            <div className="pt-2">
              <p className="text-xs text-zinc-300 font-semibold">Payee & Brand Owner:</p>
              <p className="text-xs text-zinc-500">Vivek Ashok Matne</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-vibe-accent rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/919860498749"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-lg transition-colors"
                aria-label="WhatsApp Support"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:vibeseekers09@gmail.com"
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-vibe-accent rounded-lg transition-colors"
                aria-label="Email Support"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Streetwear Categories */}
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-white mb-4">Streetwear</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=TSHIRTS" className="hover:text-vibe-accent transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=HOODIES" className="hover:text-vibe-accent transition-colors">
                  Heavy Fleece Hoodies
                </Link>
              </li>
              <li>
                <Link to="/shop?category=JACKETS" className="hover:text-vibe-accent transition-colors">
                  Cargo & Coach Jackets
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-vibe-accent transition-colors">
                  New Drops & Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help & Orders */}
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-white mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/track-order" className="hover:text-vibe-accent transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-vibe-accent transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/order-policy" className="hover:text-vibe-accent transition-colors">
                  Return & Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-vibe-accent transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-vibe-accent transition-colors">
                  About Vibe Seekers
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support Details */}
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-white mb-4">Direct Contact</h3>
            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/919860498749"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Phone size={14} className="text-emerald-500" />
                <span>+91 9860498749 (WhatsApp)</span>
              </a>
              <a
                href="mailto:vibeseekers09@gmail.com"
                className="flex items-center gap-2 hover:text-vibe-accent transition-colors truncate"
              >
                <Mail size={14} className="text-vibe-accent" />
                <span className="truncate">vibeseekers09@gmail.com</span>
              </a>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 text-[11px] leading-relaxed">
                <span className="text-vibe-accent font-bold block mb-1">Prepaid Store Notice</span>
                All orders are processed through prepaid UPI verification. Cash on Delivery is disabled.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Policy & Copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} VIBE SEEKERS. All Rights Reserved. Crafted for Indian Streetwear Culture.</p>
          <div className="flex items-center gap-6">
            <Link to="/order-policy" className="hover:text-zinc-300 transition-colors">
              No Returns Policy
            </Link>
            <Link to="/faq" className="hover:text-zinc-300 transition-colors">
              Size & Care Guide
            </Link>
            <Link to="/admin/login" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
