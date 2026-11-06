import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import { useToast } from '../components/Toast';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, discount, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();

  const [shippingData, setShippingData] = useState({
    shippingName: user?.name || '',
    shippingPhone: user?.phone || '',
    shippingAddress: user?.street || '',
    shippingCity: user?.city || '',
    shippingPostalCode: user?.postalCode || '',
    shippingCountry: user?.country || 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Card details (demo)
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '123',
    cardHolder: user?.name || 'John Doe',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        shippingName: prev.shippingName || user.name || '',
        shippingPhone: prev.shippingPhone || user.phone || '',
        shippingAddress: prev.shippingAddress || user.street || '',
        shippingCity: prev.shippingCity || user.city || '',
        shippingPostalCode: prev.shippingPostalCode || user.postalCode || '',
        shippingCountry: prev.shippingCountry || user.country || 'United States',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !shippingData.shippingName ||
      !shippingData.shippingAddress ||
      !shippingData.shippingCity ||
      !shippingData.shippingPostalCode
    ) {
      setError('Please complete all required shipping address fields');
      return;
    }

    if (!user) {
      setError('Please sign in or register to place your order');
      navigate(`/login?redirect=/checkout`);
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        ...shippingData,
        paymentMethod:
          paymentMethod === 'Card'
            ? 'Credit Card'
            : paymentMethod === 'COD'
            ? 'Cash on Delivery'
            : 'UPI / Net Banking',
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount,
        totalPrice,
      };

      const res = await ordersApi.createOrder(orderPayload);
      const placedOrder = res.data.order;

      clearCart();
      addToast('Order successfully placed!', 'success');
      navigate(`/order-success/${placedOrder.orderNumber}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your delivery details and choose your preferred payment option
        </p>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left: Shipping & Payment Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">1. Delivery Address</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  name="shippingName"
                  required
                  value={shippingData.shippingName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="shippingPhone"
                    value={shippingData.shippingPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="shippingCountry"
                    required
                    value={shippingData.shippingCountry}
                    onChange={handleInputChange}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  required
                  value={shippingData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="123 Market Street, Apt 4B"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="shippingCity"
                    required
                    value={shippingData.shippingCity}
                    onChange={handleInputChange}
                    placeholder="Seattle"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="shippingPostalCode"
                    required
                    value={shippingData.shippingPostalCode}
                    onChange={handleInputChange}
                    placeholder="98101"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">2. Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'Card'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Credit / Debit</span>
                <span className="text-[10px] text-slate-500">Instant Demo Card</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'COD'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="sr-only"
                />
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Pay at Doorstep</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="sr-only"
                />
                <Smartphone className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">UPI / QR Pay</span>
                <span className="text-[10px] text-slate-500">Fast Mobile Pay</span>
              </label>
            </div>

            {/* If Card selected, show friendly mock card fields */}
            {paymentMethod === 'Card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-4 text-xs">
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Demo Card Details (Simulated Processing)</span>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    disabled
                    value={cardData.cardNumber}
                    className="w-full text-xs font-mono px-3 py-2 bg-white rounded-xl border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Expires</label>
                    <input
                      type="text"
                      disabled
                      value={cardData.cardExp}
                      className="w-full text-xs font-mono px-3 py-2 bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CVV</label>
                    <input
                      type="text"
                      disabled
                      value={cardData.cardCvc}
                      className="w-full text-xs font-mono px-3 py-2 bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Review & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Review Your Items ({cartItems.length})
            </h3>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border p-1" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                    <span className="text-[11px] text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingPrice === 0 ? <span className="text-emerald-600 font-extrabold uppercase">Free</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-slate-900">${taxPrice.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Savings</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} & Place Order`}</span>
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                By placing this order you agree to our Terms of Service & Privacy Policy.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

