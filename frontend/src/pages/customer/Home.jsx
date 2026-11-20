import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, Truck, RefreshCw, Zap, Sparkles } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { ProductCard } from '../../components/shop/ProductCard';

export const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axiosInstance.get('/api/public/new-arrivals');
        setNewArrivals(res.data.data || []);
      } catch (err) {
        console.error('Failed to load new arrivals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const categories = [
    {
      title: 'Heavyweight T-Shirts',
      tag: '240 GSM Luxury Cotton',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=TSHIRTS',
    },
    {
      title: 'Plush Fleece Hoodies',
      tag: '400 GSM Ultra Comfort',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=HOODIES',
    },
    {
      title: 'Statement Jackets',
      tag: 'Cargo & Corduroy Cuts',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=JACKETS',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-zinc-800 bg-zinc-950">
        {/* Background Streetwear Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1600&auto=format&fit=crop&q=80')`,
          }}
        ></div>

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.12)_0,transparent_70%)]"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-vibe-accent text-xs font-black uppercase tracking-widest animate-pulse shadow-lg">
            <Flame size={14} className="fill-current" />
            <span>Winter Drop 2026 Live Now</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
            DEFY THE NORM. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-vibe-accent">
              SEEK THE VIBE.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 font-medium leading-relaxed">
            Authentic Indian Streetwear tailored for bold statements. Heavyweight 240+ GSM fabrics, oversized drop-shoulders, and pan-India express courier logistics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg font-black uppercase tracking-wider text-xs flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-vibe-accent/20 hover:scale-105"
            >
              <span>Explore The Drop</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop?category=TSHIRTS"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Shop Oversized Tees</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-10 grid grid-cols-3 max-w-lg mx-auto divide-x divide-zinc-800 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">240+</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">GSM Luxury Cotton</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-vibe-accent">100%</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">Prepaid & Verified</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">28,000+</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">Indian Pincodes</p>
            </div>
          </div>

        </div>
      </section>

      {/* Dedicated Categories Grid (T-Shirts, Hoodies, Jackets) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Curated Streetwear Silhouettes
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col justify-end p-6 transition-all duration-500 hover:border-zinc-600"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${cat.image}')` }}
              ></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-1 bg-vibe-accent text-white text-[10px] font-black uppercase tracking-widest rounded">
                  {cat.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight group-hover:text-vibe-accent transition-colors">
                  {cat.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 pt-1">
                  <span>Explore Collection</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh Drops / New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-vibe-accent">
              <Sparkles size={16} />
              <span>Limited Release</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Fresh Drops & Street Essentials
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-vibe-accent hover:text-white flex items-center gap-1 group"
          >
            <span>See Entire Catalog</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-zinc-900/40 rounded-xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Streetwear Manifesto Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">The VIBE SEEKERS Manifesto</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              BORN IN MAHARASHTRA. <br />WORN ACROSS THE STREETS OF INDIA.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We started VIBE SEEKERS with one relentless pursuit: crafting heavyweight, uncompromised streetwear without fast-fashion shortcuts. From bio-washed 240 GSM tees to insulated bombers, every piece is engineered for durability, swagger, and real comfort.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-vibe-accent transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
