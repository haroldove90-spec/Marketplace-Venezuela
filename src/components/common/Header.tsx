import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PulsoLogo } from './PulsoLogo';
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
        return { name: 'Superadmin', icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, color: 'bg-white/10 border-white/20 text-white hover:bg-white/20' };
      case 'seller':
        return { name: 'Vendedor', icon: <Store className="w-4 h-4 text-[#D4021D]" />, color: 'bg-white/10 border-white/20 text-white hover:bg-white/20' };
      default:
        return { name: 'Cliente', icon: <User className="w-4 h-4 text-[#D4021D]" />, color: 'bg-white/10 border-white/20 text-white hover:bg-white/20' };
    }
  };

  const roleInfo = getRoleDisplay();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#000000] border-b border-white/10 px-3 md:px-6 py-2.5 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Brand & Role Switcher */}
        <div className="flex items-center gap-2 md:gap-4">
          <PulsoLogo size="md" textColor="text-white" />

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
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all text-left shadow-xs cursor-pointer"
            title="Actualizar mi ubicación GPS"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#D4021D] shrink-0" />
              <span className="truncate text-white font-medium text-[11px] md:text-xs">
                {userAddressLabel}
              </span>
            </div>
            <LocateFixed className={`w-3.5 h-3.5 text-white/60 hover:text-white shrink-0 ${isLocating ? 'animate-spin text-[#D4021D]' : ''}`} />
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* WhatsApp shortcut */}
          <button
            onClick={() => openWhatsAppWithPrompt()}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Asistente WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-[#D4021D]" />
            <span className="hidden md:inline">Bot IA</span>
          </button>

          {/* Install App Button (if not yet installed) */}
          {!isAppInstalled && (
            <button
              onClick={installPWA}
              className="hidden lg:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4021D]" />
              <span>Instalar App</span>
            </button>
          )}

          {/* Cart Button with Count Badge (Client role only) */}
          {currentRole === 'client' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 md:px-3.5 md:py-1.5 bg-[#D4021D] hover:bg-[#b50218] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D4021D]/30 transition-all active:scale-95 cursor-pointer"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Carrito</span>
              {cartTotalCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#D4021D] font-black text-[11px] flex items-center justify-center shadow-xs">
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

