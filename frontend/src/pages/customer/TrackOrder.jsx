import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (queryToFetch) => {
    if (!queryToFetch.trim()) return;
    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const res = await axiosInstance.get(`/api/tracking/${encodeURIComponent(queryToFetch.trim())}`);
      setTrackingData(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'No shipment found with this Order ID or AWB. Please check and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracking(searchQuery);
  };

  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Order Placed', desc: 'Prepaid details received' },
    { key: 'PAYMENT_VERIFIED', label: 'Payment Approved', desc: 'Verified by Vivek / Admin' },
    { key: 'PROCESSING', label: 'Quality Check & Packed', desc: 'Ready for courier handover' },
    { key: 'SHIPPED', label: 'Dispatched via Shiprocket', desc: 'In Transit across India' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'At your doorstep' },
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const orderProgression = ['PENDING_PAYMENT', 'PAYMENT_VERIFIED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = orderProgression.indexOf(currentStatus);
    const stepIndex = orderProgression.indexOf(stepKey);

    if (currentStatus === 'CANCELLED') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Search Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Live Shipment Tracker
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Track Your Streetwear Drop
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400">
          Enter your Vibe Seekers Order ID (e.g. <code>VS-261120-XXXX</code>) or Shiprocket AWB Tracking Number.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              required
              placeholder="e.g. VS-261120-1001 or Delhivery AWB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-vibe-accent font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Results Card */}
      {trackingData && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 animate-fadeIn">
          
          {/* Header with Order Status Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
            <div>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Order Reference</span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                #{trackingData.order?.orderNumber}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Placed on {new Date(trackingData.order?.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">
                Current Status
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-vibe-accent/20 text-vibe-accent border border-vibe-accent/30">
                {trackingData.order?.orderStatus?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Delivery Timeline</h3>
            <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-5 gap-4">
              {steps.map((st, i) => {
                const status = getStepStatus(st.key, trackingData.order?.orderStatus);
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed';

                return (
                  <div key={st.key} className="relative mb-6 sm:mb-0">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-vibe-accent text-white ring-4 ring-vibe-accent/20 animate-pulse'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wide mt-1 ${isCurrent ? 'text-vibe-accent' : isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                          {st.label}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shiprocket Courier Information */}
          {trackingData.order?.shiprocketAwb && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                  <Truck size={18} className="text-vibe-accent" />
                  <span>Shiprocket Logistics Partner</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  AWB: {trackingData.order?.shiprocketAwb}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Courier Name:</span>
                  <span className="font-bold text-white">{trackingData.order?.courierName || 'Delhivery Express'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Shipment Status:</span>
                  <span className="font-bold text-vibe-accent">
                    {trackingData.liveTracking?.currentStatus || 'IN TRANSIT'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Destination Hub:</span>
                  <span className="font-bold text-white">
                    {trackingData.order?.shippingAddress?.city}, {trackingData.order?.shippingAddress?.pincode}
                  </span>
                </div>
              </div>

              {/* Scans timeline if available */}
              {trackingData.liveTracking?.trackingScans?.length > 0 && (
                <div className="border-t border-zinc-800/80 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Live Courier Scans:</span>
                  <div className="space-y-2 text-xs">
                    {trackingData.liveTracking.trackingScans.map((scan, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-zinc-300">
                        <span className="font-mono text-zinc-500 text-[11px] shrink-0">{scan.date}</span>
                        <div>
                          <p className="font-semibold text-white">{scan.activity}</p>
                          <p className="text-[11px] text-zinc-500">{scan.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Items in this Drop</h3>
            <div className="divide-y divide-zinc-800 border-y border-zinc-800">
              {trackingData.order?.items?.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {it.imageUrl && (
                      <img src={it.imageUrl} alt={it.productName} className="w-12 h-14 object-cover rounded bg-zinc-950" />
                    )}
                    <div>
                      <p className="font-bold text-white">{it.productName}</p>
                      <p className="text-zinc-500">Size: {it.size} • Qty: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-white">₹{it.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STRICT NO RETURN POLICY REMINDER (Explicitly no return button) */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3.5 text-amber-300 text-xs leading-relaxed">
            <ShieldAlert size={20} className="shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold text-amber-400 uppercase tracking-wide">
                Store Policy Notice: No Returns or Exchanges
              </p>
              <p className="mt-0.5 text-zinc-300">
                In accordance with VIBE SEEKERS store policies, return options are currently unavailable. For delivery damage inquiries or courier support, reach our team directly at <strong>vibeseekers09@gmail.com</strong> or via WhatsApp at <strong>+91 9860498749</strong>.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
