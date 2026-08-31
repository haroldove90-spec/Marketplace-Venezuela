import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  ShoppingBag,
  Clock,
  User,
  LayoutDashboard,
  Store,
  Package,
  BarChart3,
  MessageSquare,
  DollarSign,
  Layers,
  Sparkles,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';

interface NavigationProps {
  onOpenRoleModal: () => void;
  onOpenCart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenRoleModal, onOpenCart }) => {
  const {
    currentRole,
    activeClientTab,
    setActiveClientTab,
    activeSellerTab,
    setActiveSellerTab,
    activeAdminTab,
    setActiveAdminTab,
    cartTotalCount,
    orders,
    currentSellerBusiness
  } = useApp();

  // Active pending orders count for badge
  const pendingOrdersCount = orders.filter(
    o => o.status === 'preparing' || o.status === 'ready' || o.status === 'on_the_way'
  ).length;

  // Desktop Left Sidebar navigation items by role
  const getSidebarNavItems = () => {
    switch (currentRole) {
      case 'seller':
        return [
          { id: 'orders', label: 'Pedidos en Vivo', icon: <Clock className="w-5 h-5" />, badge: pendingOrdersCount },
          { id: 'catalog', label: 'Catálogo e Inventario', icon: <Package className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil Comercial y GPS', icon: <Store className="w-5 h-5" /> },
          { id: 'stats', label: 'Métricas de Tienda', icon: <BarChart3 className="w-5 h-5" /> }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Dashboard General', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'sellers', label: 'Gestión de Negocios', icon: <Store className="w-5 h-5" /> },
          { id: 'whatsapp', label: 'WhatsApp & Bot IA', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'map', label: 'Mapa & Navegación', icon: <Layers className="w-5 h-5" /> },
          { id: 'finances', label: 'Finanzas & Comisiones', icon: <DollarSign className="w-5 h-5" /> }
        ];
      default:
        return [
          { id: 'explore', label: 'Vitrina de Tiendas', icon: <Compass className="w-5 h-5" /> },
          { id: 'map', label: 'Mapa de Cobertura', icon: <MapIcon className="w-5 h-5 text-emerald-600" /> },
          { id: 'orders', label: 'Mis Pedidos', icon: <Clock className="w-5 h-5" />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
          { id: 'account', label: 'Mi Cuenta & Direcciones', icon: <User className="w-5 h-5" /> },
          { id: 'roles_hub', label: 'Portal de Roles', icon: <Sparkles className="w-5 h-5 text-amber-400" /> }
        ];
    }
  };

  // Mobile Bottom Navigation Bar items
  const getMobileNavItems = () => {
    switch (currentRole) {
      case 'seller':
        return [
          { id: 'orders', label: 'Pedidos', icon: <Clock className="w-5 h-5" />, badge: pendingOrdersCount },
          { id: 'catalog', label: 'Catálogo', icon: <Package className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil GPS', icon: <Store className="w-5 h-5" /> },
          { id: 'roles_modal', label: 'Roles', icon: <Sparkles className="w-5 h-5 text-amber-400" /> }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'sellers', label: 'Sellers', icon: <Store className="w-5 h-5" /> },
          { id: 'whatsapp', label: 'WhatsApp IA', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'finances', label: 'Finanzas', icon: <DollarSign className="w-5 h-5" /> },
          { id: 'roles_modal', label: 'Roles', icon: <Sparkles className="w-5 h-5 text-amber-400" /> }
        ];
      default:
        return [
          { id: 'explore', label: 'Inicio', icon: <Compass className="w-5 h-5" /> },
          { id: 'map', label: 'Mapa', icon: <MapIcon className="w-5 h-5" /> },
          { id: 'cart_modal', label: 'Carrito', icon: <ShoppingBag className="w-5 h-5" />, badge: cartTotalCount },
          { id: 'orders', label: 'Pedidos', icon: <Clock className="w-5 h-5" /> },
          { id: 'account', label: 'Cuenta', icon: <User className="w-5 h-5" /> }
        ];
    }
  };

  const currentTab =
    currentRole === 'client'
      ? activeClientTab
      : currentRole === 'seller'
      ? activeSellerTab
      : activeAdminTab;

  const handleTabClick = (tabId: string) => {
    if (tabId === 'roles_modal') {
      onOpenRoleModal();
      return;
    }
    if (tabId === 'roles_hub') {
      onOpenRoleModal();
      return;
    }
    if (tabId === 'cart_modal') {
      onOpenCart();
      return;
    }

    if (currentRole === 'client') setActiveClientTab(tabId);
    if (currentRole === 'seller') setActiveSellerTab(tabId);
    if (currentRole === 'admin') setActiveAdminTab(tabId);
  };

  return (
    <>
      {/* 1. DESKTOP / FULLSCREEN LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-61px)] sticky top-[61px] bg-slate-50/90 backdrop-blur-xl border-r border-slate-200 p-4 shrink-0 overflow-y-auto no-scrollbar">
        {/* Role Selector Card in Sidebar */}
        <div className="mb-5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rol Activo
            </span>
            <button
              onClick={onOpenRoleModal}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
            >
              Cambiar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-2xl">
              {currentRole === 'client' ? '🛒' : currentRole === 'seller' ? '🏪' : '⚡'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">
                {currentRole === 'client'
                  ? 'Cliente Final'
                  : currentRole === 'seller'
                  ? currentSellerBusiness?.name || 'Vendedor'
                  : 'Superadministrador'}
              </p>
              <p className="text-[11px] text-slate-500">
                {currentRole === 'client'
                  ? 'Explorar & Comprar'
                  : currentRole === 'seller'
                  ? 'Farmacia / Restaurante'
                  : 'Control Total'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1 flex-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Módulos
          </span>

          {getSidebarNavItems().map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Pulso PWA v2.0</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En línea
          </span>
        </div>
      </aside>

      {/* 2. MOBILE & TABLET BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {getMobileNavItems().map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {/* Icon with badge */}
                <div className="relative p-1">
                  {item.icon}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Minimal legible label */}
                <span className="text-[10px] tracking-tight leading-none mt-0.5 font-medium">
                  {item.label}
                </span>

                {/* Active Indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

    </>
  );
};
