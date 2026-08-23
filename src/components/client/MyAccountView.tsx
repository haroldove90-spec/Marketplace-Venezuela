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
    <div className="max-w-4xl mx-auto px-3 md:px-6 py-4 space-y-6 pb-24 md:pb-12 bg-white">
      {/* Profile Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-emerald-600/25">
            👤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-slate-900">Carlos Mendoza</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Cliente PWA
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+52 55 8912 3456</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRoleModal}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          Cambiar Rol
        </button>
      </div>

      {/* Geolocation Permissions & GPS Status */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Geolocalización del Dispositivo</h3>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              locationPermissionStatus === 'granted'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {locationPermissionStatus === 'granted' ? 'GPS Activo' : 'GPS Pendiente'}
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Ubicación actual: <span className="text-slate-900 font-semibold">{userAddressLabel}</span>
          {userLocation && (
            <span className="text-slate-400 font-mono text-[11px] block mt-0.5">
              (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)})
            </span>
          )}
        </p>

        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detectando GPS...' : 'Actualizar Coordenadas Reales'}</span>
        </button>
      </div>

      {/* Frequent Saved Addresses */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Direcciones Frecuentes</h3>
            <p className="text-xs text-slate-500">Guarda tus destinos para pedidos rápidos</p>
          </div>

          <button
            onClick={() => setShowAddAddressModal(true)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>

        <div className="space-y-2">
          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-xs">
                  <Building className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs">{addr.label}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{addr.address}</p>
                </div>
              </div>

              <button
                onClick={() => deleteSavedAddress(addr.id)}
                className="text-slate-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                title="Eliminar dirección"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PWA Mobile Native Status */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Instalación PWA</h3>
            <p className="text-xs text-slate-500">Aplicación móvil nativa en pantalla completa</p>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              isAppInstalled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {isAppInstalled ? 'Instalada' : 'Web / Lista'}
          </span>
        </div>

        {!isAppInstalled && (
          <button
            onClick={installPWA}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Aplicación en mi Teléfono</span>
          </button>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Nueva Dirección Frecuente</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  Etiqueta (Ej. Casa, Trabajo, Mamá)
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ej. Casa de campo 🏡"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  Dirección Completa
                </label>
                <textarea
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  placeholder="Calle, número exterior/interior, colonia, referencias..."
                  rows={3}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 resize-none focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
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
