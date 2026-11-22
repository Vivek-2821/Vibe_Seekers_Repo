import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Heart,
  LogOut,
  ShieldCheck,
  Package,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SearchModal } from './SearchModal';
import { CartDrawer } from './CartDrawer';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Best Sellers', path: '/shop?filter=bestseller' },
    { name: 'About Us', path: '/about' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#080808] border-b border-zinc-800 text-[11px] sm:text-xs py-2 px-4 text-center text-zinc-300 font-medium tracking-wider uppercase flex items-center justify-center gap-3 overflow-hidden select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>FREE EXPRESS SHIPPING ACROSS INDIA</span>
          <span className="text-zinc-600">•</span>
          <span className="hidden sm:inline">USE CODE <strong className="text-white underline tracking-widest">VIBE10</strong> FOR 10% OFF</span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="hidden md:inline">100% PREPAID AUTHENTIC STREETWEAR</span>
        </div>
      </div>

      {/* 2. Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080808]/95 backdrop-blur-md border-b border-zinc-800 shadow-xl'
            : 'bg-[#080808] border-b border-zinc-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

            {/* Brand Logo - Crisp, Large & Balanced */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group py-2">
                <img
                  src="/assets/logo.png"
                  alt="VIBE SEEKERS"
                  className="h-12 sm:h-16 md:h-18 w-auto object-contain brightness-110 contrast-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:scale-[1.02] transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path.includes('?') && location.search === link.path.split('?')[1]);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors relative py-1.5 group ${
                      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search, Wishlist, Account, Cart */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-full transition-colors"
                title="Search Products"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Icon */}
              <Link
                to={isAuthenticated ? "/cart" : "/login"}
                onClick={(e) => {
                  if (isAuthenticated) {
                    // Navigate to account or shop
                  }
                }}
                className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-full transition-colors relative group"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={20} className={wishlistCount > 0 ? "fill-white text-white" : ""} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Profile Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
                      aria-label="User Account"
                    >
                      <User size={18} />
                      <span className="hidden md:inline text-xs font-semibold max-w-[90px] truncate">
                        {user?.fullName ? user.fullName.split(' ')[0] : 'Account'}
                      </span>
                      <ChevronDown size={14} className="hidden md:inline text-zinc-400" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-3 w-56 bg-[#121212] border border-zinc-800 text-white shadow-2xl z-50 divide-y divide-zinc-800/80"
                        >
                          <div className="px-4 py-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-white truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              to="/track-order"
                              className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 uppercase tracking-wider font-medium"
                            >
                              <Package size={14} />
                              Track Orders
                            </Link>
                            {isAdmin && (
                              <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2.5 text-xs text-emerald-400 hover:bg-zinc-800/60 uppercase tracking-wider font-bold"
                              >
                                <ShieldCheck size={14} />
                                Admin Dashboard
                              </Link>
                            )}
                          </div>

                          <div className="py-1">
                            <button
                              onClick={() => {
                                logout();
                                setUserDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-zinc-800/60 uppercase tracking-wider font-semibold text-left"
                            >
                              <LogOut size={14} />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-full transition-colors flex items-center gap-1.5"
                    title="Account Sign In"
                    aria-label="Sign In"
                  >
                    <User size={20} />
                    <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Shopping Bag Trigger -> opens CartDrawer */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-white text-black hover:bg-zinc-200 transition-colors rounded-none flex items-center justify-center group"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-black border border-white px-1.5 py-0.5 rounded-full leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#0d0d0d] border-b border-zinc-800 px-6 py-6 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-300 hover:text-white transition-colors py-2 border-b border-zinc-800/50 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-zinc-600 text-xs">→</span>
                  </Link>
                ))}

                {/* Mobile Extra Links */}
                <div className="pt-4 flex flex-col space-y-3 text-xs tracking-wider uppercase text-zinc-400">
                  <Link to="/order-policy" className="hover:text-white">Store Policies & Prepaid Terms</Link>
                  <Link to="/faq" className="hover:text-white">Frequently Asked Questions</Link>
                  <Link to="/contact" className="hover:text-white">Customer Support</Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Modals: Live Search & Slide-out Cart Drawer */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
};
