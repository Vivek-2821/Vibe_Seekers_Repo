import React from 'react';
import { ShieldAlert, Ruler, Truck, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-amber-400">
          Official Store Policies
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          RETURN & SHIPPING POLICY
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400">
          Last updated: November 2026 • Effective across all Indian orders
        </p>
      </div>

      {/* Prominent No-Return Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-4 text-amber-200">
        <div className="flex items-center gap-3">
          <ShieldAlert size={28} className="text-amber-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white">
            No Returns & No Exchanges Policy
          </h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
          At <strong className="text-white">VIBE SEEKERS</strong>, all merchandise drops are limited in quantity and produced to order with high-density streetwear standards. Because our stock is strictly curated and heavily sought after, <strong>we currently do not accept returns or size exchanges</strong> once an order has been confirmed and shipped.
        </p>
        <p className="text-xs text-zinc-400">
          Please make sure to consult our comprehensive Size Guide (available on every product page) before proceeding to checkout.
        </p>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 text-zinc-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1: Sizing Advice */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base uppercase">
            <Ruler size={20} className="text-vibe-accent" />
            <h3>1. Accurate Sizing & Measurements</h3>
          </div>
          <p>
            All our t-shirts, hoodies, and jackets are cut in an authentic streetwear oversized aesthetic (dropped shoulders, wide chest, boxy hem). If you are between sizes or uncertain:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>For an oversized streetwear silhouette: select your usual true size.</li>
            <li>For a standard regular fit: order one size smaller than your usual tag size.</li>
            <li>If you have specific measurement questions before ordering, message Vivek on WhatsApp at +91 9860498749 for instant personalized sizing advice.</li>
          </ul>
        </div>

        {/* Section 2: Damaged / Wrong Items Received */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base uppercase">
            <AlertCircle size={20} className="text-vibe-accent" />
            <h3>2. Damaged or Defective Items Guarantee</h3>
          </div>
          <p>
            Every piece is manually inspected by our warehouse quality team before dispatch. In the rare event that you receive a defective garment or incorrect item from our warehouse:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>You must notify us within <strong>48 hours</strong> of package delivery.</li>
            <li>Send a clear unboxing video or photographs of the defect and outer package shipping label to <strong>vibeseekers09@gmail.com</strong> or via WhatsApp to <strong>+91 9860498749</strong>.</li>
            <li>Upon verification, we will provide a replacement or credit voucher at our discretion.</li>
          </ul>
        </div>

        {/* Section 3: Pan-India Shipping Logistics */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base uppercase">
            <Truck size={20} className="text-vibe-accent" />
            <h3>3. Pan-India Shipping & Timelines</h3>
          </div>
          <p>
            All streetwear drops are shipped via our integrated logistics partner Shiprocket, utilizing top-tier couriers including Delhivery, Bluedart, and Smartr.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong>Dispatch Time:</strong> Orders are verified and packaged within 24 to 48 hours of UPI confirmation.</li>
            <li><strong>Transit Time:</strong> Metro cities (3-4 business days), rest of India (4-7 business days).</li>
            <li><strong>Tracking:</strong> You can track your shipment anytime with your Order ID or Shiprocket AWB code on our Track Order page.</li>
          </ul>
        </div>

        {/* Section 4: Prepaid Only Policy */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h3 className="text-white font-bold text-base uppercase">4. Prepaid Orders Only (COD Disabled)</h3>
          <p>
            Cash on Delivery is visibly disabled across our platform. All orders must be prepaid through direct UPI transfer to <strong>9860498749-2@ybl</strong> (Payee: <strong>Vivek Ashok Matne</strong>). Orders without a valid 12-digit UPI UTR ID cannot be dispatched.
          </p>
        </div>

      </div>

      {/* CTA Back to Shop */}
      <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          Have an urgent question before placing an order?
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/919860498749"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Ask on WhatsApp (+91 9860498749)
          </a>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Back to Store</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
};
