import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  X,
  Clock,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Orders = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Full Detail & Verification Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Rejection modal
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await axiosInstance.get('/api/admin/orders', { params });
      setOrders(res.data.data.content || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    setActionMessage('');
    setIsRejecting(false);
  };

  const handleVerifyPayment = async (orderId, approved) => {
    setActionLoading(true);
    setActionMessage('');
    try {
      const payload = {
        approved,
        rejectionReason: approved ? null : rejectionReason || 'Invalid UPI Transaction Reference ID',
      };
      const res = await axiosInstance.post(`/api/admin/orders/${orderId}/verify-payment`, payload);
      const updated = res.data.data;
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setActionMessage(approved ? 'Payment approved successfully!' : 'Payment rejected.');
      setIsRejecting(false);
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispatchShiprocket = async (orderId) => {
    setActionLoading(true);
    setActionMessage('');
    try {
      const res = await axiosInstance.post(`/api/admin/orders/${orderId}/dispatch-shiprocket`);
      const updated = res.data.data;
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setActionMessage(`Pushed to Shiprocket! Generated AWB: ${updated.shiprocketAwb}`);
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to dispatch via Shiprocket.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await axiosInstance.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      const updated = res.data.data;
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(query) ||
      o.customerName?.toLowerCase().includes(query) ||
      o.customerEmail?.toLowerCase().includes(query) ||
      o.upiTransactionId?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Fulfillment & Payments
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
            Customer Orders & UPI Verifications
          </h1>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Email, or UPI UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-vibe-accent"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { label: 'All', value: '' },
            { label: 'Pending Payment', value: 'PENDING_PAYMENT' },
            { label: 'Payment Verified', value: 'PAYMENT_VERIFIED' },
            { label: 'Processing', value: 'PROCESSING' },
            { label: 'Shipped', value: 'SHIPPED' },
            { label: 'Delivered', value: 'DELIVERED' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => setFilterStatus(st.value)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap transition-all ${
                filterStatus === st.value
                  ? 'bg-vibe-accent text-white border-vibe-accent'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] font-bold border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">UPI UTR Ref</th>
                <th className="py-4 px-4">Payment Status</th>
                <th className="py-4 px-4">Order Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white text-sm">
                      #{o.orderNumber}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-white">{o.customerName || 'Customer'}</p>
                      <p className="text-[11px] text-zinc-500">{o.shippingAddress?.city}, {o.shippingAddress?.pincode}</p>
                    </td>

                    <td className="py-4 px-4 font-black text-white text-sm">
                      ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4">
                      {o.upiTransactionId ? (
                        <span className="font-mono text-vibe-accent font-bold bg-vibe-accent/10 px-2 py-0.5 rounded">
                          {o.upiTransactionId}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-mono italic">Not provided</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          o.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : o.paymentStatus === 'FAILED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {o.paymentStatus?.replace('_', ' ') || 'PENDING'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-zinc-300 uppercase">
                        {o.orderStatus?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openOrderDetail(o)}
                        className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                      >
                        Review Order
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & VERIFICATION MODAL */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
                Order Management
              </span>
              <h2 className="text-2xl font-black uppercase text-white font-mono mt-0.5">
                #{selectedOrder.orderNumber}
              </h2>
              <p className="text-xs text-zinc-400">
                Created: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
              </p>
            </div>

            {actionMessage && (
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 text-xs font-bold">
                {actionMessage}
              </div>
            )}

            {/* Customer & Shipping Address */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
              <span className="font-black uppercase tracking-wider text-white block">
                Shipping & Contact Information
              </span>
              <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
              <p><strong>Mobile:</strong> {selectedOrder.shippingAddress?.mobileNumber}</p>
              <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress?.formattedAddress}</p>
            </div>

            {/* UPI Payment Verification Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  UPI Payment Details
                </span>
                <span className="text-sm font-black text-white">
                  ₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Payment Method:</span>
                  <span className="font-bold text-white">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Customer 12-Digit UTR:</span>
                  <span className="font-mono font-bold text-vibe-accent text-sm">
                    {selectedOrder.upiTransactionId || 'Not submitted'}
                  </span>
                </div>
              </div>

              {/* Uploaded Payment Screenshot */}
              {selectedOrder.paymentScreenshotUrl && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs text-zinc-400 block font-bold">Customer Payment Screenshot:</span>
                  <a
                    href={selectedOrder.paymentScreenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block relative rounded-lg overflow-hidden border border-zinc-700 max-h-48"
                  >
                    <img
                      src={selectedOrder.paymentScreenshotUrl}
                      alt="Proof"
                      className="max-h-48 object-contain bg-black rounded"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded">
                      Click to open full
                    </span>
                  </a>
                </div>
              )}

              {/* 1-Click Payment Approval / Rejection Controls */}
              {selectedOrder.paymentStatus !== 'PAID' ? (
                <div className="pt-2 border-t border-zinc-800 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 block">Verify Customer Transfer:</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleVerifyPayment(selectedOrder.id, true)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 size={16} /> 1-Click Approve Payment
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setIsRejecting(!isRejecting)}
                      className="py-2.5 px-4 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      Reject
                    </button>
                  </div>

                  {isRejecting && (
                    <div className="p-3 bg-zinc-900 border border-red-500/30 rounded-lg space-y-2 animate-fadeIn">
                      <label className="text-[11px] font-bold text-zinc-400 block">Rejection Reason:</label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. UTR not matching our bank statement"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white"
                      />
                      <button
                        onClick={() => handleVerifyPayment(selectedOrder.id, false)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase rounded"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Verified & Approved by Admin ({selectedOrder.paymentVerifiedAt?.slice(0, 10)})</span>
                </div>
              )}
            </div>

            {/* Shiprocket Dispatch Section */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Truck size={16} className="text-vibe-accent" /> Shiprocket Logistics Integration
                </span>
                {selectedOrder.shiprocketAwb && (
                  <span className="font-mono text-emerald-400 font-bold text-xs">
                    AWB: {selectedOrder.shiprocketAwb}
                  </span>
                )}
              </div>

              {selectedOrder.shiprocketAwb ? (
                <div className="text-xs space-y-2">
                  <p><strong>Courier Partner:</strong> {selectedOrder.courierName || 'Delhivery Express'}</p>
                  <p><strong>Shipment ID:</strong> {selectedOrder.shiprocketShipmentId}</p>
                  {selectedOrder.trackingUrl && (
                    <a
                      href={selectedOrder.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-vibe-accent hover:underline inline-block font-bold mt-1"
                    >
                      Track on Shiprocket Website ↗
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    Push order details (weight, dimensions, pickup & customer delivery address) to generate AWB label automatically.
                  </p>
                  <button
                    onClick={() => handleDispatchShiprocket(selectedOrder.id)}
                    disabled={actionLoading || selectedOrder.paymentStatus !== 'PAID'}
                    className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Truck size={16} /> Dispatch Order via Shiprocket API
                  </button>
                  {selectedOrder.paymentStatus !== 'PAID' && (
                    <p className="text-[11px] text-amber-400 text-center">
                      * Payment must be verified before pushing to Shiprocket.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Ordered Items Summary */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-white block">
                Streetwear Items ({selectedOrder.items?.length})
              </span>
              <div className="divide-y divide-zinc-800 border-y border-zinc-800">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.productName} className="w-10 h-12 object-cover rounded bg-zinc-950" />
                      )}
                      <div>
                        <p className="font-bold text-white">{item.productName}</p>
                        <p className="text-zinc-500">Size: {item.size} {item.color ? `• Color: ${item.color}` : ''} • Qty: {item.quantity}</p>
                        {(item.customizationPlacement || item.customText || item.customDesignUrl) && (
                          <div className="mt-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded text-[11px] space-y-0.5">
                            <span className="text-vibe-accent font-bold uppercase text-[9px] tracking-wider block">
                              Custom Personalization:
                            </span>
                            {item.customizationPlacement && (
                              <p className="text-zinc-300">
                                Placement: <strong className="text-white">{item.customizationPlacement}</strong>
                              </p>
                            )}
                            {item.customText && (
                              <p className="text-zinc-300">
                                Text: <strong className="text-white font-mono">"{item.customText}"</strong>
                              </p>
                            )}
                            {item.customDesignUrl && (
                              <p className="pt-0.5">
                                <a
                                  href={item.customDesignUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-vibe-accent hover:underline font-bold inline-flex items-center gap-1"
                                >
                                  View Custom Artwork ↗
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-white">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Status Override */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-400">Override Order Status:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-vibe-accent"
              >
                <option value="ORDER_PLACED">ORDER PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                <option value="PAYMENT_VERIFIED">PAYMENT VERIFIED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
