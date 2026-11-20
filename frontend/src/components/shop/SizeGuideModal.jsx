import React from 'react';
import { X, Ruler, AlertCircle } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose, category = 'TSHIRTS' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-zinc-800 text-vibe-accent rounded-lg">
            <Ruler size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              VIBE SEEKERS Fit & Size Guide
            </h3>
            <p className="text-xs text-zinc-400">Streetwear Relaxed & Boxy Silhouette</p>
          </div>
        </div>

        {/* Important Policy Warning */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3.5 mb-6 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> We currently do not offer return or exchange options. Please review your measurements below before placing an order.
          </span>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-lg mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] font-bold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest (Inches)</th>
                <th className="py-3 px-4">Length (Inches)</th>
                <th className="py-3 px-4">Shoulder (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-4 font-bold text-white">S</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">28"</td>
                <td className="py-3 px-4">21"</td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-4 font-bold text-white">M</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">29"</td>
                <td className="py-3 px-4">22"</td>
              </tr>
              <tr className="hover:bg-zinc-800/40 bg-vibe-accent/5">
                <td className="py-3 px-4 font-bold text-vibe-accent">L (Popular)</td>
                <td className="py-3 px-4 font-semibold text-white">46"</td>
                <td className="py-3 px-4 font-semibold text-white">30"</td>
                <td className="py-3 px-4 font-semibold text-white">23"</td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-4 font-bold text-white">XL</td>
                <td className="py-3 px-4">48"</td>
                <td className="py-3 px-4">31"</td>
                <td className="py-3 px-4">24"</td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-4 font-bold text-white">XXL</td>
                <td className="py-3 px-4">50"</td>
                <td className="py-3 px-4">32"</td>
                <td className="py-3 px-4">25"</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fit Tips */}
        <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
          <p className="font-bold text-zinc-200 uppercase tracking-wide">Streetwear Fit Recommendation:</p>
          <p>• Our silhouettes feature an authentic boxy, drop-shoulder streetwear fit.</p>
          <p>• Choose your standard size for the intended streetwear oversized look.</p>
          <p>• For a closer regular fit, choose one size smaller than your regular tag size.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Got It, Continue Shopping
        </button>
      </div>
    </div>
  );
};
