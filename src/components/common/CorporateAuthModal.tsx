import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Building2,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const CorporateAuthModal: React.FC = () => {
  const {
    isCorporateAuthModalOpen,
    setIsCorporateAuthModalOpen,
    setIsClientAuthModalOpen,
    loginAsCorporate
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCorporateAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Por favor ingresa usuario/correo y tu contraseña.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAsCorporate(identifier, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setIsCorporateAuthModalOpen(false);
        }, 800);
      }
    }, 350);
  };

  const autoFillCredentials = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-br from-black via-zinc-900 to-red-950/40 p-6 border-b border-zinc-800 relative">
          <button
            onClick={() => setIsCorporateAuthModalOpen(false)}
            className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4021D] flex items-center justify-center text-white shadow-xl shadow-red-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/50 text-[11px] font-bold text-red-300 uppercase tracking-wider">
                Acceso Unificado
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                Portal Corporativo Con Force
              </h2>
              <p className="text-xs text-zinc-400">
                Acceso exclusivo para Administradores de Sistema y Comercios Afiliados
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-950/80 border border-red-700/60 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ej. haroldo90, anyel_admin o contacto@sanrafael.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#D4021D] hover:bg-red-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Validar Credenciales y Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Preset Credentials Box */}
          <div className="p-4 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Credenciales del Sistema (1-Clic para probar):
              </span>
              <span className="text-[10px] text-zinc-400">Clic para rellenar</span>
            </div>

            <div className="space-y-2">
              {/* Harold */}
              <button
                type="button"
                onClick={() => autoFillCredentials('haroldo90', 'Chevropar#1970')}
                className="w-full p-2.5 text-left bg-black/60 hover:bg-black/90 border border-red-900/40 hover:border-red-600 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      Harold Anguiano Morales
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-950 text-red-300 text-[9px] font-bold rounded border border-red-800">
                      Superadmin (Acceso Total)
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Usuario: <span className="text-zinc-300 font-mono">haroldo90</span> | Clave: <span className="text-zinc-300 font-mono">Chevropar#1970</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors shrink-0" />
              </button>

              {/* Anyel */}
              <button
                type="button"
                onClick={() => autoFillCredentials('anyel_admin', 'AnyelForce#2026!')}
                className="w-full p-2.5 text-left bg-black/60 hover:bg-black/90 border border-red-900/40 hover:border-red-600 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      Anyel
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-950 text-red-300 text-[9px] font-bold rounded border border-red-800">
                      Admin Operaciones (Acceso Total)
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Usuario: <span className="text-zinc-300 font-mono">anyel_admin</span> | Clave: <span className="text-zinc-300 font-mono">AnyelForce#2026!</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors shrink-0" />
              </button>

              {/* Business Seller Demo */}
              <button
                type="button"
                onClick={() => autoFillCredentials('farmacia_sanrafael', 'SanRafael#2026')}
                className="w-full p-2.5 text-left bg-black/60 hover:bg-black/90 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                      Farmacia San Rafael Express
                    </span>
                    <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-bold rounded border border-zinc-700">
                      Rol Negocio (Exclusivo)
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Usuario: <span className="text-zinc-300 font-mono">farmacia_sanrafael</span> | Clave: <span className="text-zinc-300 font-mono">SanRafael#2026</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
              </button>
            </div>
          </div>

          {/* Switch to Client Modal */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsCorporateAuthModalOpen(false);
                setIsClientAuthModalOpen(true);
              }}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer font-medium"
            >
              ¿Eres un Cliente comprador? Inicia sesión o regístrate en el Portal de Clientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
