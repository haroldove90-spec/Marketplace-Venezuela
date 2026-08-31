import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, BusinessCategory, Product } from '../../types';
import {
  Search,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Flame,
  ShoppingBag,
  RefreshCw,
  Check,
  LocateFixed,
  Plus,
  Store,
  Map as MapIcon
} from 'lucide-react';

interface ClientExploreProps {
  onSelectBusiness: (biz: Business) => void;
  onOpenMapModule?: () => void;
}

export const ClientExplore: React.FC<ClientExploreProps> = ({
  onSelectBusiness,
  onOpenMapModule
}) => {
  const {
    businesses,
    products,
    calculateDistance,
    openWhatsAppWithPrompt,
    injectMockData,
    userAddressLabel,
    detectUserLocation,
    isLocating,
    addToCart,
    cart,
    setActiveClientTab
  } = useApp();

  const [viewMode, setViewMode] = useState<'businesses' | 'products'>('businesses');
  const [activeCategory, setActiveCategory] = useState<'all' | BusinessCategory | 'offers'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [injectedToast, setInjectedToast] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleInjectData = () => {
    injectMockData();
    setInjectedToast(true);
    setTimeout(() => setInjectedToast(false), 3000);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 2000);
  };

  const handleGoToMap = () => {
    if (onOpenMapModule) {
      onOpenMapModule();
    } else {
      setActiveClientTab('map');
    }
  };

  // Helper to determine price level badge ($ Bajo, $$ Medio, $$$ Alto)
  const getPriceBadge = (biz: Business) => {
    const bizProds = products.filter((p) => p.businessId === biz.id);
    if (bizProds.length === 0) return '$ Bajo';
    const avg = bizProds.reduce((s, p) => s + p.price, 0) / bizProds.length;
    if (avg < 90) return '$ Bajo';
    if (avg < 200) return '$$ Medio';
    return '$$$ Alto';
  };

  // Filtered & Distance-Sorted Businesses (Closest first)
  const sortedFilteredBusinesses = useMemo(() => {
    return businesses
      .filter((biz) => {
        if (!biz.isActive) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inName = biz.name.toLowerCase().includes(q);
          const inAddress = biz.address.toLowerCase().includes(q);
          const inTags = biz.tags.some((t) => t.toLowerCase().includes(q));
          const hasMatchingProduct = products.some(
            (p) =>
              p.businessId === biz.id &&
              (p.name.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q)) ||
                p.category.toLowerCase().includes(q))
          );
          if (!inName && !inAddress && !inTags && !hasMatchingProduct) return false;
        }

        if (activeCategory === 'all') return true;
        if (activeCategory === 'offers') {
          return products.some((p) => p.businessId === biz.id && p.isOfferOfTheDay);
        }
        return biz.category === activeCategory;
      })
      .map((biz) => ({
        ...biz,
        distanceKm: calculateDistance(biz.coordinates)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm); // Closest first
  }, [businesses, products, searchQuery, activeCategory, calculateDistance]);

  // Filtered & Distance-Sorted Products (Closest first by store distance)
  const sortedFilteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const parentBiz = businesses.find((b) => b.id === prod.businessId);
        if (!parentBiz || !parentBiz.isActive) return false;

        // Category filter
        if (activeCategory === 'farmacia' && parentBiz.category !== 'farmacia') return false;
        if (activeCategory === 'restaurante' && parentBiz.category !== 'restaurante') return false;
        if (activeCategory === 'offers' && !prod.isOfferOfTheDay) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inName = prod.name.toLowerCase().includes(q);
          const inDesc = prod.description.toLowerCase().includes(q);
          const inCat = prod.category.toLowerCase().includes(q);
          const inTags = prod.tags.some((t) => t.toLowerCase().includes(q));
          const inBiz = parentBiz.name.toLowerCase().includes(q);
          if (!inName && !inDesc && !inCat && !inTags && !inBiz) return false;
        }

        return true;
      })
      .map((prod) => {
        const parentBiz = businesses.find((b) => b.id === prod.businessId)!;
        return {
          ...prod,
          business: parentBiz,
          distanceKm: calculateDistance(parentBiz.coordinates)
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm); // Closest first
  }, [products, businesses, searchQuery, activeCategory, calculateDistance]);

  const offersCount = products.filter((p) => p.isOfferOfTheDay).length;

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-3xl mx-auto px-3 sm:px-4 bg-white">
      
      {/* 1. Minimalist Geolocation Bar with Direct Map Access Button */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-slate-800 font-bold truncate">
              {userAddressLabel || 'Ubicación actual'}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Ordenado por cercanía GPS</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={detectUserLocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Recalcular distancia GPS"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'GPS...' : 'Actualizar'}</span>
          </button>

          {/* Dedicated Button to View Map Module */}
          <button
            onClick={handleGoToMap}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Ver ubicación de todas las tiendas en el mapa"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Ver Mapa</span>
          </button>
        </div>
      </div>

      {/* 2. Minimalist Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar negocio, producto o servicio..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Category & Mode Switcher */}
      <div className="flex flex-col gap-2">
        {/* Toggle Mode: Negocios vs Productos */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('businesses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'businesses'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Negocios ({sortedFilteredBusinesses.length})</span>
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'products'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Productos ({sortedFilteredProducts.length})</span>
            </button>
          </div>

          <button
            onClick={handleGoToMap}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs"
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Módulo Mapa</span>
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setActiveCategory('farmacia')}
            className={`px-3 py-1.2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'farmacia'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💊 Farmacias
          </button>

          <button
            onClick={() => setActiveCategory('restaurante')}
            className={`px-3 py-1.2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'restaurante'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🍔 Restaurantes
          </button>

          <button
            onClick={() => setActiveCategory('offers')}
            className={`px-3 py-1.2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'offers'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Ofertas ({offersCount})</span>
          </button>
        </div>
      </div>

      {/* Added to Cart Toast */}
      {addedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡{addedToast} agregado!</span>
        </div>
      )}

      {/* 4. HORIZONTAL MINIMALIST VITRINE (Strict "Abasto La Economía" layout) */}
      {viewMode === 'businesses' ? (
        <div className="space-y-2.5">
          {sortedFilteredBusinesses.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <Store className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">No hay negocios con estos filtros</p>
              <button
                onClick={handleInjectData}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Cargar datos demo
              </button>
            </div>
          ) : (
            sortedFilteredBusinesses.map((biz) => {
              const priceLevel = getPriceBadge(biz);

              return (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex flex-row items-center gap-3 cursor-pointer"
                >
                  {/* Left: Square Thumbnail Image */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={biz.bannerImage}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {biz.logo && (
                      <div
                        className="absolute bottom-1 left-1 w-5 h-5 rounded-md flex items-center justify-center text-[10px] shadow-xs border border-white"
                        style={{ backgroundColor: biz.customPinColor || '#00D222' }}
                      >
                        {biz.logo}
                      </div>
                    )}
                  </div>

                  {/* Right: Minimalist Business Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                    
                    {/* Line 1: Name and Rating */}
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {biz.name}
                      </h4>
                      <div className="flex items-center gap-0.5 text-slate-700 text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{biz.rating}</span>
                      </div>
                    </div>

                    {/* Line 2: Distance and Time (e.g. 0.3 km   ⏱ 25 min) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-emerald-700">{biz.distanceKm} km</span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {biz.deliveryTime}
                      </span>
                    </div>

                    {/* Line 3: Delivery Status + Price Pill ($ Bajo / $$ Medio) */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>Delivery o Retiro</span>
                      </div>

                      {/* Clean Green Pill Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200/70">
                        {priceLevel}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* PRODUCTS & SERVICES HORIZONTAL LIST */
        <div className="space-y-2.5">
          {sortedFilteredProducts.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">No hay productos disponibles</p>
            </div>
          ) : (
            sortedFilteredProducts.map((prod) => {
              const inCartQty = cart.find((i) => i.product.id === prod.id)?.quantity || 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectBusiness(prod.business)}
                  className="bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex flex-row items-center gap-3 cursor-pointer"
                >
                  {/* Left: Square Product Photo */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {prod.isOfferOfTheDay && (
                      <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.2 rounded uppercase">
                        Oferta
                      </span>
                    )}
                  </div>

                  {/* Right: Clean Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                    
                    {/* Line 1: Name and Business */}
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {prod.name}
                      </h4>
                      <span className="text-sm font-extrabold text-slate-900 shrink-0">
                        ${prod.price} <span className="text-[10px] text-slate-500 font-normal">MXN</span>
                      </span>
                    </div>

                    {/* Line 2: Store & Distance */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="text-emerald-700 font-semibold truncate">{prod.business.name}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-medium text-emerald-700">{prod.distanceKm} km</span>
                    </div>

                    {/* Line 3: Delivery & Quick Add Button */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>Delivery</span>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(prod, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                          inCartQty > 0
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{inCartQty > 0 ? `(${inCartQty}) Listo` : 'Agregar'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => openWhatsAppWithPrompt(searchQuery || 'Hola, quiero consultar opciones cercanas a mi ubicación')}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-2xl transition-all shadow-2xs"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>¿No encuentras lo que buscas? Pídelo por WhatsApp IA</span>
        </button>
      </div>

    </div>
  );
};
