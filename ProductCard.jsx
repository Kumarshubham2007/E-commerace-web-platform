import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock <= 0) return;
    addToCart(product, 1);
    addToast(`Added "${product.name.slice(0, 28)}..." to cart!`, 'success');
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            FEATURED
          </span>
        )}
      </div>

      {/* Stock warning pill */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        {isOutOfStock ? (
          <span className="bg-slate-900/80 backdrop-blur-sm text-slate-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse">
            Only {product.countInStock} Left
          </span>
        ) : null}
      </div>

      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
            <span>{product.rating || '0.0'}</span>
            <span className="text-slate-400">({product.numReviews})</span>
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600 transition-colors mb-3 flex-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

