import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Instagram,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { ProductCard } from '../../components/shop/ProductCard';

export const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredTees, setFeaturedTees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        // Fetch new arrivals, best sellers, and tshirts in parallel
        const [newRes, bestRes, teesRes] = await Promise.allSettled([
          axiosInstance.get('/api/public/new-arrivals'),
          axiosInstance.get('/api/public/best-sellers'),
          axiosInstance.get('/api/public/products?category=TSHIRTS&size=4'),
        ]);

        if (newRes.status === 'fulfilled') {
          setNewArrivals(newRes.value.data?.data || newRes.value.data || []);
        }
        if (bestRes.status === 'fulfilled') {
          setBestSellers(bestRes.value.data?.data || bestRes.value.data || []);
        }
        if (teesRes.status === 'fulfilled') {
          const content = teesRes.value.data?.data?.content || teesRes.value.data?.content || [];
          setFeaturedTees(content.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load homepage products', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const collections = [
    {
      title: 'ACID WASH SERIES',
      tag: 'Vintage Mineral Dye • 260 GSM',
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80',
      link: '/shop?keyword=Acid',
    },
    {
      title: 'MONOCHROME ARCHIVE',
      tag: 'Boxy Silhouette • Pure Black & Bone',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80',
      link: '/shop?category=TSHIRTS',
    },
    {
      title: 'HEAVYWEIGHT FLEECE',
      tag: '400 GSM Drop-Shoulder Hoodies',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80',
      link: '/shop?category=HOODIES',
    },
  ];

  const instagramShots = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      handle: '@vibe_seekers_09',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
      handle: '@vibe_seekers_09',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=600&auto=format&fit=crop&q=80',
      handle: '@vibe_seekers_09',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
      handle: '@vibe_seekers_09',
    },
  ];

  return (
    <div className="bg-[#080808] text-white selection:bg-white selection:text-black">
      
      {/* 1. Full-Screen Editorial Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-zinc-800">
        {/* Background Editorial Visual */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.45] contrast-[1.1] scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1920&auto=format&fit=crop&q=90')`,
          }}
        />

        {/* Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#080808]/80 pointer-events-none" />

        {/* Hero Content with Framer Motion animations */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-zinc-700 bg-black/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-300 mb-6"
          >
            <Sparkles size={13} className="text-white" />
            <span>SEASON ARCHIVE 2026 • LIMITED DROP</span>
          </motion.div>

          {/* Animated Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none font-display mb-6"
          >
            FIND YOUR VIBE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
              OWN YOUR STYLE.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-relaxed uppercase tracking-wider mb-10"
          >
            Premium oversized streetwear tailored for boys & girls. 240+ GSM heavyweight luxury combed cotton, signature drops, and complimentary pan-India express courier logistics.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto px-9 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all duration-300 shadow-2xl"
            >
              <span>SHOP NOW</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-9 py-4 bg-black/80 hover:bg-zinc-900 border border-zinc-700 text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <span>EXPLORE COLLECTION</span>
            </Link>
          </motion.div>

          {/* Specs Mini Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-14 pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 sm:gap-12 max-w-xl w-full text-center"
          >
            <div>
              <p className="text-base sm:text-xl font-black text-white">240+ GSM</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">Heavyweight Knit</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-black text-white">100% PREPAID</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">Secure UPI Scan</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-black text-white">PAN-INDIA</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">Free Express Shipping</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Promotional Campaign Banner: Secret Code */}
      <section className="bg-[#121212] border-b border-zinc-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-white text-black font-black text-[10px] uppercase tracking-widest">PROMO</span>
            <span className="text-xs tracking-wider text-zinc-300 font-medium">
              FIRST TIME AT VIBE SEEKERS? ENJOY 10% OFF STOREWIDE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">USE CODE:</span>
            <span className="px-3 py-1 bg-black border border-zinc-700 font-mono font-bold text-white text-xs tracking-widest">
              VIBE10
            </span>
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">FRESH IN THE VAULT</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 hover:text-white flex items-center gap-1.5 group"
          >
            <span>VIEW ALL DROPS</span>
            <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900/60 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-xs">No new drops found in current archive.</div>
        )}
      </section>

      {/* 4. Trending Collections Editorial Spread */}
      <section className="bg-[#0e0e0e] border-y border-zinc-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">CURATED DROPS</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              TRENDING COLLECTIONS
            </h2>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-2">
              Explorations in oversized boxy cuts, mineral washes, and ultra-dense streetwear fleece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, idx) => (
              <Link
                key={idx}
                to={col.link}
                className="group relative aspect-[3/4] overflow-hidden bg-zinc-950 border border-zinc-800/80 block"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-1">
                    {col.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                    {col.title}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:underline">
                    <span>EXPLORE DROP</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">STREET-FAVORITES</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">
              BEST SELLERS
            </h2>
          </div>
          <Link
            to="/shop?filter=bestseller"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 hover:text-white flex items-center gap-1.5 group"
          >
            <span>VIEW ALL BEST SELLERS</span>
            <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : featuredTees.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredTees.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-xs">No best sellers currently listed.</div>
        )}
      </section>

      {/* 6. Brand Story Section (Minimal Luxury Editorial Spread) */}
      <section className="border-t border-zinc-800 bg-[#0a0a0a] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80"
                  alt="VIBE SEEKERS Studio"
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-black p-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl hidden sm:block">
                CRAFTED IN INDIA • WORN WORLDWIDE
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                THE BRAND PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                AUTHENTIC OVERSIZED SILHOUETTES FOR TRUE CULTURE SEEKERS.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed uppercase tracking-wider">
                Founded by Vivek Ashok Matne, VIBE SEEKERS is an independent Indian clothing brand born out of a desire for authentic, unapologetic streetwear. We reject thin, disposable fast-fashion garments in favor of heavyweight 240+ GSM combed cotton, custom vintage acid washes, and bold drop-shoulder silhouettes designed for both boys and girls.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800 text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">PREMIUM FABRICS</h4>
                  <p className="text-zinc-500 mt-1">Dense, breathable combed cotton engineered to retain shape wear after wear.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">HONEST LOGISTICS</h4>
                  <p className="text-zinc-500 mt-1">Prepaid UPI verification and rapid door-to-door courier dispatches across India.</p>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-white text-white hover:text-black border border-zinc-700 hover:border-white text-xs font-bold uppercase tracking-[0.2em] transition-all"
                >
                  <span>READ OUR FULL MANIFESTO</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Instagram / Community Gallery */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">JOIN THE MOVEMENT</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                TAG @VIBE_SEEKERS_09
              </h2>
            </div>
            <a
              href="https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-0 px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
            >
              <Instagram size={15} />
              <span>FOLLOW ON INSTAGRAM</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramShots.map((shot) => (
              <a
                key={shot.id}
                href="https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-zinc-950 border border-zinc-800/80 block"
              >
                <img
                  src={shot.image}
                  alt="Vibe Seekers Community"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 bg-black/70 px-3 py-1.5 border border-zinc-700">
                    <Instagram size={14} />
                    <span>VIEW POST</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
