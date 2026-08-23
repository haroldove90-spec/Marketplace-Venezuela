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
      icon: <ShoppingBag className="w-7 h-7 text-emerald-600" />,
      logo: '🛒',
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'seller',
      name: 'Negocio / Vendedor',
      icon: <Store className="w-7 h-7 text-emerald-600" />,
      logo: '🏪',
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'admin',
      name: 'Superadministrador',
      icon: <ShieldCheck className="w-7 h-7 text-purple-600" />,
      logo: '⚡',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔀</span>
            <h3 className="font-extrabold text-base text-slate-900">Cambiar de Rol</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
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
                className={`relative flex flex-col items-center justify-center text-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${item.color} ${
                  isSelected
                    ? 'ring-2 ring-[#00D222] shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'hover:scale-[1.01]'
                }`}
              >
                {/* Logo and Icon */}
                <div className="text-3xl mb-1.5">{item.logo}</div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 mb-2 shadow-xs">
                  {item.icon}
                </div>

                {/* Role Name */}
                <span className="text-xs md:text-sm font-extrabold text-slate-900 tracking-wide">
                  {item.name}
                </span>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>


        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs mt-2 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
