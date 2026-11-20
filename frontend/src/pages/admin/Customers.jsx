import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, CheckCircle2, XCircle, Search } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/customers');
        setCustomers(res.data.data || []);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          User Accounts
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
          Registered Customers ({customers.length})
        </h1>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name, email, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-vibe-accent"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] font-bold border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Verification</th>
                <th className="py-4 px-4">Orders Placed</th>
                <th className="py-4 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm">{c.fullName || 'Streetwear Fan'}</p>
                      <p className="text-[11px] text-zinc-500">{c.email}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-zinc-300">{c.phone || 'N/A'}</p>
                    </td>

                    <td className="py-4 px-4">
                      {c.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 size={14} /> OTP Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                          <XCircle size={14} /> Unverified
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-white bg-zinc-800 px-2.5 py-1 rounded">
                        {c.orderCount || 0} orders
                      </span>
                    </td>

                    <td className="py-4 px-6 text-zinc-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
