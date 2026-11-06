import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, Package, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { ordersApi } from '../services/api';
import { OrderTimeline } from '../components/OrderTimeline';

export const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialQuery);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (numberToSearch) => {
    const num = (numberToSearch || orderNumber).trim();
    if (!num) return;

    setLoading(true);
    setError('');
    try {
      const res = await ordersApi.trackOrder(num);
      setOrderData(res.data);
      setSearchParams({ orderNumber: num });
    } catch (err) {
      setError(err.message || 'No tracking information found for this order reference');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTracking();
  };

  const demoOrders = ['ORD-202610-8291', 'ORD-202611-3942', 'ORD-202611-9012'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Shipment Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Enter your unique order number below to view instant status history, packaging stage, and carrier transit progress.
        </p>
      </div>

      {/* Tracking Input Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. ORD-202611-3942"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono uppercase focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Track Order</span>
          </button>
        </form>

        {/* Demo order quick links */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Demo Orders:</span>
          {demoOrders.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setOrderNumber(code);
                fetchTracking(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-mono font-bold text-slate-700 transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Results Area */}
      {orderData && (
        <div className="space-y-6">
          {/* Order Timeline Visual Stepper */}
          <OrderTimeline
            orderStatus={orderData.orderStatus}
            statusHistory={orderData.statusHistory}
            carrier={orderData.carrier}
            trackingNumber={orderData.trackingNumber}
          />

          {/* Shipment & Package Items Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <h3 className="text-base font-bold text-slate-900">Shipment Details</h3>
              <span className="text-xs text-slate-500">
                Ordered on {new Date(orderData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Destination</span>
                <span className="font-bold text-slate-800">{orderData.shippingCity}, {orderData.shippingCountry}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Carrier</span>
                <span className="font-bold text-slate-800">{orderData.carrier || 'Express Logistics'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Estimated Arrival</span>
                <span className="font-bold text-slate-800">
                  {orderData.estimatedDelivery
                    ? new Date(orderData.estimatedDelivery).toLocaleDateString()
                    : 'Within 3-5 business days'}
                </span>
              </div>
            </div>

            {/* Items in package */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Items In This Package ({orderData.orderItems?.length || 0})
              </h4>
              <div className="space-y-2">
                {orderData.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-white border p-0.5" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                      <span className="text-[11px] text-slate-500">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

