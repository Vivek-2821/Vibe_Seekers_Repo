import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, Search, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Shiprocket = () => {
  const [testPincode, setTestPincode] = useState('400001');
  const [serviceResult, setServiceResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [trackAwb, setTrackAwb] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleTestServiceability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServiceResult(null);
    try {
      const res = await axiosInstance.get(`/api/public/pincode/check?pincode=${testPincode}`);
      setServiceResult(res.data.data);
    } catch (err) {
      alert('Failed to check serviceability');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackAwb = async (e) => {
    e.preventDefault();
    if (!trackAwb.trim()) return;
    setTrackingLoading(true);
    setTrackingResult(null);
    try {
      const res = await axiosInstance.get(`/api/tracking/${trackAwb.trim()}`);
      setTrackingResult(res.data.data);
    } catch (err) {
      alert('AWB not found or network error');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Logistics Integration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
          Shiprocket Courier Hub & Tracking
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Connected API User: <strong>vivekmatne@gmail.com</strong> • Automated AWB Generation & Real-time Webhooks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Pincode Courier Serviceability Tester */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
            <div className="p-2.5 bg-zinc-950 text-vibe-accent rounded-lg">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Test Courier Serviceability
              </h3>
              <p className="text-[11px] text-zinc-500">Query Shiprocket API for delivery estimates</p>
            </div>
          </div>

          <form onSubmit={handleTestServiceability} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Enter Destination Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testPincode}
                  onChange={(e) => setTestPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 560001"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap"
                >
                  {loading ? 'Checking...' : 'Test PIN'}
                </button>
              </div>
            </div>
          </form>

          {serviceResult && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 size={16} />
                <span>Serviceable Destination Hub</span>
              </div>
              <p><strong>Pincode:</strong> {testPincode}</p>
              <p><strong>Courier Partner:</strong> {serviceResult.courier_name || 'Delhivery / Bluedart Express'}</p>
              <p><strong>Delivery SLA:</strong> {serviceResult.estimated_days || '3-5 Business Days'}</p>
              <p><strong>Prepaid Courier Available:</strong> Yes</p>
              <p><strong>COD Courier Available:</strong> {serviceResult.cod_available ? 'Yes' : 'Disabled (Store Policy)'}</p>
            </div>
          )}
        </div>

        {/* Live AWB Tracking Lookup */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
            <div className="p-2.5 bg-zinc-950 text-vibe-accent rounded-lg">
              <Truck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Live AWB Tracking Lookup
              </h3>
              <p className="text-[11px] text-zinc-500">Query live package status via Shiprocket</p>
            </div>
          </div>

          <form onSubmit={handleTrackAwb} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Enter AWB / Order Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackAwb}
                  onChange={(e) => setTrackAwb(e.target.value)}
                  placeholder="e.g. VS10009823423 or VS-XXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent font-mono uppercase"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap"
                >
                  {trackingLoading ? 'Tracking...' : 'Query'}
                </button>
              </div>
            </div>
          </form>

          {trackingResult && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs space-y-2 animate-fadeIn">
              <p><strong>Order:</strong> #{trackingResult.order?.orderNumber}</p>
              <p><strong>Status:</strong> <span className="text-vibe-accent font-bold uppercase">{trackingResult.order?.orderStatus}</span></p>
              <p><strong>AWB:</strong> <span className="font-mono text-white">{trackingResult.order?.shiprocketAwb || 'Pending dispatch'}</span></p>
              <p><strong>Courier:</strong> {trackingResult.order?.courierName || 'Delhivery Express'}</p>
            </div>
          )}
        </div>

      </div>

      {/* Warehouse Logistics Guidelines */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 text-xs leading-relaxed text-zinc-400">
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Fulfillment & Dispatch Workflow
        </h3>
        <ol className="list-decimal pl-5 space-y-1.5 text-zinc-300">
          <li>Customer places prepaid order and submits 12-digit UPI UTR ID from PhonePe/GPay.</li>
          <li>Owner (Vivek) reviews payment screenshot / bank statement in <strong>Orders & Payments</strong>.</li>
          <li>Click <strong>1-Click Approve Payment</strong> to set order status to <code>PAYMENT_VERIFIED</code>.</li>
          <li>Click <strong>Dispatch Order via Shiprocket API</strong> to auto-generate the Delhivery/Bluedart AWB number.</li>
          <li>Pack the streetwear garment in branded Vibe Seekers poly-mailer bag, affix the generated AWB shipping label, and hand it to the pickup courier.</li>
        </ol>
      </div>

    </div>
  );
};
