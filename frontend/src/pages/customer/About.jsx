import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, Sparkles, MapPin, Award, ArrowRight, Mail, Phone, Instagram } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      
      {/* 1. Editorial Hero */}
      <section className="relative py-20 sm:py-28 border-b border-zinc-800 bg-[#0d0d0d] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            OUR MANIFESTO & ORIGINS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight">
            AUTHENTIC STREETWEAR. <br />
            NO SHORTCUTS.
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed uppercase tracking-wider font-normal">
            VIBE SEEKERS is an independent Indian streetwear clothing brand founded for those who express their unapologetic identity through high-end fashion.
          </p>
        </div>
      </section>

      {/* 2. Our Story & Founder Narrative */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 aspect-[4/5] bg-zinc-950 border border-zinc-800 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80"
              alt="Vibe Seekers Streetwear Philosophy"
              className="w-full h-full object-cover filter contrast-[1.08]"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
              OUR STORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              REDEFINING OVERSIZED FASHION FOR INDIA.
            </h2>
            <p>
              For years, the Indian clothing market was saturated with cheap polyester blends marketed falsely as "streetwear." Fast fashion giants compromised on fabric weight, collar elasticity, and durable dyes just to push disposable garments.
            </p>
            <p>
              Under the founder and creative direction of <strong className="text-white">Vivek Ashok Matne</strong>, <strong className="text-white">VIBE SEEKERS</strong> was founded in Maharashtra, India with a clear mission: build uncompromising, heavyweight streetwear built on authentic culture, drop-shoulder silhouettes, and premium longevity.
            </p>
            <p>
              From custom 240+ GSM combed cotton knits to mineral acid-washes that give each piece a distinct, aged character, our garments are crafted for individuals who treat their everyday style as an expression of personal identity.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Brand Philosophy & Our Vision */}
      <section className="bg-[#0e0e0e] border-y border-zinc-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
              PHILOSOPHY & VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              WHAT SETS US APART
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141414] border border-zinc-800 p-8 space-y-3">
              <span className="text-2xl font-black text-white font-mono">01.</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">HEAVYWEIGHT DENSITY</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We never use flimsy under-200 GSM fabrics. Every tee is at least 240 GSM luxury cotton, and our fleece hoodies are 400 GSM for true streetwear structure.
              </p>
            </div>

            <div className="bg-[#141414] border border-zinc-800 p-8 space-y-3">
              <span className="text-2xl font-black text-white font-mono">02.</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">BOXY UNISEX SILHOUETTE</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engineered drop shoulders, widened chest dimensions, and ribbed necklines that do not sag or lose shape after intensive wear and washing.
              </p>
            </div>

            <div className="bg-[#141414] border border-zinc-800 p-8 space-y-3">
              <span className="text-2xl font-black text-white font-mono">03.</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">DIRECT CULTURE ACCESS</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prepaid transparency with instant UPI verification and direct courier dispatch across every pin code in India. No fake middlemen.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Our Collections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-10">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            DISCOVER THE VAULT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            OUR CORE COLLECTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <Link to="/shop?category=T-Shirts" className="group block bg-[#121212] border border-zinc-800 p-6 hover:border-white transition-colors">
            <span className="text-xs font-bold uppercase text-zinc-500">CATEGORY 01</span>
            <h4 className="text-base font-black uppercase text-white mt-1">OVERSIZED TEES</h4>
            <p className="text-xs text-zinc-400 mt-2">240 GSM combed cotton, acid wash tones, boxy drop shoulders.</p>
            <span className="text-xs font-bold uppercase text-white mt-4 inline-flex items-center gap-1 group-hover:underline">
              <span>EXPLORE</span> <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?category=Hoodies" className="group block bg-[#121212] border border-zinc-800 p-6 hover:border-white transition-colors">
            <span className="text-xs font-bold uppercase text-zinc-500">CATEGORY 02</span>
            <h4 className="text-base font-black uppercase text-white mt-1">FLEECE HOODIES</h4>
            <p className="text-xs text-zinc-400 mt-2">400 GSM heavyweight brushed interior, double-layered hood.</p>
            <span className="text-xs font-bold uppercase text-white mt-4 inline-flex items-center gap-1 group-hover:underline">
              <span>EXPLORE</span> <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?category=Jackets" className="group block bg-[#121212] border border-zinc-800 p-6 hover:border-white transition-colors">
            <span className="text-xs font-bold uppercase text-zinc-500">CATEGORY 03</span>
            <h4 className="text-base font-black uppercase text-white mt-1">STATEMENT JACKETS</h4>
            <p className="text-xs text-zinc-400 mt-2">Cargo details, utility hardware, and corduroy textures.</p>
            <span className="text-xs font-bold uppercase text-white mt-4 inline-flex items-center gap-1 group-hover:underline">
              <span>EXPLORE</span> <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </section>

      {/* 5. Contact Information & Founder Sign-off */}
      <section className="border-t border-zinc-800 bg-[#0d0d0d] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            CONNECT WITH VIBE SEEKERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            WE TALK DIRECTLY TO THE COMMUNITY.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs">
            <div className="p-4 bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block uppercase font-bold">Email Inquiries</span>
              <a href="mailto:vibeseekers09@gmail.com" className="font-bold text-white hover:underline">
                vibeseekers09@gmail.com
              </a>
            </div>
            <div className="p-4 bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block uppercase font-bold">WhatsApp Hotline</span>
              <a href="https://wa.me/919860498749" className="font-bold text-white hover:underline">
                +91 9860498749
              </a>
            </div>
            <div className="p-4 bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block uppercase font-bold">Instagram Handle</span>
              <a href="https://www.instagram.com/vibe_seekers_09" className="font-bold text-white hover:underline">
                @vibe_seekers_09
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800/80 space-y-1 text-xs text-zinc-400">
            <p><strong className="text-white">Founder & Creative Director:</strong> Vivek Ashok Matne</p>
            <p>VIBE SEEKERS • Authentic Indian Streetwear Clothing Label</p>
          </div>
        </div>
      </section>

    </div>
  );
};
