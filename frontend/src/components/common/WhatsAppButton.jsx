import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Streetwear Tooltip */}
      {showTooltip && (
        <div className="bg-zinc-900 border border-zinc-700 text-white text-xs py-2 px-3.5 rounded-lg shadow-2xl tracking-wide font-medium flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Need help? Chat with Vibe Seekers on WhatsApp</span>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href="https://wa.me/919860498749?text=Hi%20Vibe%20Seekers!%20I%20have%20a%20question%20about%20your%20streetwear%20collection."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Direct WhatsApp Support"
      >
        <MessageCircle size={30} className="fill-current text-white" />
      </a>
    </div>
  );
};
