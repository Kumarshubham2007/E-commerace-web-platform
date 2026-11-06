import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, ArrowRight, Package, Copy, Check } from 'lucide-react';
import { ordersApi } from '../services/api';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      ordersApi
        .trackOrder(orderNumber)
        .then((res) => setOrder(res.data))
        .catch((e) => console.error('Failed to load order info:', e));
    }
  }, [orderNumber]);

  const handleCopy = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Confirmed!</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for your purchase. We have received your order and our fulfillment team is preparing it for packaging.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-400">Order Reference</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-bold text-slate-900">{orderNumber}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy order number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">Payment Status</span>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-0.5">
              {order?.paymentStatus || 'Verified & Paid'}
            </div>
          </div>
        </div>

        {order?.estimatedDelivery && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Estimated Delivery by: </span>
              <span>{new Date(order.estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <Link
            to={`/track?orderNumber=${orderNumber}`}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Timeline</span>
          </Link>

          <Link
            to="/products"
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

