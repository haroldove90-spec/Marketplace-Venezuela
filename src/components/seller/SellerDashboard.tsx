import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, Product, Order, OrderStatus } from '../../types';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock3,
  Bike,
  Sparkles,
  Flame,
  Search,
  ChevronDown,
  LocateFixed,
  DollarSign,
  Tag,
  Share2,
  AlertCircle
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
    currentSellerBusiness,
    updateBusiness,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleOfferOfTheDay,
    orders,
    updateOrderStatus,
    userLocation,
    activeSellerTab,
    setActiveSellerTab
  } = useApp();

  // Active business
  const biz = currentSellerBusiness || businesses[0];

  // Seller orders filtered for this business
  const sellerOrders = orders.filter((o) => o.businessId === biz.id);
  const bizProducts = products.filter((p) => p.businessId === biz.id);

  // States for Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodCategory, setProdCategory] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodTags, setProdTags] = useState('');
  const [prodIsOffer, setProdIsOffer] = useState(false);

  // States for Profile Editor
  const [bizName, setBizName] = useState(biz.name);
  const [bizPhone, setBizPhone] = useState(biz.phone);
  const [bizAddress, setBizAddress] = useState(biz.address);
  const [bizLat, setBizLat] = useState<number>(biz.coordinates.lat);
  const [bizLng, setBizLng] = useState<number>(biz.coordinates.lng);
  const [bizHours, setBizHours] = useState(biz.openingHours);
  const [bizLogo, setBizLogo] = useState(biz.logo);
  const [bizPinColor, setBizPinColor] = useState(biz.customPinColor || '#2563eb');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Switch store handler
  const handleSelectBusiness = (bizId: string) => {
    setSelectedBusinessId(bizId);
    const target = businesses.find((b) => b.id === bizId);
    if (target) {
      setBizName(target.name);
      setBizPhone(target.phone);
      setBizAddress(target.address);
      setBizLat(target.coordinates.lat);
      setBizLng(target.coordinates.lng);
      setBizHours(target.openingHours);
      setBizLogo(target.logo);
      setBizPinColor(target.customPinColor || '#2563eb');
    }
  };

  const handleSaveProfile = () => {
    updateBusiness(biz.id, {
      name: bizName,
      phone: bizPhone,
      address: bizAddress,
      coordinates: { lat: Number(bizLat), lng: Number(bizLng) },
      openingHours: bizHours,
      logo: bizLogo,
      customPinColor: bizPinColor
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleUseCurrentGps = () => {
    if (userLocation) {
      setBizLat(userLocation.lat);
      setBizLng(userLocation.lng);
    }
  };

  // Product modal open
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice(50);
    setProdOriginalPrice(undefined);
    setProdCategory(biz.category === 'farmacia' ? 'Medicamentos' : 'Platillos');
    setProdImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60');
    setProdStock(25);
    setProdTags(biz.category === 'farmacia' ? 'paracetamol, dolor, medicina' : 'combo, comida, cena');
    setProdIsOffer(false);
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice);
    setProdCategory(prod.category);
    setProdImage(prod.image);
    setProdStock(prod.stockCount);
    setProdTags(prod.tags.join(', '));
    setProdIsOffer(prod.isOfferOfTheDay);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!prodName.trim()) return;

    const tagsArray = prodTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        category: prodCategory.trim() || 'General',
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        inStock: Number(prodStock) > 0,
        stockCount: Number(prodStock),
        tags: tagsArray,
        isOfferOfTheDay: prodIsOffer
      });
    } else {
      addProduct({
        businessId: biz.id,
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        category: prodCategory.trim() || 'General',
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        inStock: Number(prodStock) > 0,
        stockCount: Number(prodStock),
        tags: tagsArray,
        isOfferOfTheDay: prodIsOffer
      });
    }

    setShowProductModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 space-y-6 pb-24 md:pb-12 bg-white">
      
      {/* Store Switcher Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-white"
            style={{ backgroundColor: biz.customPinColor || '#2563eb' }}
          >
            {biz.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] uppercase border border-slate-200">
                {biz.category === 'farmacia' ? '💊 Farmacia' : '🍔 Restaurante'}
              </span>
              <span className="text-xs text-slate-600 font-medium">· Comisión {biz.commissionRate}%</span>
            </div>
            <h2 className="text-base md:text-lg font-black text-slate-900">{biz.name}</h2>
          </div>
        </div>

        {/* Store Dropdown selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">Mi Negocio:</span>
          <select
            value={selectedBusinessId}
            onChange={(e) => handleSelectBusiness(e.target.value)}
            className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#D4021D] cursor-pointer"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.logo} {b.name} ({b.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'orders', label: `Pedidos en Vivo (${sellerOrders.length})`, icon: <Clock3 className="w-4 h-4" /> },
          { id: 'catalog', label: `Catálogo & Stock (${bizProducts.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'profile', label: 'Perfil Comercial & GPS', icon: <MapPin className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSellerTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSellerTab === tab.id
                ? 'bg-[#D4021D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. ORDERS MODULE */}
      {activeSellerTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Recepción de Pedidos en Tiempo Real</h3>
            <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#D4021D] animate-ping" />
              Escuchando pedidos activos
            </span>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <div className="text-4xl">📋</div>
              <p className="font-bold text-slate-900 text-sm">No tienes pedidos pendientes</p>
              <p className="text-xs max-w-xs mx-auto">
                Los clientes que ordenen en tu local aparecerán aquí inmediatamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#D4021D]">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-slate-500">· {order.createdAt}</span>
                        {order.orderChannel && (
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            order.orderChannel === 'whatsapp'
                              ? 'bg-slate-100 text-slate-800 border border-slate-300'
                              : 'bg-red-50 text-[#D4021D] border border-red-200'
                          }`}>
                            {order.orderChannel === 'whatsapp' ? '💬 WhatsApp' : '📱 App'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{order.customerPhone}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase border border-slate-200">
                      {order.deliveryType === 'delivery' ? '🛵 A Domicilio' : '🏬 Recojo'}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>
                          <strong className="text-[#D4021D] mr-1">{i.quantity}x</strong>
                          {i.product.name}
                        </span>
                        <span className="font-medium">${i.product.price * i.quantity} MXN</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Total con entrega:</span>
                      <span className="text-[#D4021D] font-black">${order.total} MXN</span>
                    </div>
                  </div>

                  {/* Delivery destination */}
                  <div className="text-[11px] text-slate-600 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4021D] shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>

                  {/* Status Switcher Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">
                      Cambiar Estatus del Pedido:
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'preparing', label: '👨‍🍳 Prep', color: 'hover:bg-slate-200 hover:text-slate-900' },
                        { id: 'ready', label: '📦 Listo', color: 'hover:bg-slate-200 hover:text-slate-900' },
                        { id: 'on_the_way', label: '🛵 Ruta', color: 'hover:bg-slate-200 hover:text-slate-900' },
                        { id: 'delivered', label: '✓ Entregado', color: 'hover:bg-slate-200 hover:text-slate-900' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => updateOrderStatus(order.id, st.id as OrderStatus)}
                          className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            order.status === st.id
                              ? 'bg-[#D4021D] border-[#D4021D] text-white shadow-xs'
                              : `bg-slate-50 border-slate-200 text-slate-600 ${st.color}`
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. CATALOG & INVENTORY MODULE */}
      {activeSellerTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Catálogo de Productos e Inventario</h3>
              <p className="text-xs text-slate-500">
                Gestiona etiquetas de búsqueda del Chatbot IA y Ofertas del Día
              </p>
            </div>

            <button
              onClick={openNewProductModal}
              className="flex items-center gap-1.5 bg-[#D4021D] hover:bg-[#b50218] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bizProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 p-3.5 space-y-3 shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D4021D] uppercase">
                        {prod.category}
                      </span>
                      <button
                        onClick={() => toggleOfferOfTheDay(prod.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          prod.isOfferOfTheDay
                            ? 'bg-[#D4021D] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                        title="Marcar como oferta del día para el Chatbot"
                      >
                        🔥 {prod.isOfferOfTheDay ? 'Oferta Activa' : 'Hacer Oferta'}
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs md:text-sm line-clamp-1 mt-0.5">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-[#D4021D] mt-1">
                      ${prod.price} MXN
                    </p>

                    {/* Stock pill */}
                    <div className="flex items-center gap-1 mt-1 text-[11px]">
                      <span className="text-slate-500">Stock:</span>
                      <span
                        className={`font-bold ${
                          prod.stockCount > 0 ? 'text-slate-900' : 'text-red-500'
                        }`}
                      >
                        {prod.stockCount} uds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chatbot Keywords Tags */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mb-1">
                    <Tag className="w-3 h-3 text-[#D4021D]" />
                    <span>Keywords Chatbot IA:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {prod.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.2 bg-red-50 text-[#D4021D] rounded font-mono border border-red-100"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditProductModal(prod)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="p-1.5 bg-slate-100 hover:bg-red-50 text-red-500 rounded-lg text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROFILE & GEOLOCATION MODULE */}
      {activeSellerTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-5 shadow-xs max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Perfil Comercial & Geolocalización en el Mapa
              </h3>
              <p className="text-xs text-slate-500">
                Configura coordenadas GPS exactas, logo del marcador y horarios de atención
              </p>
            </div>

            {profileSavedToast && (
              <span className="px-3 py-1 bg-red-50 border border-red-200 text-[#D4021D] text-xs font-bold rounded-xl animate-in fade-in">
                ✓ Cambios Guardados
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-[#D4021D]"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Teléfono de Contacto / WhatsApp
              </label>
              <input
                type="text"
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-[#D4021D]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Dirección Física
              </label>
              <input
                type="text"
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-[#D4021D]"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Horario de Atención
              </label>
              <input
                type="text"
                value={bizHours}
                onChange={(e) => setBizHours(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-[#D4021D]"
              />
            </div>

            {/* Logo / Pin Icon Picker */}
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Logo Emoji / Ícono del Marcador en Mapa
              </label>
              <div className="flex gap-2 mt-1">
                {['💊', '🌿', '🍔', '🍕', '🌮', '🥩', '🥗', '☕'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setBizLogo(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                      bizLogo === emoji
                        ? 'bg-[#D4021D] text-white border-[#D4021D] scale-110 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Pin Color */}
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px]">
                Color del Pin en el Mapa
              </label>
              <div className="flex gap-2 mt-1">
                {['#D4021D', '#000000', '#f97316', '#2563eb', '#8b5cf6', '#eab308'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBizPinColor(c)}
                    className={`w-8 h-8 rounded-xl border-2 transition-all cursor-pointer ${
                      bizPinColor === c ? 'border-slate-900 scale-110 shadow-xs' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* GPS Coords with auto-detect button */}
            <div className="md:col-span-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4021D]" />
                  Coordenadas Exactas en el Mapa (Lat / Lng)
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentGps}
                  className="flex items-center gap-1 text-[11px] text-[#D4021D] hover:text-[#b50218] font-bold cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" /> Usar mi GPS actual
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 text-[10px]">Latitud:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={bizLat}
                    onChange={(e) => setBizLat(parseFloat(e.target.value))}
                    className="w-full mt-0.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-[10px]">Longitud:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={bizLng}
                    onChange={(e) => setBizLng(parseFloat(e.target.value))}
                    className="w-full mt-0.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-[#D4021D] hover:bg-[#b50218] text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-[#D4021D]/25 active:scale-98 cursor-pointer"
          >
            Guardar Cambios del Perfil Comercial
          </button>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProduct ? 'Editar Producto' : 'Publicar Nuevo Producto'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej. Paracetamol 500mg o Burger Doble"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                />
              </div>

              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  Descripción
                </label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detalles del producto o platillo..."
                  rows={2}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 resize-none focus:outline-none focus:border-[#D4021D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 text-[10px] uppercase font-bold">
                    Precio ($ MXN)
                  </label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-[10px] uppercase font-bold">
                    Precio Original (Tachado)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice || ''}
                    onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Opcional"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 text-[10px] uppercase font-bold">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    placeholder="Medicamentos / Pizzas..."
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-[10px] uppercase font-bold">
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  Etiquetas para el Chatbot IA (separadas por coma)
                </label>
                <input
                  type="text"
                  value={prodTags}
                  onChange={(e) => setProdTags(e.target.value)}
                  placeholder="paracetamol, fiebre, dolor, pastillas"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                />
              </div>

              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D4021D]"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 text-xs">Marcar como "Oferta del Día"</span>
                  <p className="text-[11px] text-slate-600">El Chatbot la destacará en su bienvenida</p>
                </div>
                <input
                  type="checkbox"
                  checked={prodIsOffer}
                  onChange={(e) => setProdIsOffer(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-[#D4021D] hover:bg-[#b50218] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
