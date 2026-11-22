import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Truck,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products & Media', path: '/admin/products', icon: Shirt },
    { name: 'Orders & Payments', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Shiprocket Logistics', path: '/admin/shiprocket', icon: Truck },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 shrink-0">
        
        {/* Admin Header */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-800 gap-3">
          <img src="/assets/logo.png" alt="Vibe Seekers" className="h-12 w-auto object-contain brightness-110" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-vibe-accent block">
              Admin Portal
            </span>
            <span className="text-xs font-bold text-zinc-400">Streetwear HQ</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-vibe-accent text-white shadow-lg shadow-vibe-accent/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Storefront & Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={16} /> Live Storefront
            </span>
            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-zinc-800/60 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex">
          <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-full flex flex-col p-4 justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <img src="/assets/logo.png" alt="Vibe Seekers" className="h-12 w-auto object-contain brightness-110" />
                <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        isActive ? 'bg-vibe-accent text-white' : 'text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-zinc-800 rounded-lg"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-20 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black uppercase tracking-wider text-white">
                VIBE SEEKERS Management Console
              </h1>
              <p className="text-[11px] text-zinc-400">Owner & Admin: Vivek Ashok Matne</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend Connected</span>
            </span>

            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4 text-xs font-bold text-zinc-300">
              <ShieldCheck size={18} className="text-vibe-accent" />
              <span className="hidden md:inline">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Routed Sub-page View */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
