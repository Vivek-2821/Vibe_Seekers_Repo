import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'T-Shirts', path: '/shop?category=TSHIRTS' },
    { name: 'Hoodies', path: '/shop?category=HOODIES' },
    { name: 'Jackets', path: '/shop?category=JACKETS' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-black border-b border-zinc-800 text-xs py-2 px-4 text-center text-zinc-300 tracking-wider uppercase font-semibold flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-vibe-accent animate-ping inline-block"></span>
        <span>FREE SHIPPING PAN-INDIA • 100% PREPAID STORE • NO RETURNS APPLICABLE</span>
      </div>

      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/assets/logo.png"
                  alt="VIBE SEEKERS"
                  className="h-14 sm:h-16 w-auto object-contain brightness-110 drop-shadow-[0_0_16px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-vibe-accent transition-colors relative py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-vibe-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-zinc-300 hover:text-vibe-accent transition-colors"
                aria-label="Search Store"
              >
                <Search size={22} />
              </button>

              {/* User Account / Profile */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-vibe-accent transition-all">
                    <User size={18} />
                    <span className="hidden md:inline text-xs font-bold max-w-[100px] truncate">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-2 hidden group-hover:block transition-all z-50">
                    <div className="px-4 py-2 border-b border-zinc-800 text-xs">
                      <p className="font-bold text-white truncate">{user?.fullName}</p>
                      <p className="text-zinc-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-vibe-accent hover:bg-zinc-800 transition-colors"
                      >
                        <ShieldCheck size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/track-order"
                      className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      Track My Orders
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Cart Drawer Button */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-vibe-accent text-zinc-100 transition-all group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-vibe-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Slide-down Search Bar */}
        {searchOpen && (
          <div className="bg-zinc-900 border-b border-zinc-800 py-4 px-4 sm:px-8 transition-all animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search oversized tees, heavy fleece hoodies, cargo jackets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-vibe-accent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[113px] bg-black/95 backdrop-blur-xl border-t border-zinc-800 p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-bold uppercase tracking-wider text-zinc-200 hover:text-vibe-accent py-2 border-b border-zinc-900"
                >
                  {link.name}
                  <ChevronRight size={18} className="text-zinc-600" />
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-vibe-accent py-2 border-b border-zinc-900"
                >
                  <ShieldCheck size={20} />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-zinc-900 border border-zinc-800 text-red-400 rounded-lg font-bold text-sm uppercase tracking-wider"
                >
                  Sign Out ({user?.fullName})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg font-bold text-sm uppercase tracking-wider"
                >
                  Sign In / Register
                </Link>
              )}
              <p className="text-center text-xs text-zinc-500">
                WhatsApp Support: +91 9860498749
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
