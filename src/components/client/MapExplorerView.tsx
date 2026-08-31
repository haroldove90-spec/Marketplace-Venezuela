import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, BusinessCategory } from '../../types';
import { InteractiveMap } from '../map/InteractiveMap';
import {
  MapPin,
  Store,
  LocateFixed,
  Flame,
  ArrowLeft,
  Navigation,
  ExternalLink,
  MessageCircle,
  ShoppingBag
} from 'lucide-react';

interface MapExplorerViewProps {
  onSelectBusiness: (biz: Business) => void;
  onBackToExplore?: () => void;
}

export const MapExplorerView: React.FC<MapExplorerViewProps> = ({
  onSelectBusiness,
  onBackToExplore
}) => {
  const {
    businesses,
    products,
    userLocation,
    userAddressLabel,
    detectUserLocation,
    isLocating,
    openExternalNavigation,
    openWhatsAppWithPrompt
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | BusinessCategory | 'offers'>('all');
  const [selectedMapBiz, setSelectedMapBiz] = useState<Business | null>(null);

  const offersCount = products.filter((p) => p.isOfferOfTheDay).length;

  const handleMarkerClick = (biz: Business) => {
    setSelectedMapBiz(biz);
  };

  return (
    <div className="space-y-3 pb-24 md:pb-12 max-w-4xl mx-auto px-3 sm:px-4 bg-white">
      
      {/* Top Header with Back button and GPS Info */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {onBackToExplore && (
            <button
              onClick={onBackToExplore}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Volver a la lista de tiendas"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Mapa de Negocios y Cobertura</span>
            </h2>
            <p className="text-xs text-slate-500">
              Explora visualmente todas las farmacias y restaurantes geolocalizados
            </p>
          </div>
        </div>

        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <LocateFixed className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Localizando...' : 'Mi GPS'}</span>
        </button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todos ({businesses.length})
        </button>

        <button
          onClick={() => setActiveCategory('farmacia')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'farmacia'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          💊 Farmacias ({businesses.filter((b) => b.category === 'farmacia').length})
        </button>

        <button
          onClick={() => setActiveCategory('restaurante')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'restaurante'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          🍔 Restaurantes ({businesses.filter((b) => b.category === 'restaurante').length})
        </button>

        <button
          onClick={() => setActiveCategory('offers')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            activeCategory === 'offers'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>Ofertas ({offersCount})</span>
        </button>
      </div>

      {/* Main Map Canvas Component */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <InteractiveMap
          selectedCategory={activeCategory}
          onSelectBusiness={(biz) => {
            handleMarkerClick(biz);
          }}
        />
      </div>

      {/* Selected Business Preview Floating Card */}
      {selectedMapBiz && (
        <div className="p-3.5 bg-white rounded-2xl border border-emerald-300 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-xs"
                style={{ backgroundColor: selectedMapBiz.customPinColor || '#00D222' }}
              >
                {selectedMapBiz.logo}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedMapBiz.name}</h4>
                <p className="text-xs text-slate-500">{selectedMapBiz.address}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMapBiz(null)}
              className="text-slate-400 hover:text-slate-700 p-1 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openExternalNavigation(selectedMapBiz.coordinates, 'google_maps')}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-semibold"
              >
                <Navigation className="w-3 h-3 text-emerald-600" />
                <span>Maps</span>
              </button>
              <button
                onClick={() => openExternalNavigation(selectedMapBiz.coordinates, 'waze')}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-semibold"
              >
                <ExternalLink className="w-3 h-3 text-teal-600" />
                <span>Waze</span>
              </button>
              <button
                onClick={() => openWhatsAppWithPrompt(`Hola, quiero consultar el catálogo de ${selectedMapBiz.name}`, selectedMapBiz.id)}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-200"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => onSelectBusiness(selectedMapBiz)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ver Menú & Pedir</span>
            </button>
          </div>
        </div>
      )}

      {/* GPS Status Footer Bar */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GPS Actual: <strong className="text-slate-800">{userAddressLabel}</strong></span>
        </div>
        <span className="text-[11px] text-slate-400">Toca cualquier marcador para ver ruta</span>
      </div>

    </div>
  );
};
