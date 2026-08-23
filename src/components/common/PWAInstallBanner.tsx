import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const {
    installPWA,
    isAppInstalled,
    showInstallBanner,
    setShowInstallBanner,
    locationPermissionStatus,
    detectUserLocation
  } = useApp();

  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isAppInstalled || !showInstallBanner) return null;

  return (
    <>
      {/* Top Banner on Mobile / Tablet */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0 shadow-inner">
            📲
          </div>
          <div className="min-w-0">
            <p className="font-bold truncate text-white">Instala Pulso en tu Celular</p>
            <p className="text-[11px] text-blue-100 truncate">Acceso rápido, mapa GPS y WhatsApp</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              // Check if iOS
              const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
              if (isIos) {
                setShowIosGuide(true);
              } else {
                installPWA();
              }
            }}
            className="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-bold px-3 py-1.5 rounded-xl shadow transition-all active:scale-95 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>

          <button
            onClick={() => setShowInstallBanner(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Instalar en iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Toca el botón Compartir</p>
                  <p className="text-slate-500">En la barra inferior de Safari <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Selecciona "Añadir a pantalla de inicio"</p>
                  <p className="text-slate-500">Desplaza hacia abajo en las opciones <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Toca "Añadir"</p>
                  <p className="text-slate-500">¡Listo! La App quedará instalada como nativa.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
