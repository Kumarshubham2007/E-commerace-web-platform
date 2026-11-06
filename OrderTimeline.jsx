import React from 'react';
import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'Placed', label: 'Order Placed', icon: Clock },
  { key: 'Processing', label: 'Processing', icon: Package },
  { key: 'Shipped', label: 'Shipped & In Transit', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

export const OrderTimeline = ({ orderStatus, statusHistory = [], carrier, trackingNumber }) => {
  const isCancelled = orderStatus === 'Cancelled';

  // Determine current step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(orderStatus);

  if (isCancelled) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-rose-900">Order Cancelled</h3>
        <p className="text-sm text-rose-700 mt-1">This order has been cancelled and refunded if payment was collected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Current Status</span>
          <div className="flex items-center gap-2.5 mt-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              orderStatus === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : orderStatus === 'Shipped'
                ? 'bg-blue-100 text-blue-800'
                : orderStatus === 'Processing'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-800'
            }`}>
              {orderStatus}
            </span>
          </div>
        </div>

        {trackingNumber && (
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking Code</span>
            <div className="font-mono text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-lg mt-1 inline-block">
              {trackingNumber}
            </div>
            {carrier && <div className="text-xs text-slate-500 mt-0.5">Carrier: {carrier}</div>}
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative mb-10">
        <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        <div
          className="hidden sm:block absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
        ></div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
          {ORDER_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-xs font-medium text-blue-600 inline-block">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status History Timeline details */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Tracking Event Log</h4>
          <div className="space-y-4">
            {statusHistory.slice().reverse().map((ev, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0 ring-4 ring-blue-50"></div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {ev.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{ev.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

