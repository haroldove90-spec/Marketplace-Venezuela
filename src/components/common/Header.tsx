import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  LocateFixed,
  ShoppingBag,
  Download,
  Store,
  ShieldCheck,
  User,
  Sparkles,
  ChevronDown,
  Search,
  MessageCircle
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenRoleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenRoleModal }) => {
  const {
    currentRole,
    cartTotalCount,
    userLocation,
    userAddressLabel,
    detectUserLocation,
    isLocating,
    installPWA,
    isAppInstalled,
    openWhatsAppWithPrompt
  } = useApp();

  const getRoleDisplay = () => {
    switch (currentRole) {
      case 'admin':
        return { name: 'Superadmin', icon: <ShieldCheck className="w-4 h-4 text-purple-600" />, color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' };
      case 'seller':
        return { name: 'Vendedor', icon: <Store className="w-4 h-4 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' };
      default:
        return { name: 'Cliente', icon: <User className="w-4 h-4 text-blue-600" />, color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' };
    }
  };

  const roleInfo = getRoleDisplay();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-3 md:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Brand & Role Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-md shadow-blue-500/20">
              ⚡
            </div>
            <div className="hidden sm:block">
              <span className="text-base md:text-lg font-black tracking-tight text-slate-900">
                Pulso
              </span>
              <span className="block text-[10px] text-blue-600 font-semibold leading-none">
                Farmacias & Restaurantes
              </span>
            </div>
          </div>

          {/* Role Pill Button */}
          <button
            onClick={onOpenRoleModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${roleInfo.color}`}
          >
            {roleInfo.icon}
            <span>{roleInfo.name}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
        </div>

        {/* Center: GPS Location Pill */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden sm:flex items-center">
          <button
            onClick={detectUserLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-all text-left shadow-xs"
            title="Actualizar mi ubicación GPS"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate text-slate-900 font-medium text-[11px] md:text-xs">
                {userAddressLabel}
              </span>
            </div>
            <LocateFixed className={`w-3.5 h-3.5 text-slate-400 hover:text-blue-600 shrink-0 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* WhatsApp shortcut */}
          <button
            onClick={() => openWhatsAppWithPrompt()}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            title="Asistente WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Bot IA</span>
          </button>

          {/* Install App Button (if not yet installed) */}
          {!isAppInstalled && (
            <button
              onClick={installPWA}
              className="hidden lg:flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
          )}

          {/* Cart Button with Count Badge (Client role only) */}
          {currentRole === 'client' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 md:px-3.5 md:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all active:scale-95"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Carrito</span>
              {cartTotalCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
