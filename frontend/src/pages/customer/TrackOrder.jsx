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
      setTrackingData(res.data?.data || res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'No order or shipment found with this ID or AWB. Please verify and try again.'
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
    { key: 'ORDER_PLACED', altKey: 'PENDING_PAYMENT', label: 'Order Placed', desc: 'Prepaid order details received' },
    { key: 'CONFIRMED', altKey: 'PAYMENT_VERIFIED', label: 'Order Confirmed', desc: 'Payment verified by Vibe Seekers team' },
    { key: 'PROCESSING', altKey: 'PROCESSING', label: 'Processing', desc: 'Garments quality-checked & packed' },
    { key: 'SHIPPED', altKey: 'SHIPPED', label: 'Shipped', desc: 'Dispatched via Express Courier' },
    { key: 'OUT_FOR_DELIVERY', altKey: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier agent delivering today' },
    { key: 'DELIVERED', altKey: 'DELIVERED', label: 'Delivered', desc: 'Handed over at your doorstep' },
  ];

  const getStepStatus = (stepKey, altKey, currentStatus) => {
    const orderProgression = [
      ['ORDER_PLACED', 'PENDING_PAYMENT'],
      ['CONFIRMED', 'PAYMENT_VERIFIED'],
      ['PROCESSING'],
      ['SHIPPED'],
      ['OUT_FOR_DELIVERY'],
      ['DELIVERED'],
    ];

    if (currentStatus === 'CANCELLED') return 'cancelled';

    let currentIndex = -1;
    for (let i = 0; i < orderProgression.length; i++) {
      if (orderProgression[i].includes(currentStatus)) {
        currentIndex = i;
        break;
      }
    }

    let stepIndex = -1;
    for (let i = 0; i < orderProgression.length; i++) {
      if (orderProgression[i].includes(stepKey) || (altKey && orderProgression[i].includes(altKey))) {
        stepIndex = i;
        break;
      }
    }

    if (currentIndex === -1) return 'upcoming';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
        
        {/* Search Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            ORDER LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            TRACK YOUR STREETWEAR DROP
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">
            Enter your Vibe Seekers Order ID or courier tracking reference number.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 pt-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="e.g. VS-261120-1001 or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-zinc-800 pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'TRACKING...' : 'TRACK'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-xl mx-auto p-4 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details Card */}
        {trackingData && (
          <div className="bg-[#121212] border border-zinc-800 p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* Order Header Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <span className="text-xs text-zinc-500 font-mono block">VIBE SEEKERS ORDER</span>
                <h3 className="text-xl font-black text-white font-mono uppercase tracking-wider mt-0.5">
                  #{trackingData.orderNumber || trackingData.id}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Recipient: <strong className="text-white">{trackingData.shippingAddress?.fullName || 'Customer'}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">CURRENT STATUS</span>
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-black uppercase tracking-wider ${
                  trackingData.status === 'DELIVERED'
                    ? 'bg-emerald-500 text-black'
                    : trackingData.status === 'CANCELLED'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-black'
                }`}>
                  {trackingData.status?.replace('_', ' ')}
                </span>
                {trackingData.awbCode && (
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    AWB: {trackingData.awbCode}
                  </p>
                )}
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                SHIPMENT TIMELINE
              </h4>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-800 space-y-8">
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key, step.altKey, trackingData.status);

                  return (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          state === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : state === 'current'
                            ? 'bg-white border-white text-black animate-pulse'
                            : 'bg-black border-zinc-700 text-zinc-700'
                        }`}
                      >
                        {state === 'completed' && <CheckCircle2 size={12} />}
                      </div>

                      <div>
                        <h5 className={`text-xs font-bold uppercase tracking-wider ${
                          state === 'completed' || state === 'current' ? 'text-white' : 'text-zinc-600'
                        }`}>
                          {step.label}
                        </h5>
                        <p className={`text-xs mt-0.5 ${
                          state === 'completed' || state === 'current' ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Destination */}
            {trackingData.shippingAddress && (
              <div className="border-t border-zinc-800 pt-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-2">
                  DELIVERY DESTINATION
                </span>
                <p className="text-xs text-zinc-300">
                  {trackingData.shippingAddress.houseFlatNo}, {trackingData.shippingAddress.streetAddress}, {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} - {trackingData.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
