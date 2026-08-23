import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  Package,
  Bike,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const { orders, businesses, openWhatsAppWithPrompt, setActiveClientTab } = useApp();

  const getStatusStepInfo = (status: OrderStatus) => {
    switch (status) {
      case 'preparing':
        return { step: 1, label: 'En Preparación 👨‍🍳', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'ready':
        return { step: 2, label: 'Listo para Entrega 📦', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'on_the_way':
        return { step: 3, label: 'En Camino 🛵', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'delivered':
        return { step: 4, label: 'Entregado ✓', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      default:
        return { step: 0, label: 'Cancelado', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-6 py-4 space-y-4 pb-24 md:pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Historial de Pedidos</h2>
          <p className="text-xs text-slate-400">Rastreo en tiempo real y detalles de tus compras</p>
        </div>
        <button
          onClick={() => setActiveClientTab('explore')}
          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all"
        >
          + Nuevo Pedido
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-3">
          <div className="text-5xl">🛍️</div>
          <h3 className="font-bold text-white text-base">Aún no tienes pedidos registrados</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explora las farmacias y restaurantes en el mapa para realizar tu primer pedido con entrega inmediata o recojo en sucursal.
          </p>
          <button
            onClick={() => setActiveClientTab('explore')}
            className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
          >
            Explorar en el Mapa
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusStepInfo(order.status);
            const biz = businesses.find((b) => b.id === order.businessId);

            return (
              <div
                key={order.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 md:p-5 shadow-xl space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
                      {order.businessLogo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          #{order.id}
                        </span>
                        <span className="text-slate-500 text-xs">· {order.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">
                        {order.businessName}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Progress Steps Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-1 relative">
                    {[
                      { step: 1, title: 'Preparando' },
                      { step: 2, title: 'Listo' },
                      { step: 3, title: 'En Camino' },
                      { step: 4, title: 'Entregado' }
                    ].map((s) => {
                      const isPassed = statusInfo.step >= s.step;
                      return (
                        <div key={s.step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                              isPassed
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isPassed ? '✓' : s.step}
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${
                              isPassed ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items and Details */}
                <div className="bg-slate-950/60 rounded-2xl p-3 space-y-2 border border-slate-800/80 text-xs">
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-300">
                        <span>
                          <span className="text-blue-400 font-bold mr-1.5">{item.quantity}x</span>
                          {item.product.name}
                        </span>
                        <span className="font-medium">
                          ${item.product.price * item.quantity} MXN
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                    <span>
                      Modalidad: <strong className="text-white capitalize">{order.deliveryType === 'delivery' ? '🛵 A Domicilio' : '🏬 Recoger en Sucursal'}</strong>
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      Total: ${order.total} MXN
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>
                </div>

                {/* Direct Action Contact */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-400">
                    Pago: <span className="text-white font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {biz && (
                      <button
                        onClick={() => openWhatsAppWithPrompt(`Hola, consulto por mi pedido #${order.id}`, biz.id)}
                        className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Tienda</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
