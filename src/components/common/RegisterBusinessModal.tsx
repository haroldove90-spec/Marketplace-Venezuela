import React, { useState } from 'react';
import {
  Building2,
  X,
  Store,
  MapPin,
  Phone,
  FileText,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RegisterBusinessModal: React.FC = () => {
  const {
    isRegisterBusinessModalOpen,
    setIsRegisterBusinessModalOpen,
    registerBusiness,
    upgradeClientToBusiness,
    currentUser
  } = useApp();

  const isClientLoggedIn = Boolean(currentUser && currentUser.role === 'client');

  // Business Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Repuestos Nuevos Chevrolet / Ford / Toyota');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [rifOrNit, setRifOrNit] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🏢');

  // Owner Form State (if not logged in as client)
  const [ownerName, setOwnerName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isRegisterBusinessModalOpen) return null;

  const handleClose = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsRegisterBusinessModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!businessName.trim()) {
      setErrorMsg('Por favor ingresa el nombre comercial de tu negocio.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Por favor especifica la dirección comercial de tu negocio.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Por favor ingresa el teléfono o WhatsApp de contacto de tu negocio.');
      return;
    }

    setIsSubmitting(true);

    if (isClientLoggedIn) {
      // Upgrade existing client
      const res = upgradeClientToBusiness({
        businessName,
        category,
        address,
        phone,
        rifOrNit,
        description,
        logo: selectedEmoji
      });

      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      // New business + new seller account
      if (!ownerName.trim()) {
        setIsSubmitting(false);
        setErrorMsg('Por favor ingresa el nombre del encargado o dueño.');
        return;
      }
      if (!username.trim()) {
        setIsSubmitting(false);
        setErrorMsg('Por favor define un nombre de usuario para el inicio de sesión.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setIsSubmitting(false);
        setErrorMsg('Por favor ingresa un correo electrónico válido.');
        return;
      }
      if (!password || password.length < 6) {
        setIsSubmitting(false);
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      const res = registerBusiness({
        businessName,
        category,
        address,
        phone,
        rifOrNit,
        description,
        logo: selectedEmoji,
        ownerName,
        username,
        email,
        password,
        ownerPhone: phone
      });

      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const EMOJI_OPTIONS = ['🏢', '🚗', '🔧', '⚙️', '🛞', '🔋', '🛡️', '📦', '🏁'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {isClientLoggedIn ? 'Dar de Alta Mi Negocio en el Marketplace' : 'Registro de Nuevo Negocio / Comercio Aliado'}
            </h3>
            <p className="text-sm text-gray-500">
              Vende tus repuestos, servicios o accesorios a miles de clientes en Venezuela.
            </p>
          </div>
        </div>

        {/* Existing Client Alert Banner */}
        {isClientLoggedIn && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-emerald-900">
                ¡Hola {currentUser?.name}!
              </span>
              <p className="text-emerald-700 mt-0.5">
                Ya tienes tu cuenta de cliente activa (<strong className="font-semibold">@{currentUser?.username}</strong>). Al completar este formulario, tu cuenta se habilitará como Comercio Aliado para gestionar tus productos y pedidos sin necesidad de crear otro usuario.
              </p>
            </div>
          </div>
        )}

        {/* Notification feedback */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION: Business Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-100">
              <Store className="w-4 h-4 text-red-600" />
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                1. Datos Comerciales del Negocio
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Nombre Comercial del Negocio / Taller *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Inversiones Chevropar C.A. / Taller Master Car"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Categoría o Rubro *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                >
                  <option value="Repuestos Nuevos Chevrolet / Ford / Toyota">Repuestos Nuevos Chevrolet / Ford / Toyota</option>
                  <option value="Frenos y Suspensión">Frenos y Suspensión</option>
                  <option value="Taller Mecánico & Escaneo">Taller Mecánico & Diagnóstico</option>
                  <option value="Baterías y Sistema Eléctrico">Baterías y Sistema Eléctrico</option>
                  <option value="Motores y Transmisión">Motores y Transmisión</option>
                  <option value="Autoperiquitos y Accesorios">Autoperiquitos y Accesorios</option>
                  <option value="Cauchos y Rines">Cauchos y Rines</option>
                  <option value="Lubricantes y Filtros">Lubricantes y Filtros</option>
                  <option value="Repuestos Multimarca">Repuestos Multimarca</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Teléfono / WhatsApp de Ventas *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+58 412 1234567 o +58 424 9998888"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Dirección Física de la Tienda o Taller *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Av. Francisco de Miranda, Local 4-A, Chacao, Caracas"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  RIF / Identificador Fiscal (Opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={rifOrNit}
                    onChange={(e) => setRifOrNit(e.target.value)}
                    placeholder="J-12345678-9"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Icono / Emoji del Negocio
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-xl p-1.5 rounded-lg border transition-all ${
                        selectedEmoji === emoji
                          ? 'border-red-500 bg-red-50 scale-110 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Descripción o Eslogan Comercial
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve reseña de los repuestos que distribuyes, años de experiencia o servicios de taller..."
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION: Owner Credentials (Only if not already logged in as client) */}
          {!isClientLoggedIn && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-100">
                <User className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  2. Datos del Propietario / Encargado (Para Iniciar Sesión)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Nombre Completo del Responsable *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Nombre de Usuario (@usuario) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="carlos_repuestos"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ventas@minegocio.com"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Contraseña de Acceso al Portal *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Registrando...' : (isClientLoggedIn ? 'Vincular y Activar Mi Negocio' : 'Registrar Negocio en Marketplace')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
