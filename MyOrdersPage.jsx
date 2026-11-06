import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, ExternalLink, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { ordersApi } from '../services/api';

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersApi.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your purchase history and track active deliveries
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-32"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't purchased any items yet. Explore our storefront and start shopping.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Header Summary Row */}
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>{order.orderItems?.length || 0} items</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/track?orderNumber=${order.orderNumber}`}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Toggle Details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Item Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Shipping To:</span>
                        <p className="text-slate-600">{order.shippingName}</p>
                        <p className="text-slate-600">{order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Payment Method:</span>
                        <p className="text-slate-600">{order.paymentMethod} ({order.paymentStatus})</p>
                        {order.trackingNumber && (
                          <p className="text-slate-600 mt-1">
                            Tracking: <span className="font-mono font-bold text-blue-600">{order.trackingNumber}</span> ({order.carrier})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider block mb-2">
                        Ordered Items:
                      </span>
                      <div className="space-y-2">
                        {order.orderItems?.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-0.5" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                              <span className="text-[11px] text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

