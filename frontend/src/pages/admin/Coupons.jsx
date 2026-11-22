import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle, Percent } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [form, setForm] = useState({
    code: '',
    discountPercent: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    expiryDate: '',
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/coupons');
      setCoupons(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!form.code.trim() || !form.discountPercent) {
      setErrorMessage('Coupon code and discount percentage are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountPercent: Number(form.discountPercent),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        expiryDate: form.expiryDate ? form.expiryDate : null,
      };

      await axiosInstance.post('/api/admin/coupons', payload);
      setSuccessToast(`Coupon "${payload.code}" created successfully!`);
      setTimeout(() => setSuccessToast(''), 3000);
      setIsModalOpen(false);
      setForm({
        code: '',
        discountPercent: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        expiryDate: '',
      });
      fetchCoupons();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await axiosInstance.delete(`/api/admin/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setSuccessToast(`Coupon "${code}" deleted.`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Store Promotions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
            Coupon Codes & Discounts
          </h1>
        </div>

        <button
          onClick={() => {
            setErrorMessage('');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-[#121212] border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 text-xs">Loading coupon records...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs space-y-2">
            <Tag size={24} className="mx-auto text-zinc-600 mb-2" />
            <p className="font-bold uppercase tracking-wider text-white">No active coupons created yet</p>
            <p className="text-[11px] text-zinc-500">Click "Create Coupon" above to add promo codes like VIBE10.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/60 text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Order</th>
                  <th className="py-3 px-4">Max Discount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white tracking-widest">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {c.discountPercent}% OFF
                    </td>
                    <td className="py-3 px-4">
                      {c.minOrderAmount ? `₹${c.minOrderAmount.toLocaleString('en-IN')}` : 'No Minimum'}
                    </td>
                    <td className="py-3 px-4">
                      {c.maxDiscountAmount ? `₹${c.maxDiscountAmount.toLocaleString('en-IN')}` : 'No Cap'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        c.isActive ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-red-950/60 text-red-400'
                      }`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        title="Delete coupon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-zinc-800 w-full max-w-md p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
              Create Promotional Coupon
            </h3>

            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIBE15"
                  className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs font-mono tracking-widest text-white uppercase focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Discount Percentage (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                  placeholder="e.g. 15"
                  className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="e.g. 999"
                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Max Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-xs font-bold uppercase text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  {submitting ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
