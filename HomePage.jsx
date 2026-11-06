import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Laptop,
  Shirt,
  Coffee,
  Watch,
  Shield,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { productsApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productsApi.getProducts({ featured: 'true', limit: 8 });
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Footwear', icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Apparel', icon: Shirt, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Home & Kitchen', icon: Coffee, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Accessories', icon: Watch, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Gen Full-Stack Store</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Curated Products,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Real-Time Tracking.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover exceptional consumer electronics, premium apparel, and home essentials with automated order management, instant inventory syncing, and transparent package delivery timelines.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/track"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm shadow-xs hover:border-slate-300 transition-all"
                >
                  Track an Order
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Instant Order Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Live Admin Status Controls</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-pulse-subtle"></div>
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Spotlight</span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      IN STOCK
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                      alt="Sony WH-1000XM5"
                      className="w-56 h-56 object-cover mx-auto rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="mt-5 font-extrabold text-slate-900 text-lg">Sony WH-1000XM5 ANC</h3>
                    <p className="text-xs text-slate-500 mt-1">Noise Cancelling Wireless Headphones</p>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="text-2xl font-black text-slate-900">$399.99</span>
                      <span className="text-sm text-slate-400 line-through">$449.99</span>
                    </div>
                  </div>

                  <Link
                    to="/products/1"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Browse by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore our wide selection of certified products</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center gap-2 ${cat.color}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg w-fit"
          >
            Browse Complete Catalog ({featuredProducts.length}+) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Discount Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              Special Promotion
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Enjoy 10% Off Your Entire Order
            </h3>
            <p className="text-sm text-blue-100">
              Apply promotional code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">SAVE10</span> at checkout for instant savings across all product lines.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Shop With Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

