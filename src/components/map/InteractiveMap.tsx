import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, BusinessCategory } from '../../types';
import {
  Navigation,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Star,
  ExternalLink,
  Layers,
  LocateFixed,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Flame
} from 'lucide-react';

interface InteractiveMapProps {
  onSelectBusiness?: (business: Business) => void;
  selectedCategory?: 'all' | BusinessCategory | 'offers';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectBusiness,
  selectedCategory = 'all'
}) => {
  const {
    businesses,
    products,
    userLocation,
    calculateDistance,
    openExternalNavigation,
    detectUserLocation,
    isLocating,
    openWhatsAppWithPrompt
  } = useApp();

  const [activeBiz, setActiveBiz] = useState<Business | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [showCoverageRadius, setShowCoverageRadius] = useState<boolean>(true);

  // Center coordinate reference
  const centerLat = userLocation?.lat || 19.4120;
  const centerLng = userLocation?.lng || -99.1650;

  // Filter businesses according to prop
  const filteredBusinesses = businesses.filter((biz) => {
    if (!biz.isActive) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'offers') {
      return products.some((p) => p.businessId === biz.id && p.isOfferOfTheDay);
    }
    return biz.category === selectedCategory;
  });

  // Calculate SVG projection coordinates relative to center
  const getSvgCoordinates = (lat: number, lng: number) => {
    const latSpan = 0.08 / zoomLevel;
    const lngSpan = 0.09 / zoomLevel;

    // x: 0 to 100%, y: 0 to 100%
    const x = ((lng - (centerLng - lngSpan / 2)) / lngSpan) * 100;
    const y = ((centerLat + latSpan / 2 - lat) / latSpan) * 100;

    // Clamp inside viewport
    const clampedX = Math.max(8, Math.min(92, x));
    const clampedY = Math.max(10, Math.min(90, y));

    return { x: clampedX, y: clampedY };
  };

  const userSvgPos = getSvgCoordinates(centerLat, centerLng);

  return (
    <div className="relative w-full h-[420px] md:h-[540px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl select-none">
      {/* Map Canvas Background Layers */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        mapLayer === 'satellite'
          ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a1628] to-[#040810]'
          : mapLayer === 'streets'
          ? 'bg-slate-900 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px]'
          : 'bg-[#0b1120] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]'
      }`}>
        {/* Stylized street vectors */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none stroke-slate-700/60" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 250 150 500 120 T 1000 220" fill="none" strokeWidth="4" strokeDasharray="6 4" />
          <path d="M 120 0 Q 180 300 350 600" fill="none" strokeWidth="6" />
          <path d="M 600 0 Q 550 250 850 600" fill="none" strokeWidth="5" />
          <path d="M 0 350 Q 400 320 1000 420" fill="none" strokeWidth="6" />
          <circle cx="50%" cy="50%" r="180" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
          <circle cx="50%" cy="50%" r="280" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
        </svg>

        {/* Coverage Radius Circles around User */}
        {showCoverageRadius && (
          <div
            className="absolute rounded-full border border-blue-500/20 bg-blue-500/5 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse-ring"
            style={{
              left: `${userSvgPos.x}%`,
              top: `${userSvgPos.y}%`,
              width: '260px',
              height: '260px'
            }}
          />
        )}
      </div>

      {/* Top Map Layer Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setMapLayer('dark')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              mapLayer === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Modo Noche
          </button>
          <button
            onClick={() => setMapLayer('streets')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              mapLayer === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calles
          </button>
          <button
            onClick={() => setMapLayer('satellite')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satélite
          </button>
        </div>

        <button
          onClick={() => setShowCoverageRadius(!showCoverageRadius)}
          className={`p-2 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${
            showCoverageRadius
              ? 'bg-blue-600/30 border-blue-500 text-blue-400'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Radio de Cobertura"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Right Map Actions (Zoom & Locate) */}
      <div className="absolute right-3 top-16 flex flex-col gap-2 z-20">
        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-blue-400 border border-slate-700 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
          title="Centrar en mi ubicación GPS"
        >
          <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Business Map Markers (Custom Pin with Logo) */}
      <div className="absolute inset-0 z-10">
        {/* User Real GPS Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          style={{ left: `${userSvgPos.x}%`, top: `${userSvgPos.y}%` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-400 opacity-75" />
            <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50" />
            <span className="absolute -bottom-5 px-1.5 py-0.5 bg-slate-900/90 border border-slate-700 rounded text-[9px] font-bold text-blue-400 whitespace-nowrap">
              Tú estás aquí
            </span>
          </div>
        </div>

        {/* Business Custom Pins */}
        {filteredBusinesses.map((biz) => {
          const pos = getSvgCoordinates(biz.coordinates.lat, biz.coordinates.lng);
          const isSelected = activeBiz?.id === biz.id;
          const distance = calculateDistance(biz.coordinates);
          const hasOffer = products.some((p) => p.businessId === biz.id && p.isOfferOfTheDay);

          return (
            <div
              key={biz.id}
              onClick={() => setActiveBiz(biz)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-transform duration-200 hover:scale-125"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Notification flame for offers */}
                {hasOffer && (
                  <span className="absolute -top-3 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center shadow-lg animate-bounce">
                    🔥
                  </span>
                )}

                {/* Pin Header with Business Custom Logo */}
                <div
                  className={`relative flex items-center justify-center w-11 h-11 rounded-2xl shadow-xl border-2 transition-all ${
                    isSelected
                      ? 'ring-4 ring-white shadow-2xl scale-110'
                      : 'hover:ring-2 hover:ring-blue-400'
                  }`}
                  style={{
                    backgroundColor: biz.customPinColor || '#2563eb',
                    borderColor: '#ffffff'
                  }}
                >
                  <span className="text-xl drop-shadow">{biz.logo}</span>
                </div>

                {/* Pin Arrow Tip */}
                <div
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-0.5"
                  style={{ borderTopColor: biz.customPinColor || '#2563eb' }}
                />

                {/* Floating mini pill with name & distance */}
                <div className="mt-1 px-2 py-0.5 bg-slate-900/95 border border-slate-700/80 rounded-full shadow-md text-[10px] font-bold text-white whitespace-nowrap flex items-center gap-1 group-hover:border-blue-400">
                  <span>{biz.name.split(' ')[0]}</span>
                  <span className="text-blue-400 font-semibold">· {distance}km</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Business Bottom Card (Popup) */}
      {activeBiz && (
        <div className="absolute bottom-3 left-3 right-3 md:left-6 md:right-auto md:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/20 shadow-md"
                style={{ backgroundColor: activeBiz.customPinColor }}
              >
                {activeBiz.logo}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {activeBiz.category === 'farmacia' ? '💊 Farmacia' : '🍔 Restaurante'}
                  </span>
                  <span className="text-slate-500">·</span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {activeBiz.rating}
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm line-clamp-1">{activeBiz.name}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{activeBiz.address}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveBiz(null)}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeBiz.deliveryTime}</span>
            </div>
            <span className="font-semibold text-emerald-400">
              {calculateDistance(activeBiz.coordinates)} km de ti
            </span>
          </div>

          {/* Action Buttons: Google Maps / Waze / WhatsApp / View Menu */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* Assisted Navigation Menu */}
            <div className="flex gap-1">
              <button
                onClick={() => openExternalNavigation(activeBiz.coordinates, 'google_maps')}
                className="flex-1 flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                title="Ruta en Google Maps"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Maps</span>
              </button>
              <button
                onClick={() => openExternalNavigation(activeBiz.coordinates, 'waze')}
                className="flex-1 flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                title="Ruta en Waze"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Waze</span>
              </button>
            </div>

            {/* Direct WhatsApp chat */}
            <button
              onClick={() => openWhatsAppWithPrompt(`Hola, quiero información de ${activeBiz.name}`, activeBiz.id)}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Primary View Catalog Button */}
          <button
            onClick={() => onSelectBusiness && onSelectBusiness(activeBiz)}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-98"
          >
            <span>Ver Catálogo y Pedir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
