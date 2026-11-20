import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is the Return & Exchange Policy at VIBE SEEKERS?',
      a: 'We currently DO NOT offer returns or exchanges on any orders. Because our drops are manufactured in exclusive limited batches, each piece is inspected thoroughly for quality and fabric integrity prior to packaging. We strongly recommend checking our Size Guide before placing an order.',
    },
    {
      q: 'Why is Cash on Delivery (COD) disabled?',
      a: 'All orders on VIBE SEEKERS are strictly prepaid via UPI (PhonePe, Google Pay, Paytm, or BHIM). Cash on Delivery is disabled across our store to eliminate courier transit cancellations and allow us to offer free pan-India express shipping.',
    },
    {
      q: 'How does the UPI Payment & Verification work at Checkout?',
      a: 'During checkout, you will see our official PhonePe QR Code and UPI ID (9860498749-2@ybl) under the name "Vivek Ashok Matne". Scan and complete the transfer in your UPI app, then copy your 12-digit UPI UTR / Transaction ID and paste it into the checkout form. You can also upload a payment screenshot for instant approval.',
    },
    {
      q: 'How do VIBE SEEKERS Streetwear pieces fit?',
      a: 'Our T-Shirts, Hoodies, and Jackets are tailored with an authentic boxy, drop-shoulder streetwear fit. If you prefer the signature streetwear oversized look, select your usual size. If you prefer a closer, regular fit, size down by one.',
    },
    {
      q: 'How long does shipping take across India?',
      a: 'We partner with Shiprocket and tier-1 couriers (Delhivery, Bluedart, Smartr). Metro cities generally receive delivery within 3-4 business days. Other cities and towns across India receive shipments within 4-7 business days.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your payment is approved and your drop is packed, an automated tracking update is posted. You can track your shipment anytime on our Track Order page using your Vibe Seekers Order ID (e.g. VS-XXXX) or your Shiprocket AWB tracking code.',
    },
    {
      q: 'How do I care for my 240+ GSM heavyweight streetwear?',
      a: 'Machine wash cold on gentle cycle inside out. Do not bleach. Air dry in the shade to maintain the deep charcoal or pigment-washed tones. Avoid ironing directly on graphic prints.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Help Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400">
          Everything you need to know about our drops, sizing, pan-India courier logistics, and prepaid UPI checkout.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-vibe-accent transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-zinc-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-vibe-accent' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Assistance Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <HelpCircle size={32} className="mx-auto text-vibe-accent" />
        <h3 className="text-base font-black uppercase text-white">Still have questions?</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Our team is available directly on WhatsApp for sizing recommendations and order support.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="https://wa.me/919860498749"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors"
          >
            Chat on WhatsApp (+91 9860498749)
          </a>
        </div>
      </div>

    </div>
  );
};
