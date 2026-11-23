import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Check, ShieldAlert, ArrowRight, Upload, QrCode, CreditCard, Ban, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { resolveImageUrl } from '../../utils/imageUrl';

export const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, discountAmount, finalTotal, shippingEstimate, appliedCoupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Delivery details form state
  const [address, setAddress] = useState({
    fullName: user?.fullName || '',
    mobileNumber: user?.phone || '',
    email: user?.email || '',
    houseFlatNo: '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Payment state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiUtr, setUpiUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [acknowledgedPolicy, setAcknowledgedPolicy] = useState(false);

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const officialUpiId = '9860498749-2@ybl';
  const payeeName = 'Vivek Ashok Matne';
  const payableAmount = finalTotal > 0 ? finalTotal : Math.max(0, subtotal - discountAmount + shippingEstimate);

  // Prefill default address if saved in profile
  useEffect(() => {
    if (user?.defaultAddress) {
      setAddress((prev) => ({
        ...prev,
        ...user.defaultAddress,
        fullName: prev.fullName || user.defaultAddress.fullName,
        mobileNumber: prev.mobileNumber || user.defaultAddress.mobileNumber,
        email: prev.email || user.defaultAddress.email,
      }));
    }
  }, [user]);

  // Deep-link for mobile UPI apps (PhonePe, GPay, Paytm)
  const upiDeepLink = `upi://pay?pa=${officialUpiId}&pn=${encodeURIComponent(payeeName)}&am=${payableAmount}&cu=INR&tn=VibeSeekersOrder`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(officialUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot exceeds 5MB size limit.');
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!address.fullName || !address.mobileNumber || !address.email || !address.houseFlatNo || !address.streetAddress || !address.city || !address.state || !address.pincode) {
      setErrorMessage('Please fill in all complete delivery details.');
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setErrorMessage('Please enter a valid 6-digit Indian Pincode.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(address.mobileNumber.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid 10-digit Indian Mobile Number.');
      return;
    }

    if (!upiUtr.trim()) {
      setErrorMessage('Please enter your 12-digit UPI UTR / Transaction ID after scanning the QR code.');
      return;
    }

    if (!acknowledgedPolicy) {
      setErrorMessage('Please acknowledge the No Returns Policy before placing your order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanAddress = {
        fullName: address.fullName?.trim() || '',
        mobileNumber: address.mobileNumber?.trim() || '',
        email: address.email?.trim() || '',
        houseFlatNo: address.houseFlatNo?.trim() || '',
        streetAddress: address.streetAddress?.trim() || '',
        landmark: address.landmark?.trim() || '',
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        pincode: address.pincode?.trim() || '',
      };

      const orderPayload = {
        items: items.map((item) => ({
          productId: Number(item.productId),
          size: String(item.size).toUpperCase(),
          color: item.color ? String(item.color).trim() : '',
          quantity: Number(item.quantity) || 1,
          customizationPlacement: item.customizationPlacement || null,
          customText: item.customText || null,
          customDesignUrl: item.customDesignUrl || null,
        })),
        shippingAddress: cleanAddress,
        paymentMethod: 'UPI_MANUAL',
        upiTransactionId: upiUtr.trim(),
        couponCode: appliedCoupon?.code ? appliedCoupon.code.trim().toUpperCase() : null,
        discountAmount: discountAmount && Number(discountAmount) > 0 ? Number(discountAmount) : 0,
        customerNotes: 'Prepaid streetwear order',
      };

      const formData = new FormData();
      formData.append('orderData', JSON.stringify(orderPayload));
      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      const res = await axiosInstance.post('/api/customer/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPlacedOrder(res.data?.data || res.data);
      clearCart();
    } catch (err) {
      console.error('Order creation failed', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to place order. Please review your details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    return (
      <div className="bg-[#080808] min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-[#121212] border border-zinc-800 p-8 sm:p-12 shadow-2xl">
          <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Order Placed Successfully</span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Thank You, {placedOrder.shippingAddress?.fullName?.split(' ')[0] || 'Seeker'}!
            </h1>
            <p className="text-xs text-zinc-400 font-mono tracking-wider">
              ORDER REFERENCE: #{placedOrder.orderNumber || placedOrder.id}
            </p>
          </div>

          <div className="bg-black border border-zinc-800 p-4 text-left text-xs space-y-2 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Order Status:</span>
              <span className="font-bold text-amber-400 uppercase tracking-wider">{placedOrder.status || 'ORDER_PLACED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Paid:</span>
              <span className="font-bold text-white">₹{Number(placedOrder.finalAmount || payableAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">UPI Ref / UTR:</span>
              <span className="font-mono text-zinc-300">{placedOrder.upiTransactionId || upiUtr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Shipping To:</span>
              <span className="text-right truncate max-w-[200px]">{placedOrder.shippingAddress?.city}, {placedOrder.shippingAddress?.state}</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Your payment reference has been submitted. Our team will verify the 12-digit UTR against our bank records and dispatch your garments via express courier.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/track-order"
              className="flex-1 py-3.5 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Track Order Status
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            PREPAID EXPRESS CHECKOUT
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            DELIVERY & PAYMENT DETAILS
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
            All orders are dispatched across India with free express courier shipping.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            <div className="bg-[#121212] border border-zinc-800 p-6 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>1. Pan-India Delivery Address</span>
                <span className="text-[10px] text-zinc-500 font-normal">All fields required</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="e.g. Vivek Matne"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={address.mobileNumber}
                    onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
                    placeholder="9860498749"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Flat / House / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.houseFlatNo}
                    onChange={(e) => setAddress({ ...address, houseFlatNo: e.target.value })}
                    placeholder="Flat 402, Streetwear Tower"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="Near Metro Station"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Street Address / Area *
                </label>
                <input
                  type="text"
                  required
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  placeholder="Main Road, Fashion Colony"
                  className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Mumbai / Pune"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Pincode (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="400001"
                    className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* COD Unavailable notice */}
            <div className="bg-[#121212] border border-zinc-800 p-5 flex items-start gap-4">
              <div className="p-2 bg-zinc-900 text-zinc-500">
                <Ban size={20} />
              </div>
              <div className="text-xs">
                <h3 className="font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <span>Cash on Delivery (COD)</span>
                  <span className="text-[10px] bg-zinc-800 text-amber-400 px-2 py-0.5 font-bold">
                    Currently Unavailable
                  </span>
                </h3>
                <p className="text-zinc-500 mt-1 leading-relaxed">
                  To ensure genuine streetwear orders and immediate express courier dispatch without fake bookings, all orders are strictly prepaid.
                </p>
              </div>
            </div>

            {/* No returns mandatory checkbox */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="policyCheck"
                  checked={acknowledgedPolicy}
                  onChange={(e) => setAcknowledgedPolicy(e.target.checked)}
                  className="mt-1 h-4 w-4 bg-black border-zinc-700 text-white focus:ring-0 cursor-pointer"
                />
                <label htmlFor="policyCheck" className="text-xs text-zinc-300 cursor-pointer select-none leading-relaxed">
                  <strong className="text-white uppercase">Mandatory Terms & Policy: </strong>
                  I acknowledge that returns are not applicable for this streetwear brand. I have verified my size using the size guide and confirm this prepaid purchase.
                </label>
              </div>
            </div>

          </div>

          {/* Right: Payment Suite & UPI QR (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-[#121212] border border-zinc-800 p-6 space-y-6">

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                  2. UPI PREPAID PAYMENT
                </h2>
                <span className="text-sm font-black text-white">
                  ₹{payableAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* PhonePe QR Image Container */}
              <div className="bg-black border border-zinc-800 p-4 text-center space-y-3">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Scan via PhonePe / Google Pay / Paytm / Any UPI App
                </p>

                <div className="flex justify-center py-2">
                  <img
                    src="/assets/phonepe-qr.jpg"
                    alt="PhonePe QR Code - Vivek Ashok Matne"
                    className="max-w-[210px] w-full border border-zinc-800 shadow-xl"
                  />
                </div>

                <div className="pt-1 text-xs">
                  <p className="text-zinc-500">Verified Payee Name:</p>
                  <p className="font-bold text-white uppercase tracking-wider">{payeeName}</p>
                </div>
              </div>

              {/* Copyable UPI ID */}
              <div className="bg-black border border-zinc-800 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">UPI ID:</span>
                  <span className="text-xs font-mono font-bold text-white">{officialUpiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  {copiedUpi ? (
                    <>
                      <Check size={12} className="text-emerald-400" /> COPIED
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> COPY UPI
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Deep Link */}
              <a
                href={upiDeepLink}
                className="block sm:hidden w-full py-3 bg-white text-black text-center text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Open UPI App To Pay ₹{payableAmount.toLocaleString('en-IN')}
              </a>

              {/* 12-Digit UTR Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white">
                  Enter 12-Digit UPI UTR / Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  maxLength={24}
                  value={upiUtr}
                  onChange={(e) => setUpiUtr(e.target.value)}
                  placeholder="e.g. 432509123456 or 12-digit ref #"
                  className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-white"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Find this in your PhonePe / GPay payment receipt under "UPI Transaction ID".
                </span>
              </div>

              {/* Optional Screenshot */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Payment Screenshot (Optional for Instant Verification)
                </label>

                <div className="border border-dashed border-zinc-800 p-3 text-center bg-black hover:border-zinc-700 transition-colors">
                  <input
                    type="file"
                    id="screenshotUpload"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="screenshotUpload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-white"
                  >
                    <Upload size={16} />
                    <span className="text-xs font-medium">
                      {screenshotFile ? screenshotFile.name : 'Click to upload payment screenshot'}
                    </span>
                  </label>
                </div>

                {screenshotPreview && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-black border border-zinc-800">
                    <img
                      src={screenshotPreview}
                      alt="Payment Preview"
                      className="w-12 h-12 object-cover"
                    />
                    <span className="text-xs text-emerald-400 font-bold uppercase">Screenshot Attached</span>
                  </div>
                )}
              </div>

              {/* Order Items Breakdown */}
              {items && items.length > 0 && (
                <div className="border-t border-zinc-800 pt-3 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Order Items ({items.reduce((acc, it) => acc + (it.quantity || 1), 0)}):
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3 bg-black/60 p-2 border border-zinc-900">
                        <img
                          src={resolveImageUrl(item.imageUrl, '/assets/logo.png')}
                          alt={item.name}
                          className="w-10 h-12 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-zinc-400">
                            Size: {item.size} {item.color ? `• ${item.color}` : ''} • Qty: {item.quantity}
                          </p>
                          {(item.customizationPlacement || item.customText) && (
                            <p className="text-[10px] text-vibe-accent font-medium">
                              Custom: {item.customizationPlacement || 'Print'} {item.customText ? `("${item.customText}")` : ''}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-zinc-300">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary totals */}
              <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shippingEstimate > 0 ? (
                    <span className="font-bold text-white">₹{shippingEstimate.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-emerald-400 uppercase font-bold">FREE (₹0)</span>
                  )}
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-extrabold text-white">
                  <span>FINAL PAYABLE AMOUNT</span>
                  <span>₹{payableAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !acknowledgedPolicy}
                className="w-full py-4 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl"
              >
                {isSubmitting ? (
                  <span>VERIFYING & PLACING ORDER...</span>
                ) : (
                  <>
                    <span>CONFIRM & SUBMIT ORDER</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
