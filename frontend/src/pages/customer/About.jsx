import React from 'react';
import { Flame, ShieldCheck, Sparkles, MapPin, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Origin & Vision
        </span>
        <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white">
          THE VIBE SEEKERS STORY
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
          Born out of a desire for uncompromised, authentic Indian streetwear. Heavyweight fabrics, razor-sharp silhouettes, and raw underground aesthetic.
        </p>
      </div>

      {/* Brand Imagery & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl aspect-[4/5] bg-zinc-950">
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80"
            alt="Streetwear Culture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <div className="flex items-center gap-2 text-vibe-accent text-xs font-black uppercase tracking-widest">
            <Flame size={16} />
            <span>Heavyweight Craftsmanship</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            NOT JUST CLOTHING. A MOVEMENT IN FABRIC.
          </h2>

          <p>
            Mainstream Indian fashion for years settled for flimsy, lightweight polyester blends labeled as "streetwear". We founded <strong className="text-white">VIBE SEEKERS</strong> to shatter that standard.
          </p>

          <p>
            Under the creative direction of <strong className="text-white">Vivek Ashok Matne</strong>, every drop is engineered from scratch: custom knitted 240+ GSM combed cotton for our oversized t-shirts, plush 400 GSM brushed fleece for our heavyweight hoodies, and ballistic water-resistant technical twill for our outerwear.
          </p>

          <p>
            We don't do mass inventory or disposable fashion. We produce limited-batch drops that speak to those who live and breathe authentic street culture across Mumbai, Delhi, Bengaluru, Pune, and beyond.
          </p>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="p-3 bg-zinc-950 border border-zinc-800 text-vibe-accent rounded-lg w-fit">
            <Award size={24} />
          </div>
          <h3 className="text-base font-black uppercase text-white">Zero Compromise Fabrics</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every garment undergoes rigorous bio-washing and pre-shrinking. Built to withstand endless street wear without losing shape or color vibrancy.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="p-3 bg-zinc-950 border border-zinc-800 text-vibe-accent rounded-lg w-fit">
            <MapPin size={24} />
          </div>
          <h3 className="text-base font-black uppercase text-white">Made for Indian Streets</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tailored specifically with generous boxy proportions and drop-shoulders suited for Indian street styling and tropical weather comfort.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="p-3 bg-zinc-950 border border-zinc-800 text-vibe-accent rounded-lg w-fit">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-base font-black uppercase text-white">Direct-to-Customer Exclusivity</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            By running prepaid-only drops and working directly with premier couriers via Shiprocket, we deliver authentic luxury drip straight to your hands.
          </p>
        </div>
      </div>

      {/* Founder Sign-off */}
      <div className="border-t border-zinc-800 pt-8 text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Founder & Creative Lead</p>
        <p className="text-lg font-black text-white">Vivek Ashok Matne</p>
        <p className="text-xs text-zinc-400">VIBE SEEKERS • Maharashtra, India</p>
      </div>

    </div>
  );
};
