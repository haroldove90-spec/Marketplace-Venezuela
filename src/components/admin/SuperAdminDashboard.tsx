import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, BusinessCategory, WhatsAppCampaign } from '../../types';
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  Layers,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  TrendingUp,
  Users,
  Send,
  Link,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Search,
  Check,
  Navigation,
  Flame,
  Radio,
  FileCheck
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    businesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    orders,
    products,
    campaigns,
    addCampaign,
    chatbotConfig,
    updateChatbotConfig,
    activeAdminTab,
    setActiveAdminTab
  } = useApp();

  // Metrics Calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveryOrdersCount = orders.filter((o) => o.deliveryType === 'delivery').length;
  const pickupOrdersCount = orders.filter((o) => o.deliveryType === 'pickup').length;
  const activeSellersCount = businesses.filter((b) => b.isActive).length;
  const totalBotInteractions = 1420 + orders.length * 12;

  // Seller CRUD States
  const [showAddBizModal, setShowAddBizModal] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCategory, setNewBizCategory] = useState<BusinessCategory>('farmacia');
  const [newBizLogo, setNewBizLogo] = useState('💊');
  const [newBizPhone, setNewBizPhone] = useState('+52 55 0000 0000');
  const [newBizAddress, setNewBizAddress] = useState('');
  const [newBizLat, setNewBizLat] = useState(19.4120);
  const [newBizLng, setNewBizLng] = useState(-99.1650);
  const [newBizPinColor, setNewBizPinColor] = useState('#2563eb');
  const [newBizCommission, setNewBizCommission] = useState(10);
  const [newBizHours, setNewBizHours] = useState('08:00 AM - 10:00 PM');

  // WhatsApp Campaign States
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignMsg, setCampaignMsg] = useState('');
  const [campaignAudience, setCampaignAudience] = useState<'all' | 'farmacias_users' | 'food_users'>('all');
  const [campaignSentToast, setCampaignSentToast] = useState(false);

  // Chatbot Config States
  const [metaToken, setMetaToken] = useState(chatbotConfig.metaApiToken);
  const [phoneId, setPhoneId] = useState(chatbotConfig.phoneNumberId);
  const [welcomeText, setWelcomeText] = useState(chatbotConfig.welcomeMessage);
  const [featuredOffer, setFeaturedOffer] = useState(chatbotConfig.featuredOfferId);
  const [newKeyword, setNewKeyword] = useState('');
  const [newKeywordCat, setNewKeywordCat] = useState<BusinessCategory>('farmacia');
  const [newKeywordTag, setNewKeywordTag] = useState('');

  // Deep Link Generator
  const [deepLinkBizId, setDeepLinkBizId] = useState(businesses[0]?.id || '');
  const [deepLinkProdId, setDeepLinkProdId] = useState('');
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);

  // Deep Link URL builder
  const generatedDeepLink = `${window.location.origin}/?view=business&id=${deepLinkBizId}${deepLinkProdId ? `&product=${deepLinkProdId}` : ''}`;

  const handleCopyDeepLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedDeepLink);
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2000);
    }
  };

  // Business Save
  const handleSaveBusiness = () => {
    if (!newBizName.trim()) return;

    if (editingBiz) {
      updateBusiness(editingBiz.id, {
        name: newBizName.trim(),
        category: newBizCategory,
        logo: newBizLogo,
        phone: newBizPhone,
        address: newBizAddress,
        coordinates: { lat: Number(newBizLat), lng: Number(newBizLng) },
        customPinColor: newBizPinColor,
        commissionRate: Number(newBizCommission),
        openingHours: newBizHours
      });
    } else {
      addBusiness({
        name: newBizName.trim(),
        category: newBizCategory,
        logo: newBizLogo,
        bannerImage:
          newBizCategory === 'farmacia'
            ? 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60'
            : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60',
        phone: newBizPhone,
        address: newBizAddress || 'Av. Principal 100, Centro',
        coordinates: { lat: Number(newBizLat), lng: Number(newBizLng) },
        openingHours: newBizHours,
        rating: 5.0,
        reviewsCount: 1,
        isVerified: true,
        isActive: true,
        commissionRate: Number(newBizCommission),
        customPinColor: newBizPinColor,
        deliveryTime: '20-35 min',
        minOrder: 100,
        tags: [newBizCategory]
      });
    }

    setShowAddBizModal(false);
  };

  const openAddBizModal = () => {
    setEditingBiz(null);
    setNewBizName('');
    setNewBizCategory('farmacia');
    setNewBizLogo('💊');
    setNewBizPhone('+52 55 1234 5678');
    setNewBizAddress('');
    setNewBizLat(19.4120);
    setNewBizLng(-99.1650);
    setNewBizPinColor('#2563eb');
    setNewBizCommission(10);
    setNewBizHours('08:00 AM - 10:00 PM');
    setShowAddBizModal(true);
  };

  const openEditBizModal = (b: Business) => {
    setEditingBiz(b);
    setNewBizName(b.name);
    setNewBizCategory(b.category);
    setNewBizLogo(b.logo);
    setNewBizPhone(b.phone);
    setNewBizAddress(b.address);
    setNewBizLat(b.coordinates.lat);
    setNewBizLng(b.coordinates.lng);
    setNewBizPinColor(b.customPinColor || '#2563eb');
    setNewBizCommission(b.commissionRate);
    setNewBizHours(b.openingHours);
    setShowAddBizModal(true);
  };

  // Broadcast campaign send
  const handleSendCampaign = () => {
    if (!campaignTitle.trim() || !campaignMsg.trim()) return;

    addCampaign({
      title: campaignTitle.trim(),
      message: campaignMsg.trim(),
      targetAudience: campaignAudience,
      status: 'sent'
    });

    setCampaignTitle('');
    setCampaignMsg('');
    setCampaignSentToast(true);
    setTimeout(() => setCampaignSentToast(false), 3000);
  };

  // Add Keyword
  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !newKeywordTag.trim()) return;
    updateChatbotConfig({
      customKeywords: [
        ...chatbotConfig.customKeywords,
        {
          keyword: newKeyword.trim().toLowerCase(),
          category: newKeywordCat,
          targetTag: newKeywordTag.trim().toLowerCase()
        }
      ]
    });
    setNewKeyword('');
    setNewKeywordTag('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 space-y-6 pb-24 md:pb-12">
      
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950/40 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-600/30">
            ⚡
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-white">
              Superadministrador (Owner)
            </h1>
            <p className="text-xs text-slate-400">
              Panel de control global, WhatsApp Business API y Finanzas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Meta API Online
          </span>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard General', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'sellers', label: `Gestión de Negocios (${businesses.length})`, icon: <Store className="w-4 h-4" /> },
          { id: 'whatsapp', label: 'WhatsApp & Bot IA', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'map', label: 'Mapa & Navegación', icon: <Layers className="w-4 h-4" /> },
          { id: 'finances', label: 'Finanzas & Comisiones', icon: <DollarSign className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAdminTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. DASHBOARD GENERAL */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ventas Globales
              </span>
              <p className="text-xl md:text-2xl font-black text-emerald-400">
                ${totalSales.toLocaleString()} MXN
              </p>
              <span className="text-[10px] text-slate-500 block">
                {orders.length} pedidos procesados
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Sellers Activos
              </span>
              <p className="text-xl md:text-2xl font-black text-blue-400">
                {activeSellersCount} Negocios
              </p>
              <span className="text-[10px] text-slate-500 block">
                {businesses.filter((b) => b.category === 'farmacia').length} Farmacias · {businesses.filter((b) => b.category === 'restaurante').length} Restaurantes
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Modalidad Entregas
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-purple-400">🛵 {deliveryOrdersCount} Domicilio</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-amber-400">🏬 {pickupOrdersCount} Recojo</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Ratio 70/30</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Chats WhatsApp IA
              </span>
              <p className="text-xl md:text-2xl font-black text-purple-400">
                {totalBotInteractions} Chats
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block">
                94.2% Apertura · 38% Clicks
              </span>
            </div>
          </div>

          {/* Quick Deep Link & Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Oferta del Día Destacada Global
              </h3>
              {(() => {
                const offerProd = products.find((p) => p.isOfferOfTheDay) || products[0];
                const offerBiz = businesses.find((b) => b.id === offerProd?.businessId);
                return (
                  <div className="flex gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <img
                      src={offerProd.image}
                      alt={offerProd.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">
                        Destacada en WhatsApp
                      </span>
                      <h4 className="font-bold text-white text-xs">{offerProd.name}</h4>
                      <p className="text-xs text-emerald-400 font-extrabold">
                        ${offerProd.price} MXN · {offerBiz?.name}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Última Campaña Masiva WhatsApp
              </h3>
              {campaigns[0] && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span className="truncate">{campaigns[0].title}</span>
                    <span className="text-emerald-400 shrink-0">{campaigns[0].sentCount} envíos</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {campaigns[0].message}
                  </p>
                  <div className="flex gap-3 text-[10px] text-slate-500 font-mono pt-1">
                    <span>Apertura: {campaigns[0].openRate}%</span>
                    <span>Clicks: {campaigns[0].clickRate}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. GESTIÓN DE NEGOCIOS (SELLERS) */}
      {activeAdminTab === 'sellers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Gestión de Negocios y Validación</h3>
              <p className="text-xs text-slate-400">
                Alta, edición, comisiones y asignación de pines con logos personalizados
              </p>
            </div>

            <button
              onClick={openAddBizModal}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Negocio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: biz.customPinColor || '#2563eb' }}
                      >
                        {biz.logo}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                          {biz.category}
                        </span>
                        <h4 className="font-bold text-white text-sm line-clamp-1 mt-0.5">
                          {biz.name}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => updateBusiness(biz.id, { isActive: !biz.isActive })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        biz.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {biz.isActive ? 'Activo' : 'Pausado'}
                    </button>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <p className="line-clamp-1">📍 {biz.address}</p>
                    <p>📞 {biz.phone}</p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Pin GPS: [{biz.coordinates.lat.toFixed(4)}, {biz.coordinates.lng.toFixed(4)}]
                    </p>
                    <div className="flex items-center justify-between text-slate-300 font-semibold pt-1">
                      <span>Comisión Plataforma:</span>
                      <span className="text-purple-400">{biz.commissionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {biz.isVerified ? '✓ Validado' : '⏳ Pendiente'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditBizModal(biz)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBusiness(biz.id)}
                      className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-red-400 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MÓDULO WHATSAPP & CHATBOT IA */}
      {activeAdminTab === 'whatsapp' && (
        <div className="space-y-6">
          {/* Section A: Meta Cloud API Config */}
          <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Configuración API Oficial WhatsApp Business (Meta Cloud API / WATI)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg uppercase">
                Conectado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Meta Access Token (Bearer)
                </label>
                <input
                  type="password"
                  value={metaToken}
                  onChange={(e) => setMetaToken(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Phone Number ID (WABA)
                </label>
                <input
                  type="text"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Webhook Verify Token
                </label>
                <input
                  type="text"
                  value={chatbotConfig.webhookVerifyToken}
                  readOnly
                  className="w-full mt-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-400 font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateChatbotConfig({ metaApiToken: metaToken, phoneNumberId: phoneId });
                alert('Configuración de WhatsApp guardada.');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow"
            >
              Guardar Credenciales Meta
            </button>
          </div>

          {/* Section B: Chatbot Control Panel & Deep Link Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Welcome & Featured Offer */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Panel de Control del Chatbot
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Mensaje de Bienvenida Automatizado
                  </label>
                  <textarea
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    rows={3}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Oferta del Día Promocionada en el Bot
                  </label>
                  <select
                    value={featuredOffer}
                    onChange={(e) => setFeaturedOffer(e.target.value)}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ${p.price} MXN
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    updateChatbotConfig({
                      welcomeMessage: welcomeText,
                      featuredOfferId: featuredOffer
                    });
                    alert('Panel del Bot actualizado.');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Actualizar Mensajes del Bot
                </button>
              </div>
            </div>

            {/* Deep Link Generator */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Link className="w-4 h-4 text-blue-400" />
                Generador Automático de Deep Links
              </h3>
              <p className="text-xs text-slate-400">
                Enlaces dinámicos que abren la web PWA directo en el negocio o producto.
              </p>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 uppercase text-[10px] font-bold">
                      Negocio Destino
                    </label>
                    <select
                      value={deepLinkBizId}
                      onChange={(e) => setDeepLinkBizId(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase text-[10px] font-bold">
                      Producto (Opcional)
                    </label>
                    <select
                      value={deepLinkProdId}
                      onChange={(e) => setDeepLinkProdId(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="">Todo el Catálogo</option>
                      {products
                        .filter((p) => p.businessId === deepLinkBizId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-blue-400">
                  <span className="truncate">{generatedDeepLink}</span>
                  <button
                    onClick={handleCopyDeepLink}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-sans text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    {copiedDeepLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDeepLink ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: WhatsApp Mass Campaign Manager */}
          <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">
                  Gestor de Campañas Masivas & Promociones
                </h3>
              </div>

              {campaignSentToast && (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30">
                  ✓ Campaña Enviada con Éxito
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="Ej. Fin de semana 30% OFF Burgers"
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Audiencia Objetivo
                </label>
                <select
                  value={campaignAudience}
                  onChange={(e) => setCampaignAudience(e.target.value as any)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="all">Todos los Usuarios Registrados</option>
                  <option value="farmacias_users">Clientes de Farmacias</option>
                  <option value="food_users">Clientes de Comida / Restaurantes</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Mensaje del Broadcast
                </label>
                <textarea
                  value={campaignMsg}
                  onChange={(e) => setCampaignMsg(e.target.value)}
                  placeholder="Escribe el mensaje con emojis y enlaces deep link..."
                  rows={3}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSendCampaign}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Campaña Masiva WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MAPA & NAVEGACIÓN */}
      {activeAdminTab === 'map' && (
        <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl max-w-3xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Configuración de Capas del Mapa & Navegación Externa
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Integración con Google Maps</h4>
                  <p className="text-slate-400 text-[11px]">
                    Permite a los usuarios trazar rutas en tiempo real mediante deeplink
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">
                  Habilitado
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Integración con Waze</h4>
                  <p className="text-slate-400 text-[11px]">
                    Lanza navegación directa por tráfico en la app oficial de Waze
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 font-bold rounded">
                  Habilitado
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Radio Máximo de Cobertura Geográfica</h4>
                  <p className="text-slate-400 text-[11px]">
                    Límite en kilómetros para mostrar negocios y calcular envíos
                  </p>
                </div>
                <span className="font-black text-blue-400 text-sm">15 KM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FINANZAS & COMISIONES */}
      {activeAdminTab === 'finances' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Volumen Total Transaccionado
              </span>
              <p className="text-2xl font-black text-white">${totalSales} MXN</p>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Comisiones de Plataforma (Prom. 10%)
              </span>
              <p className="text-2xl font-black text-purple-400">
                ${Math.round(totalSales * 0.1)} MXN
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Liquidaciones Pendientes a Negocios
              </span>
              <p className="text-2xl font-black text-emerald-400">
                ${Math.round(totalSales * 0.9)} MXN
              </p>
            </div>
          </div>

          {/* Breakdown per seller table */}
          <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-base">
              Balance y Comisiones por Negocio (Sellers)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Negocio</th>
                    <th className="pb-3">Categoría</th>
                    <th className="pb-3">Comisión</th>
                    <th className="pb-3">Ventas</th>
                    <th className="pb-3">Comisión Ganada</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {businesses.map((b) => {
                    const bizSales = orders
                      .filter((o) => o.businessId === b.id)
                      .reduce((sum, o) => sum + o.total, 0);
                    const commissionAmount = Math.round((bizSales * b.commissionRate) / 100);

                    return (
                      <tr key={b.id} className="text-slate-200">
                        <td className="py-3 font-bold flex items-center gap-2">
                          <span>{b.logo}</span>
                          <span>{b.name}</span>
                        </td>
                        <td className="py-3 capitalize text-slate-400">{b.category}</td>
                        <td className="py-3 font-mono font-bold text-purple-400">
                          {b.commissionRate}%
                        </td>
                        <td className="py-3 font-bold">${bizSales} MXN</td>
                        <td className="py-3 font-bold text-emerald-400">
                          ${commissionAmount} MXN
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => alert(`Liquidación de $${bizSales - commissionAmount} MXN procesada para ${b.name}`)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[11px]"
                          >
                            Liquidar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BUSINESS MODAL */}
      {showAddBizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingBiz ? 'Editar Negocio' : 'Alta de Nuevo Negocio'}
              </h3>
              <button
                onClick={() => setShowAddBizModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Categoría
                  </label>
                  <select
                    value={newBizCategory}
                    onChange={(e) => setNewBizCategory(e.target.value as BusinessCategory)}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="farmacia">💊 Farmacia</option>
                    <option value="restaurante">🍔 Restaurante / Comida</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Comisión Plataforma (%)
                  </label>
                  <input
                    type="number"
                    value={newBizCommission}
                    onChange={(e) => setNewBizCommission(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={newBizAddress}
                  onChange={(e) => setNewBizAddress(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase text-[10px] font-bold">
                    Horario
                  </label>
                  <input
                    type="text"
                    value={newBizHours}
                    onChange={(e) => setNewBizHours(e.target.value)}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Logo / Pin Icon Picker */}
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Logo Emoji del Marcador en el Mapa
                </label>
                <div className="flex gap-2 mt-1">
                  {['💊', '🌿', '🍔', '🍕', '🌮', '🥩', '🥗', '☕'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewBizLogo(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        newBizLogo === emoji
                          ? 'bg-purple-600 border-white scale-110 shadow'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Color */}
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold">
                  Color del Pin en el Mapa
                </label>
                <div className="flex gap-2 mt-1">
                  {['#2563eb', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#eab308'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewBizPinColor(c)}
                      className={`w-8 h-8 rounded-xl border-2 transition-all ${
                        newBizPinColor === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Coords */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase text-[10px]">Latitud:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newBizLat}
                    onChange={(e) => setNewBizLat(parseFloat(e.target.value))}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase text-[10px]">Longitud:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newBizLng}
                    onChange={(e) => setNewBizLng(parseFloat(e.target.value))}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddBizModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBusiness}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl text-xs font-bold"
              >
                Guardar Negocio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
