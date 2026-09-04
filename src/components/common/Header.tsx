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
  ChevronDown,
  MessageCircle,
  Share2,
  Check,
  LogIn,
  LogOut,
  KeyRound,
  FileText
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenRoleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenRoleModal }) => {
  const {
    currentRole,
    currentUser,
    logout,
    cartTotalCount,
    userAddressLabel,
    detectUserLocation,
    isLocating,
    installPWA,
    isAppInstalled,
    openWhatsAppWithPrompt,
    setIsClientAuthModalOpen,
    setIsCorporateAuthModalOpen,
    getMarketplaceShareUrl
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleCopyClientLink = () => {
    const url = getMarketplaceShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const getRoleDisplay = () => {
    switch (currentRole) {
      case 'admin':
        return {
          name: 'Superadmin',
          icon: <ShieldCheck className="w-4 h-4 text-[#D4021D]" />,
          color: 'bg-red-950/40 border-red-800/60 text-red-200 hover:bg-red-950/70'
        };
      case 'seller':
        return {
          name: 'Negocio',
          icon: <Store className="w-4 h-4 text-zinc-300" />,
          color: 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
        };
      default:
        return {
          name: 'Marketplace',
          icon: <ShoppingBag className="w-4 h-4 text-[#D4021D]" />,
          color: 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        };
    }
  };

  const roleInfo = getRoleDisplay();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#000000] border-b border-zinc-800/80 px-3 md:px-6 py-2.5 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Brand & Role Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          <PulsoLogo size="md" textColor="text-white" />

          {/* Role Pill Button */}
          <button
            onClick={onOpenRoleModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${roleInfo.color}`}
            title="Cambiar vista o rol"
          >
            {roleInfo.icon}
            <span>{roleInfo.name}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {/* Share Marketplace Independent Link */}
          <button
            onClick={handleCopyClientLink}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              copiedLink
                ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                : 'bg-zinc-900/90 border-zinc-800 hover:border-red-900/60 text-zinc-300 hover:text-white'
            }`}
            title="Copiar link independiente para clientes (/marketplace)"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#D4021D]" />}
            <span className="text-[11px]">{copiedLink ? '¡Link Copiado!' : 'Link Cliente'}</span>
          </button>

          {/* Download Official PDF Features per Role */}
          <a
            href="/Con_Force_Caracteristicas_Por_Rol.pdf"
            download="Con_Force_Caracteristicas_Por_Rol.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border border-red-900/60 bg-red-950/40 hover:bg-red-900/60 text-red-200 hover:text-white transition-all shadow-xs cursor-pointer"
            title="Descargar Ficha Técnica PDF de Características por Rol"
          >
            <FileText className="w-3.5 h-3.5 text-[#D4021D]" />
            <span className="text-[11px]">PDF Roles</span>
            <Download className="w-3 h-3 text-red-300 opacity-80" />
          </a>
        </div>

        {/* Center: GPS Location Pill */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden sm:flex items-center">
          <button
            onClick={detectUserLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs text-white transition-all text-left shadow-xs cursor-pointer"
            title="Actualizar mi ubicación GPS"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#D4021D] shrink-0" />
              <span className="truncate text-zinc-200 font-medium text-[11px] md:text-xs">
                {userAddressLabel}
              </span>
            </div>
            <LocateFixed className={`w-3.5 h-3.5 text-zinc-400 hover:text-white shrink-0 ${isLocating ? 'animate-spin text-[#D4021D]' : ''}`} />
          </button>
        </div>

        {/* Right: Quick Actions & Auth */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          
          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-white font-semibold transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#D4021D] text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 text-xs text-white animate-fade-in"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div className="p-2 border-b border-zinc-800">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-zinc-400 text-[11px] truncate">@{currentUser.username}</p>
                    <div className="mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold border border-red-800 uppercase">
                        Rol: {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleCopyClientLink}
                      className="w-full text-left px-2.5 py-2 hover:bg-zinc-900 rounded-lg flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#D4021D]" />
                      <span>Copiar link clientes</span>
                    </button>
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-2.5 py-2 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-lg flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Client login button */}
              <button
                onClick={() => setIsClientAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
                title="Iniciar Sesión o Registrarme como Cliente"
              >
                <User className="w-3.5 h-3.5 text-[#D4021D]" />
                <span className="hidden sm:inline">Entrar / Registro</span>
                <span className="sm:hidden">Entrar</span>
              </button>

              {/* Corporate portal button */}
              <button
                onClick={() => setIsCorporateAuthModalOpen(true)}
                className="flex items-center gap-1 bg-red-950/40 hover:bg-red-950/70 border border-red-900/60 px-2 md:px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-300 transition-all cursor-pointer shadow-xs"
                title="Acceso Administrador y Negocios"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D4021D]" />
                <span className="hidden lg:inline">Admin / Negocio</span>
              </button>
            </div>
          )}

          {/* WhatsApp shortcut */}
          <button
            onClick={() => openWhatsAppWithPrompt()}
            className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 p-2 md:px-2.5 md:py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Asistente WhatsApp Oficial"
          >
            <MessageCircle className="w-4 h-4 text-[#D4021D]" />
            <span className="hidden xl:inline">Bot IA</span>
          </button>

          {/* Install App Button (if not yet installed) */}
          {!isAppInstalled && (
            <button
              onClick={installPWA}
              className="hidden 2xl:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4021D]" />
              <span>Instalar</span>
            </button>
          )}

          {/* Cart Button with Count Badge (Client role only) */}
          {currentRole === 'client' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 md:px-3 md:py-1.5 bg-[#D4021D] hover:bg-[#b50218] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-900/30 transition-all active:scale-95 cursor-pointer"
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
