import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, Instagram, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axiosInstance.post('/api/public/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit message. Please try WhatsApp support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Customer Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          CONNECT WITH VIBE SEEKERS
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400">
          Got questions about drop releases, sizing, or shipment tracking? Reach Vivek and the team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Direct Channels (Col 1-5) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Instant Support Channels
          </h2>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/919860498749?text=Hi%20Vivek!%20I%20need%20assistance%20with%20Vibe%20Seekers."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-xl transition-all group"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white rounded-lg transition-colors">
              <MessageCircle size={26} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Fastest Response</p>
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                WhatsApp Support
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">+91 9860498749</p>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 rounded-xl transition-all group"
          >
            <div className="p-3 bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-white rounded-lg transition-colors">
              <Instagram size={26} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Follow The Drops</p>
              <h3 className="text-base font-black text-white group-hover:text-pink-400 transition-colors">
                @vibe_seekers_09
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Behind-the-scenes & drops on Instagram</p>
            </div>
          </a>

          {/* Email Card */}
          <a
            href="mailto:vibeseekers09@gmail.com"
            className="flex items-center gap-4 p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-vibe-accent/50 rounded-xl transition-all group"
          >
            <div className="p-3 bg-vibe-accent/10 text-vibe-accent group-hover:bg-vibe-accent group-hover:text-white rounded-lg transition-colors">
              <Mail size={26} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Official Store Email</p>
              <h3 className="text-base font-black text-white group-hover:text-vibe-accent transition-colors truncate">
                vibeseekers09@gmail.com
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Replies within 24 business hours</p>
            </div>
          </a>

          {/* Owner Details */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs space-y-1.5 text-zinc-400">
            <p className="font-bold text-white uppercase tracking-wider">Business & Logistics Headquarters:</p>
            <p>VIBE SEEKERS Apparel (Owner: Vivek Ashok Matne)</p>
            <p>Maharashtra, India</p>
            <p className="text-zinc-500 pt-1">Pan-India Express Shipping powered by Shiprocket.</p>
          </div>
        </div>

        {/* Contact Form (Col 6-12) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Send Us A Message
          </h2>

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
              <span>Thank you! Your inquiry has been logged. Vivek / our support team will get in touch soon.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aryan Deshmukh"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aryan@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Sizing inquiry / Order #VS-XXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Message *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-vibe-accent/20"
            >
              {submitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
