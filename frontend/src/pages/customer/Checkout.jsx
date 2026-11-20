import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Check, ShieldAlert, ArrowRight, Upload, QrCode, CreditCard, Ban, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, shippingEstimate, clearCart } = useCart();
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

  const grandTotal = subtotal + shippingEstimate;
  const officialUpiId = '9860498749-2@ybl';
  const payeeName = 'Vivek Ashok Matne';

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
  const upiDeepLink = `upi://pay?pa=${officialUpiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal}&cu=INR&tn=VibeSeekersOrder`;

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
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: 'UPI_MANUAL',
        upiTransactionId: upiUtr.trim(),
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

      setPlacedOrder(res.data.data);
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
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 size={42} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Order Placed Successfully</span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Thank You, {placedOrder.shippingAddress?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-zinc-400">
            Your prepaid streetwear order <strong className="text-white">#{placedOrder.orderNumber}</strong> has been received.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left space-y-4 text-xs">
          <div className="flex justify-between border-b border-zinc-800 pb-3">
            <span className="text-zinc-400">Order Number:</span>
            <span className="font-bold text-white font-mono">{placedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-3">
            <span className="text-zinc-400">Total Paid:</span>
            <span className="font-bold text-white">₹{placedOrder.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-3">
            <span className="text-zinc-400">UPI UTR Ref:</span>
            <span className="font-bold text-vibe-accent font-mono">{placedOrder.upiTransactionId}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-3">
            <span className="text-zinc-400">Payment Status:</span>
            <span className="font-bold text-amber-400 uppercase">Verification Pending by Admin</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Delivering To:</span>
            <span className="text-white font-medium">{placedOrder.shippingAddress?.formattedAddress}</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 text-left space-y-1">
          <p className="font-bold text-white">What happens next?</p>
          <p>• Our team will verify your UPI transaction ID ({placedOrder.upiTransactionId}).</p>
          <p>• Once verified, your items are packed and dispatched via Shiprocket with live tracking.</p>
          <p>• Need urgent updates? Message us directly on WhatsApp at +91 9860498749.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={`/track-order?query=${placedOrder.orderNumber}`}
            className="w-full sm:w-auto px-8 py-3.5 bg-vibe-accent hover:bg-vibe-accentHover text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all"
          >
            Track Order Status
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Secure Prepaid Checkout
        </span>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
          Delivery & Payment Details
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Complete your pan-India delivery address and confirm your UPI transfer to place the order.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Delivery Details Form (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>1. Pan-India Delivery Address</span>
              <span className="text-[11px] text-zinc-400 font-normal">All fields required</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={address.mobileNumber}
                  onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address (Order Confirmation) *
              </label>
              <input
                type="email"
                required
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Flat / House No. *
                </label>
                <input
                  type="text"
                  required
                  value={address.houseFlatNo}
                  onChange={(e) => setAddress({ ...address, houseFlatNo: e.target.value })}
                  placeholder="Flat 402, Block B"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Street Address / Society / Road *
                </label>
                <input
                  type="text"
                  required
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  placeholder="Green Valley Apartments, MG Road"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="Opposite City Mall"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Mumbai / Pune"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Indian Pincode (6 Digits) *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                placeholder="400001"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
            </div>
          </div>

          {/* COD DISABLED BANNER */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 opacity-80 flex items-start gap-4">
            <div className="p-2.5 bg-zinc-800 text-zinc-500 rounded-lg">
              <Ban size={22} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span>Cash on Delivery (COD)</span>
                <span className="text-[10px] bg-zinc-800 text-red-400 px-2 py-0.5 rounded font-bold">
                  Currently Unavailable
                </span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Cash on Delivery is currently unavailable — Prepaid orders only. To prevent fraudulent orders and ensure fast courier dispatch, all drops are strictly prepaid.
              </p>
            </div>
          </div>

          {/* POLICY ACKNOWLEDGMENT CHECKBOX */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="policyCheck"
                checked={acknowledgedPolicy}
                onChange={(e) => setAcknowledgedPolicy(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-700 text-vibe-accent focus:ring-vibe-accent focus:ring-offset-zinc-900 cursor-pointer"
              />
              <label htmlFor="policyCheck" className="text-xs text-amber-200 cursor-pointer select-none leading-relaxed">
                <strong>Mandatory Policy Notice:</strong> Return option is currently not available for this brand. I confirm that I have checked the size guide, selected the proper fit, and agree to the store terms.
              </label>
            </div>
          </div>

        </div>

        {/* Right Side: Online UPI Payment Section & Total (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                2. UPI Payment (Scan & Pay)
              </h2>
              <span className="text-xs font-black text-vibe-accent">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Static PhonePe QR Image Display */}
            <div className="bg-black border border-zinc-800 rounded-xl p-4 text-center space-y-3 shadow-inner">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Scan using PhonePe / GPay / Paytm / any UPI App
              </p>
              
              <div className="flex justify-center py-2">
                <img
                  src="/assets/phonepe-qr.jpg"
                  alt="PhonePe QR Code - Vivek Ashok Matne"
                  className="max-w-[220px] w-full rounded-lg border-2 border-zinc-800 shadow-xl"
                />
              </div>

              <div className="pt-1">
                <p className="text-xs font-semibold text-zinc-300">Verified Payee Name:</p>
                <p className="text-sm font-black text-white">{payeeName}</p>
              </div>
            </div>

            {/* Copyable UPI ID */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">UPI ID:</span>
                <span className="text-xs font-mono font-bold text-zinc-200">{officialUpiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[11px] font-bold uppercase transition-colors"
              >
                {copiedUpi ? (
                  <>
                    <Check size={14} className="text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy UPI ID
                  </>
                )}
              </button>
            </div>

            {/* Mobile UPI Deep-link Button */}
            <a
              href={upiDeepLink}
              className="block sm:hidden w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-center text-xs font-black uppercase tracking-wider text-white rounded-lg border border-zinc-700"
            >
              Open Installed UPI App (PhonePe / GPay)
            </a>

            {/* Required 12-Digit UTR Input */}
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
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-vibe-accent rounded-lg px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none"
              />
              <span className="text-[11px] text-zinc-500 block">
                Found in your banking / UPI app under payment details.
              </span>
            </div>

            {/* Optional Screenshot Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Upload Payment Screenshot (Optional for Faster Approval)
              </label>
              
              <div className="border border-dashed border-zinc-800 rounded-lg p-3 text-center bg-zinc-950/50 hover:border-zinc-700 transition-colors">
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
                  <Upload size={18} className="text-vibe-accent" />
                  <span className="text-xs font-bold">
                    {screenshotFile ? screenshotFile.name : 'Tap to select screenshot (Max 5MB)'}
                  </span>
                </label>
              </div>

              {screenshotPreview && (
                <div className="relative mt-2 w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                  <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-vibe-accent/25 hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying & Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Prepaid Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 text-center">
              Your payment will be manually verified by our team. Orders are packed immediately upon approval.
            </p>

          </div>

        </div>

      </form>

    </div>
  );
};
