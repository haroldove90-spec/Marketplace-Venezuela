import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, Product } from '../../types';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ExternalLink,
  Plus,
  Minus,
  Check,
  Flame,
  ShoppingBag,
  Share2
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: Business;
  onClose: () => void;
  onOpenCart: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onOpenCart
}) => {
  const {
    products,
    addToCart,
    cart,
    calculateDistance,
    openExternalNavigation,
    openWhatsAppWithPrompt
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const bizProducts = products.filter((p) => p.businessId === business.id);

  const categories = ['all', ...Array.from(new Set(bizProducts.map((p) => p.category)))];

  const filteredProducts = bizProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleShare = () => {
    const deepUrl = `${window.location.origin}/?view=business&id=${business.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deepUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full h-full md:h-[90vh] md:max-w-3xl bg-white text-slate-900 flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Banner with close & action buttons */}
        <div className="relative h-44 md:h-56 w-full shrink-0 bg-slate-100">
          <img
            src={business.bannerImage}
            alt={business.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-black/20" />

          {/* Top Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md border border-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 p-2 px-3 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold backdrop-blur-md border border-slate-200 transition-all shadow-xs cursor-pointer"
                title="Copiar Deep Link"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
              </button>
            </div>
          </div>

          {/* Business Info Header */}
          <div className="absolute -bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-xl border-2 border-white"
                style={{ backgroundColor: business.customPinColor || '#2563eb' }}
              >
                {business.logo}
              </div>
              <div className="pb-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase shadow-xs">
                    {business.category === 'farmacia' ? '💊 Farmacia' : '🍔 Restaurante'}
                  </span>
                  {business.isVerified && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-slate-900/70 px-1.5 py-0.5 rounded-full backdrop-blur-xs">✓ Verificado</span>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-black text-white truncate drop-shadow">
                  {business.name}
                </h2>
              </div>
            </div>

            <div className="bg-white/95 border border-slate-200 px-3 py-1.5 rounded-xl text-center shrink-0 shadow-md">
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{business.rating}</span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">
                {calculateDistance(business.coordinates)} km
              </span>
            </div>
          </div>
        </div>

        {/* Quick Contact & Navigation Toolbar */}
        <div className="mt-6 px-4 pt-3 pb-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{business.openingHours}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openExternalNavigation(business.coordinates, 'google_maps')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => openExternalNavigation(business.coordinates, 'waze')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
              <span>Waze</span>
            </button>
            <button
              onClick={() => openWhatsAppWithPrompt(`Hola, quiero consultar el catálogo de ${business.name}`, business.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Product Category Filter Pills */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 shrink-0 bg-white">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos los productos' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid / Catalog */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredProducts.map((prod) => {
                const qty = getCartQuantity(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="flex gap-3 p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all shadow-xs"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {prod.isOfferOfTheDay && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded-md uppercase flex items-center gap-0.5 shadow-xs">
                          <Flame className="w-2.5 h-2.5 fill-slate-950" /> Oferta
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {prod.description}
                        </p>

                        {/* Bot Tags pill */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {prod.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-mono border border-blue-100"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">
                            ${prod.price} MXN
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">
                              ${prod.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Cart Controls */}
                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded-xl shadow-xs">
                            <button
                              onClick={() => addToCart(prod, -1)}
                              className="p-0.5 hover:opacity-80 active:scale-95 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold min-w-[14px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="p-0.5 hover:opacity-80 active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar</span>
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

        {/* Bottom Cart Shortcut bar if items exist */}
        {cart.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-600 font-medium">Total en Carrito:</span>
              <p className="font-black text-slate-900 text-base">
                ${cart.reduce((s, i) => s + i.product.price * i.quantity, 0)} MXN
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl shadow-md shadow-blue-600/25 text-xs transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Carrito & Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
