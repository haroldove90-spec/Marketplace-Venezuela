import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavedAddress } from '../../types';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Phone,
  ShieldCheck,
  LocateFixed,
  Download,
  Sparkles,
  CheckCircle2,
  Building
} from 'lucide-react';

interface MyAccountViewProps {
  onOpenRoleModal: () => void;
}

export const MyAccountView: React.FC<MyAccountViewProps> = ({ onOpenRoleModal }) => {
  const {
    userLocation,
    userAddressLabel,
    detectUserLocation,
    isLocating,
    locationPermissionStatus,
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    installPWA,
    isAppInstalled
  } = useApp();

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');

  const handleSaveAddress = () => {
    if (!newLabel.trim() || !newAddressText.trim()) return;
    addSavedAddress({
      label: newLabel.trim(),
      address: newAddressText.trim(),
      coordinates: userLocation || { lat: 19.4120, lng: -99.1650 },
      isDefault: false
    });
    setNewLabel('');
    setNewAddressText('');
    setShowAddAddressModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-6 py-4 space-y-6 pb-24 md:pb-12">
      {/* Profile Header */}
      <div className="p-5 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-950/50 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30">
            👤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white">Carlos Mendoza</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                Cliente PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>+52 55 8912 3456</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRoleModal}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow shrink-0"
        >
          Cambiar Rol
        </button>
      </div>

      {/* Geolocation Permissions & GPS Status */}
      <div className="p-4 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Geolocalización del Dispositivo</h3>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              locationPermissionStatus === 'granted'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {locationPermissionStatus === 'granted' ? 'GPS Activo' : 'GPS Pendiente'}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Ubicación actual: <span className="text-white font-medium">{userAddressLabel}</span>
          {userLocation && (
            <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
              (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)})
            </span>
          )}
        </p>

        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all active:scale-95"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detectando GPS...' : 'Actualizar Coordenadas Reales'}</span>
        </button>
      </div>

      {/* Frequent Saved Addresses */}
      <div className="p-4 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Direcciones Frecuentes</h3>
            <p className="text-xs text-slate-400">Guarda tus destinos para pedidos rápidos</p>
          </div>

          <button
            onClick={() => setShowAddAddressModal(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>

        <div className="space-y-2">
          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                  <Building className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-xs">{addr.label}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{addr.address}</p>
                </div>
              </div>

              <button
                onClick={() => deleteSavedAddress(addr.id)}
                className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                title="Eliminar dirección"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PWA Mobile Native Status */}
      <div className="p-4 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Instalación PWA</h3>
            <p className="text-xs text-slate-400">Aplicación móvil nativa en pantalla completa</p>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              isAppInstalled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}
          >
            {isAppInstalled ? 'Instalada' : 'Web / Lista'}
          </span>
        </div>

        {!isAppInstalled && (
          <button
            onClick={installPWA}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Aplicación en mi Teléfono</span>
          </button>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Nueva Dirección Frecuente</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold">
                  Etiqueta (Ej. Casa, Trabajo, Mamá)
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ej. Casa de campo 🏡"
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold">
                  Dirección Completa
                </label>
                <textarea
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  placeholder="Calle, número exterior/interior, colonia, referencias..."
                  rows={3}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold"
              >
                Guardar Dirección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
