import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export const ClientAuthModal: React.FC = () => {
  const {
    isClientAuthModalOpen,
    setIsClientAuthModalOpen,
    setIsCorporateAuthModalOpen,
    clientAuthIntent,
    loginAsClient,
    registerClient
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    clientAuthIntent === 'register' ? 'register' : 'login'
  );

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isClientAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAsClient(loginIdentifier, loginPassword);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setIsClientAuthModalOpen(false);
        }, 800);
      }
    }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword || !regPhone.trim() || !regAddress.trim()) {
      setErrorMessage('Todos los campos son obligatorios para registrar tu cuenta de entrega.');
      return;
    }

    if (regPassword.length < 5) {
      setErrorMessage('La contraseña debe tener al menos 5 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerClient({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        address: regAddress
      });
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setIsClientAuthModalOpen(false);
        }, 800);
      }
    }, 400);
  };

  const fillQuickDemo = (username: string, pass: string) => {
    setActiveTab('login');
    setLoginIdentifier(username);
    setLoginPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-black via-zinc-900 to-[#D4021D]/30 p-6 border-b border-zinc-800 relative">
          <button
            onClick={() => setIsClientAuthModalOpen(false)}
            className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4021D] flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-black text-xl">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800/50">
                  Portal Cliente Con Force
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {activeTab === 'login' ? 'Iniciar Sesión en el Marketplace' : 'Crear Cuenta de Cliente'}
              </h2>
            </div>
          </div>

          {clientAuthIntent === 'order_checkout' && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
              <ShoppingBag className="w-4 h-4 shrink-0 text-red-400" />
              <span>Para completar tu pedido y activar el rastreo de entrega, inicia sesión o regístrate con tus datos.</span>
            </div>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 bg-black/40">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-sm font-bold text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'login'
                ? 'border-[#D4021D] text-white bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ya tengo cuenta (Ingresar)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-sm font-bold text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'register'
                ? 'border-[#D4021D] text-white bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Nuevo Cliente (Registrarme)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-700/50 rounded-xl flex items-center gap-2.5 text-xs text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-700/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Correo Electrónico o Usuario
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="ej. marialopez o maria.lopez@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
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
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu contraseña de cliente"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#D4021D] hover:bg-red-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verificando...</span>
                ) : (
                  <>
                    <span>Entrar a mi Cuenta de Cliente</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Clients */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                  Cuentas de Cliente Demo para pruebas rápidas:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('marialopez', 'Cliente#2026')}
                    className="p-2 text-left bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-white truncate">María Elena López</div>
                    <div className="text-[10px] text-zinc-400">marialopez (14 pedidos)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('carlosm', 'Carlos#2026')}
                    className="p-2 text-left bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-white truncate">Carlos Mendoza</div>
                    <div className="text-[10px] text-zinc-400">carlosm (8 pedidos)</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ej. Harold Anguiano"
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ej. haroldo_cli"
                    className="w-full px-3 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 5 letras"
                    className="w-full px-3 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Teléfono Móvil (para confirmación y WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Dirección de Entrega Principal *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
                  <textarea
                    rows={2}
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Calle, número exterior/interior, colonia, ciudad y referencias"
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4021D] transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#D4021D] hover:bg-red-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>Creando cuenta...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Crear mi Cuenta y Continuar</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer switch to Corporate login */}
          <div className="pt-3 border-t border-zinc-800 text-center">
            <button
              type="button"
              onClick={() => {
                setIsClientAuthModalOpen(false);
                setIsCorporateAuthModalOpen(true);
              }}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4021D]" />
              <span>¿Eres Administrador o Negocio? Accede al Portal Corporativo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
