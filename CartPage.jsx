import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discount,
    totalPrice,
    coupon,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      addToast(res.message, 'success');
      setCouponError('');
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const freeShippingPercentage = Math.min(100, Math.round((itemsPrice / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your shopping cart is empty</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our featured items and find something you love.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your items and proceed to secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-blue-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> You unlocked Free Express Shipping!
              </span>
            ) : (
              <span>Add ${amountNeededForFreeShipping.toFixed(2)} more for Free Shipping</span>
            )}
          </span>
          <span className="text-blue-600">{freeShippingPercentage}%</span>
        </div>
        <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.productId} className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Thumbnail */}
                <Link to={`/products/${item.productId}`} className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item.productId}`}
                    className="block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">
                    ${item.price.toFixed(2)} each
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total Item Price */}
                <div className="text-right sm:w-24">
                  <span className="text-base font-black text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove item button */}
                <button
                  type="button"
                  onClick={() => {
                    removeFromCart(item.productId);
                    addToast(`Removed "${item.name.slice(0, 20)}..."`, 'info');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SAVE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {couponError && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1.5">{couponError}</p>
              )}

              {coupon && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{coupon.code} ({coupon.label})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-extrabold uppercase">Free</span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-slate-900">${taxPrice.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted 256-bit SSL transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

