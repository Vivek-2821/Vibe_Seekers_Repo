import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-zinc-800 text-zinc-400 text-xs">

      {/* 1. Value Props Bar */}
      <div className="border-b border-zinc-800/80 py-10 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">PAN-INDIA EXPRESS</h4>
              <p className="text-zinc-500 mt-1 text-[11px] leading-relaxed">
                Fast, insured door-to-door courier delivery to all Indian pin codes at zero shipping charges.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">100% PREPAID UPI</h4>
              <p className="text-zinc-500 mt-1 text-[11px] leading-relaxed">
                Direct PhonePe / GPay QR scan & UTR confirmation. No fraudulent COD cancellations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">HEAVYWEIGHT DRIP</h4>
              <p className="text-zinc-500 mt-1 text-[11px] leading-relaxed">
                240+ GSM combed terry cotton, acid-wash patinas, and signature drop-shoulder silhouettes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-300 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">STRICT NO-RETURN</h4>
              <p className="text-zinc-500 mt-1 text-[11px] leading-relaxed">
                To maintain hygiene & limited batch exclusivity, returns are not applicable. Check size guide.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Editorial Footer & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand Bio & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src="/assets/logo.png"
                alt="VIBE SEEKERS"
                className="h-16 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              VIBE SEEKERS is an authentic Indian streetwear clothing label founded to redefine oversized fashion, heavyweight fabrics, and bold underground silhouettes for boys and girls.
            </p>
            <div className="text-[11px] text-zinc-500 space-y-0.5">
              <p><strong className="text-zinc-300">Brand Owner & Payee:</strong> Vivek Ashok Matne</p>
              <p><strong className="text-zinc-300">Registered UPI:</strong> 9860498749-2@ybl</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/919860498749"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-900 hover:bg-emerald-500 hover:text-black border border-zinc-800 text-zinc-300 transition-colors"
                aria-label="WhatsApp Support"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:vibeseekers09@gmail.com"
                className="p-2.5 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 transition-colors"
                aria-label="Email Support"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links: Shop (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-[0.2em] text-xs">COLLECTIONS</h5>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Drops</Link></li>
              <li><Link to="/shop?category=Customize T-Shirts" className="hover:text-white transition-colors text-vibe-accent font-semibold">Customize T-Shirts</Link></li>
              <li><Link to="/shop?category=T-Shirts" className="hover:text-white transition-colors">Oversized Tees</Link></li>
              <li><Link to="/shop?category=Hoodies" className="hover:text-white transition-colors">Heavyweight Hoodies</Link></li>
              <li><Link to="/shop?category=Jackets" className="hover:text-white transition-colors">Statement Jackets</Link></li>
              <li><Link to="/shop?category=Shirts" className="hover:text-white transition-colors">Cuban Shirts</Link></li>
              <li><Link to="/shop?filter=new" className="hover:text-white transition-colors">New Drops</Link></li>
              <li><Link to="/shop?filter=bestseller" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Support & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-[0.2em] text-xs">CLIENT CARE</h5>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/order-policy" className="hover:text-white transition-colors">Prepaid & Return Policy</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Brand Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Vivek</Link></li>
              <li><Link to="/admin/login" className="text-zinc-500 hover:text-white transition-colors font-medium">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-[0.2em] text-xs">VIBE CLUB NEWSLETTER</h5>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Subscribe to unlock secret drops, early archive access, and 10% off your first streetwear purchase.
            </p>
            {subscribed ? (
              <div className="p-3 bg-zinc-900 border border-zinc-700 text-white flex items-center gap-2 text-xs">
                <Check size={16} className="text-emerald-400" />
                <span>You're in the Vibe Club. Use code <strong>VIBE10</strong>!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#141414] border border-zinc-800 text-white px-3 py-2.5 text-xs outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex-shrink-0 flex items-center gap-1"
                >
                  <span>JOIN</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
            <p className="text-[10px] text-zinc-500">
              By subscribing, you agree to receive VIBE SEEKERS drop alerts. Unsubscribe at any time.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-zinc-900 bg-[#050505] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} VIBE SEEKERS. All rights reserved. Designed for the culture.
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>UPI • PhonePe • Google Pay • Paytm • Cards</span>
            <span className="text-zinc-700">•</span>
            <Link to="/admin/login" className="text-zinc-600 hover:text-zinc-300 transition-colors uppercase tracking-widest text-[10px]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
