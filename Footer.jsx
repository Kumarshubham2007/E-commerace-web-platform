import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, RotateCcw, Send, ShoppingBag } from 'lucide-react';
import { useToast } from './Toast';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all orders over $150</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">256-Bit SSL Protection</h4>
                <p className="text-xs text-slate-400 mt-0.5">Guaranteed safe & secure checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Live expert chat & email help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">ZenithStore</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation full-stack e-commerce experience engineered with React, Express, Prisma ORM, and comprehensive role-based access control.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">Prisma ORM</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">Express REST</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">React 18</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Store Catalog</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=Electronics" className="hover:text-blue-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Footwear" className="hover:text-blue-400 transition-colors">Footwear & Apparel</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen" className="hover:text-blue-400 transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-blue-400 transition-colors">Gear & Accessories</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/track" className="hover:text-blue-400 transition-colors">Track Shipment</Link></li>
              <li><Link to="/my-orders" className="hover:text-blue-400 transition-colors">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition-colors">View Cart</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400 transition-colors">Account Profile</Link></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Informed</h5>
            <p className="text-xs text-slate-400 mb-3">Get exclusive discounts, new drops, and seasonal promotional codes directly in your inbox.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ZenithStore Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Demo Admin: <strong className="text-slate-300">admin@store.com</strong> / <strong className="text-slate-300">admin123</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

