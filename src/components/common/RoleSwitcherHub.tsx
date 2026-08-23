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
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      logo: '🛒',
      color: 'bg-blue-50/90 border-blue-200 hover:border-blue-400 text-slate-900',
      badge: 'Usuario Final'
    },
    {
      id: 'seller',
      name: 'Negocio / Vendedor',
      icon: <Store className="w-8 h-8 text-emerald-600" />,
      logo: '🏪',
      color: 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-400 text-slate-900',
      badge: 'Farmacia / Restaurante'
    },
    {
      id: 'admin',
      name: 'Superadministrador',
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
      logo: '⚡',
      color: 'bg-purple-50/90 border-purple-200 hover:border-purple-400 text-slate-900',
      badge: 'Owner Plataforma'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 bg-white">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Portal Multi-Rol
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Selecciona tu Rol de Acceso
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Pulso · Plataforma geolocalizada en tiempo real
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
              className={`relative flex flex-col items-center justify-center text-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${item.color} ${
                isSelected
                  ? 'ring-2 ring-blue-600 shadow-lg shadow-blue-500/15 scale-[1.02]'
                  : 'hover:scale-[1.01] hover:shadow-md'
              }`}
            >
              {/* Logo / Icon */}
              <div className="text-4xl mb-2">{item.logo}</div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 mb-3 shadow-xs">
                {item.icon}
              </div>

              {/* Role Name only */}
              <span className="text-base md:text-lg font-bold text-slate-900 tracking-wide">
                {item.name}
              </span>

              {/* Minimal role badge */}
              <span className="mt-1 text-[11px] font-semibold text-slate-600">
                {item.badge}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
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
