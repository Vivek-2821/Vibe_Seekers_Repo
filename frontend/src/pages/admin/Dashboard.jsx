import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  Users,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-vibe-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      desc: 'All prepaid verified orders',
    },
    {
      label: 'Pending Verification',
      value: stats?.pendingPaymentVerifications || 0,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      desc: 'Requires 1-click UTR check',
      link: '/admin/orders?status=PENDING_PAYMENT',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      desc: 'Lifetime store orders',
      link: '/admin/orders',
    },
    {
      label: 'Active Shipments',
      value: stats?.activeShipments || 0,
      icon: Truck,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      desc: 'Shiprocket in-transit',
      link: '/admin/shiprocket',
    },
    {
      label: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      desc: 'OTP verified accounts',
      link: '/admin/customers',
    },
    {
      label: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      desc: 'Items under 5 units left',
      link: '/admin/products',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Store Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
            Overview & Metrics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-vibe-accent/20"
          >
            <PlusCircle size={16} /> Add New Product
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-zinc-900/60 border ${card.borderColor} flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {card.label}
                  </span>
                  <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
                <span>{card.desc}</span>
                {card.link && (
                  <Link
                    to={card.link}
                    className="text-vibe-accent hover:underline font-bold flex items-center gap-1"
                  >
                    View <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alerts Table */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={16} />
              <span>Low Inventory Streetwear Pieces (≤ 5 units remaining)</span>
            </div>
            <Link to="/admin/products" className="text-xs text-vibe-accent hover:underline font-bold">
              Manage Inventory
            </Link>
          </div>

          <div className="divide-y divide-zinc-800 text-xs">
            {stats.lowStockProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.primaryImageUrl && (
                    <img src={p.primaryImageUrl} alt={p.name} className="w-10 h-12 object-cover rounded bg-zinc-950" />
                  )}
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-zinc-500 uppercase">{p.category} • Total Stock: {p.totalStock} units</p>
                  </div>
                </div>
                <Link
                  to={`/admin/products?edit=${p.id}`}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Quick Config Notice */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Store Rules Status</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Cash on Delivery is currently <strong>DISABLED</strong>. Returns policy is currently <strong>DISABLED</strong>.
          </p>
        </div>
        <Link
          to="/admin/settings"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Change Store Toggles
        </Link>
      </div>

    </div>
  );
};
