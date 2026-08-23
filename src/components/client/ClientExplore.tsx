import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, BusinessCategory } from '../../types';
import { InteractiveMap } from '../map/InteractiveMap';
import {
  Search,
  Star,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  MessageCircle,
  Flame,
  Filter,
  ShoppingBag,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ClientExploreProps {
  onSelectBusiness: (biz: Business) => void;
}

export const ClientExplore: React.FC<ClientExploreProps> = ({ onSelectBusiness }) => {
  const {
    businesses,
    products,
    calculateDistance,
    openExternalNavigation,
    openWhatsAppWithPrompt
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | BusinessCategory | 'offers'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter businesses
  const filteredBusinesses = businesses.filter((biz) => {
    if (!biz.isActive) return false;

    // Search query filter (name, address, tags, products)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = biz.name.toLowerCase().includes(q);
      const inAddress = biz.address.toLowerCase().includes(q);
      const inTags = biz.tags.some(t => t.toLowerCase().includes(q));
      const hasMatchingProduct = products.some(
        p => p.businessId === biz.id && (p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
      );
      if (!inName && !inAddress && !inTags && !hasMatchingProduct) return false;
    }

    if (activeCategory === 'all') return true;
    if (activeCategory === 'offers') {
      return products.some((p) => p.businessId === biz.id && p.isOfferOfTheDay);
    }
    return biz.category === activeCategory;
  });

  // Count offers
  const offersCount = products.filter(p => p.isOfferOfTheDay).length;

  return (
    <div className="space-y-5 pb-24 md:pb-10 max-w-7xl mx-auto px-3 md:px-6">
      
      {/* 1. Quick Search Bar & Direct WhatsApp Prompt */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por medicina, síntoma, hamburguesa, pizza..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* WhatsApp Bot Direct Search Button */}
        <button
          onClick={() => openWhatsAppWithPrompt(searchQuery || '¿Qué opciones tienen disponibles cerca?')}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all active:scale-95 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Consultar al Bot de WhatsApp</span>
        </button>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>Todos los Comercios</span>
          <span className="text-[10px] opacity-70">({businesses.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('farmacia')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'farmacia'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>💊 Farmacias</span>
          <span className="text-[10px] opacity-70">
            ({businesses.filter((b) => b.category === 'farmacia').length})
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('restaurante')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'restaurante'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>🍔 Comida Rápida / Restaurantes</span>
          <span className="text-[10px] opacity-70">
            ({businesses.filter((b) => b.category === 'restaurante').length})
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('offers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'offers'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Ofertas del Día</span>
          <span className="text-[10px] font-black">({offersCount})</span>
        </button>
      </div>

      {/* 3. Interactive Map with Live GPS & Custom Logo Pins */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mapa Interactivo en Tiempo Real
            </span>
          </div>
          <span className="text-[11px] text-blue-400 font-semibold">
            Toca un pin para ver detalles y ruta
          </span>
        </div>

        <InteractiveMap
          selectedCategory={activeCategory}
          onSelectBusiness={onSelectBusiness}
        />
      </div>

      {/* 4. Businesses Cards Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-base md:text-lg tracking-tight">
            Comercios Cercanos a tu Ubicación
          </h3>
          <span className="text-xs text-slate-400">
            {filteredBusinesses.length} resultados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => {
            const distance = calculateDistance(biz.coordinates);
            const bizOffers = products.filter(
              (p) => p.businessId === biz.id && p.isOfferOfTheDay
            );

            return (
              <div
                key={biz.id}
                className="group bg-slate-900/90 hover:bg-slate-850 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
              >
                {/* Card Top Image & Badges */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={biz.bannerImage}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                  {/* Logo Pin */}
                  <div
                    className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl border-2 border-white/40"
                    style={{ backgroundColor: biz.customPinColor || '#2563eb' }}
                  >
                    {biz.logo}
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase border border-slate-700">
                      {biz.category === 'farmacia' ? '💊 Farmacia' : '🍔 Restaurante'}
                    </span>

                    <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold border border-slate-700">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{biz.rating}</span>
                    </div>
                  </div>

                  {/* Offers pill */}
                  {bizOffers.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      <span>Oferta Activa</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-white text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {biz.name}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{biz.address}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {biz.deliveryTime}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="font-bold text-emerald-400">
                        {distance} km de distancia
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Google Maps / Waze / WhatsApp / Ver Menú */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => openExternalNavigation(biz.coordinates, 'google_maps')}
                        className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-2 rounded-xl text-[11px] font-semibold border border-slate-700 transition-all"
                        title="Abrir en Google Maps"
                      >
                        <Navigation className="w-3 h-3 text-blue-400" />
                        <span>Maps</span>
                      </button>
                      <button
                        onClick={() => openExternalNavigation(biz.coordinates, 'waze')}
                        className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-2 rounded-xl text-[11px] font-semibold border border-slate-700 transition-all"
                        title="Abrir en Waze"
                      >
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                        <span>Waze</span>
                      </button>
                      <button
                        onClick={() => openWhatsAppWithPrompt(`Hola, quiero consultar el catálogo de ${biz.name}`, biz.id)}
                        className="flex items-center justify-center gap-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-400 hover:text-white py-1.5 px-2 rounded-xl text-[11px] font-bold border border-emerald-500/40 transition-all"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectBusiness(biz)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-98"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Ver Catálogo & Pedir</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
