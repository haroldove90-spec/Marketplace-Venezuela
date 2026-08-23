import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShoppingBag, Store, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const RoleSwitcherHub: React.FC = () => {
  const { currentRole, setCurrentRole, setActiveClientTab, setActiveSellerTab, setActiveAdminTab } = useApp();

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    if (role === 'client') setActiveClientTab('explore');
    if (role === 'seller') setActiveSellerTab('orders');
    if (role === 'admin') setActiveAdminTab('overview');
  };

  const rolesConfig: { id: Role; name: string; icon: React.ReactNode; logo: string; color: string; badge: string }[] = [
    {
      id: 'client',
      name: 'Cliente',
      icon: <ShoppingBag className="w-8 h-8 text-blue-400" />,
      logo: '🛒',
      color: 'from-blue-600/30 to-blue-900/40 border-blue-500/40 hover:border-blue-400',
      badge: 'Usuario Final'
    },
    {
      id: 'seller',
      name: 'Negocio / Vendedor',
      icon: <Store className="w-8 h-8 text-emerald-400" />,
      logo: '🏪',
      color: 'from-emerald-600/30 to-emerald-900/40 border-emerald-500/40 hover:border-emerald-400',
      badge: 'Farmacia / Restaurante'
    },
    {
      id: 'admin',
      name: 'Superadministrador',
      icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
      logo: '⚡',
      color: 'from-purple-600/30 to-purple-900/40 border-purple-500/40 hover:border-purple-400',
      badge: 'Owner Plataforma'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Portal Multi-Rol
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Selecciona tu Rol de Acceso
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Marketplace geolocalizado en tiempo real
        </p>
      </div>

      {/* Grid: strictly 2 columns on mobile version, 3 columns on tablet/desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {rolesConfig.map((item) => {
          const isSelected = currentRole === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectRole(item.id)}
              className={`relative flex flex-col items-center justify-center text-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-gradient-to-b ${item.color} ${
                isSelected
                  ? 'ring-2 ring-blue-400 shadow-xl shadow-blue-500/20 scale-[1.02]'
                  : 'hover:scale-[1.01] hover:shadow-lg opacity-90 hover:opacity-100'
              }`}
            >
              {/* Logo / Icon */}
              <div className="text-4xl mb-2">{item.logo}</div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 mb-3 shadow-inner">
                {item.icon}
              </div>

              {/* Role Name only */}
              <span className="text-base md:text-lg font-bold text-white tracking-wide">
                {item.name}
              </span>

              {/* Minimal role badge */}
              <span className="mt-1 text-[11px] font-medium text-slate-300/80">
                {item.badge}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
