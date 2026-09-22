import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Store,
  Sparkles,
  ShoppingBag,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CorporatePortalHome: React.FC = () => {
  const {
    loginAsCorporate,
    openBusinessRegistration,
    navigateToRoute,
    getMarketplaceShareUrl,
    getCorporateShareUrl
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register_info'>('login');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState<'marketplace' | 'corporate' | null>(null);

  const handleCopy = (type: 'marketplace' | 'corporate') => {
    const url = type === 'marketplace' ? getMarketplaceShareUrl() : getCorporateShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Por favor ingresa usuario/correo y contraseña.');
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
      }
    }, 300);
  };

  const handleFillAdminMaster = () => {
    setIdentifier('admin_master');
    setPassword('Chevropar#1970');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4021D] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-900/40">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">CON FORCE</span>
                <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 text-[10px] font-bold border border-red-800">
                  PORTAL CORPORATIVO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Administración, Comercios y Patrocinadores</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToRoute('marketplace')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
              title="Ir a la tienda de clientes"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
              <span>Ir al Marketplace de Clientes</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Authentication Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col justify-center">
        {/* URL Separation Notification Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-900/60 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Rutas y Enlaces Personalizados Activos
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  El sistema cuenta con accesos independientes para clientes finales y para la gestión corporativa.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Marketplace Link Pill */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-700 px-3 py-1.5 rounded-xl text-xs">
                <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                <span className="text-zinc-400">Clientes:</span>
                <span className="font-mono text-zinc-200 font-medium">/marketplace</span>
                <button
                  onClick={() => handleCopy('marketplace')}
                  className="p-1 hover:text-white text-zinc-400 transition-colors ml-1"
                  title="Copiar link del Marketplace"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copiedLink === 'marketplace' && (
                  <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>
                )}
              </div>

              {/* Corporate Link Pill */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-700 px-3 py-1.5 rounded-xl text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                <span className="text-zinc-400">Admin/Negocios:</span>
                <span className="font-mono text-zinc-200 font-medium">/</span>
                <button
                  onClick={() => handleCopy('corporate')}
                  className="p-1 hover:text-white text-zinc-400 transition-colors ml-1"
                  title="Copiar link Corporativo"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copiedLink === 'corporate' && (
                  <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Branding and Business Invitation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-xs font-bold text-red-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Centro de Gestión & Alianzas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Control Maestro para <span className="text-[#D4021D]">Administradores</span> y <span className="text-white">Negocios</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Plataforma centralizada para la administración global de repuestos, gestión de pedidos en tiempo real, supervisión de inventario y afiliación de nuevos comercios aliados en Venezuela.
            </p>

            {/* Business Registration Callout Card */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">¿Tienes un Negocio o Taller Automotriz?</h3>
                  <p className="text-xs text-zinc-400">Regístrate como comercio aliado y empieza a vender hoy mismo.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Catálogo digital verificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pedidos por WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Geolocalización en mapa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cero comisiones ocultas</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openBusinessRegistration(false, false)}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span>Registrar Comercio / Taller</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => openBusinessRegistration(false, true)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400/30"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-200" />
                  <span>Registrarse como Patrocinador ⭐</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Corporate Login Form */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Acceso al Sistema</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Ingresa tus credenciales de Administrador o Negocio</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400">
                  <KeyRound className="w-5 h-5" />
                </div>
              </div>

              {/* Master Admin Helper Box */}
              <div className="mb-5 p-3.5 bg-red-950/40 border border-red-900/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-red-300">Credenciales Superadmin:</div>
                  <div className="font-mono text-zinc-300 text-[11px] mt-0.5">
                    Usuario: <strong className="text-white font-bold">admin_master</strong> | Clave: <strong className="text-white font-bold">Chevropar#1970</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFillAdminMaster}
                  className="px-2.5 py-1.5 bg-[#D4021D] hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Autocompletar
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Usuario o Correo Electrónico
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin_master o tu usuario de vendedor"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-black/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#D4021D] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <span>Ingresar al Panel de Control</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Customer Link Box */}
              <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
                <button
                  type="button"
                  onClick={() => navigateToRoute('marketplace')}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
                  <span>¿Eres cliente final? Ir a comprar repuestos al Marketplace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
