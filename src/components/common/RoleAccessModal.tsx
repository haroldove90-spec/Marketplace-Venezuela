import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShoppingBag, Store, ShieldCheck, X } from 'lucide-react';

interface RoleAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleAccessModal: React.FC<RoleAccessModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole, setActiveClientTab, setActiveSellerTab, setActiveAdminTab } = useApp();

  if (!isOpen) return null;

  const rolesConfig: { id: Role; name: string; icon: React.ReactNode; logo: string; color: string }[] = [
    {
      id: 'client',
      name: 'Cliente',
      icon: <ShoppingBag className="w-7 h-7 text-blue-400" />,
      logo: '🛒',
      color: 'from-blue-600/20 to-blue-900/30 border-blue-500/40'
    },
    {
      id: 'seller',
      name: 'Negocio / Vendedor',
      icon: <Store className="w-7 h-7 text-emerald-400" />,
      logo: '🏪',
      color: 'from-emerald-600/20 to-emerald-900/30 border-emerald-500/40'
    },
    {
      id: 'admin',
      name: 'Superadministrador',
      icon: <ShieldCheck className="w-7 h-7 text-purple-400" />,
      logo: '⚡',
      color: 'from-purple-600/20 to-purple-900/30 border-purple-500/40'
    }
  ];

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    if (role === 'client') setActiveClientTab('explore');
    if (role === 'seller') setActiveSellerTab('orders');
    if (role === 'admin') setActiveAdminTab('overview');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔀</span>
            <h3 className="font-extrabold text-base text-white">Cambiar de Rol</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 columns grid on mobile version */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {rolesConfig.map((item) => {
            const isSelected = currentRole === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectRole(item.id)}
                className={`relative flex flex-col items-center justify-center text-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-gradient-to-b ${item.color} ${
                  isSelected
                    ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/20 scale-[1.02]'
                    : 'hover:scale-[1.01] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Logo and Icon */}
                <div className="text-3xl mb-1.5">{item.logo}</div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-700/60 mb-2">
                  {item.icon}
                </div>

                {/* Role Name */}
                <span className="text-xs md:text-sm font-extrabold text-white tracking-wide">
                  {item.name}
                </span>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs mt-2"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
