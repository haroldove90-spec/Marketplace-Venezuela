import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryType, PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MapPin,
  LocateFixed,
  Building,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    createOrder,
    businesses,
    userLocation,
    userAddressLabel,
    savedAddresses
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [addressChoice, setAddressChoice] = useState<'current_gps' | 'saved' | 'custom'>('current_gps');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>(savedAddresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [customerName, setCustomerName] = useState<string>('Carlos Mendoza');
  const [customerPhone, setCustomerPhone] = useState<string>('+52 55 8912 3456');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Find business from first cart item
  const primaryBusinessId = cart[0]?.businessId;
  const targetBusiness = businesses.find((b) => b.id === primaryBusinessId);

  const deliveryFee = deliveryType === 'pickup' ? 0 : 35;
  const grandTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !targetBusiness) return;

    let finalDeliveryAddress = '';
    if (deliveryType === 'pickup') {
      finalDeliveryAddress = `Recoger en Sucursal: ${targetBusiness.address}`;
    } else {
      if (addressChoice === 'current_gps') {
        finalDeliveryAddress = userAddressLabel || 'Ubicación GPS actual';
      } else if (addressChoice === 'saved') {
        const saved = savedAddresses.find((a) => a.id === selectedSavedAddrId);
        finalDeliveryAddress = saved ? `${saved.label}: ${saved.address}` : 'Dirección guardada';
      } else {
        finalDeliveryAddress = customAddress.trim() || 'Dirección personalizada especificada';
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        businessId: targetBusiness.id,
        businessName: targetBusiness.name,
        businessLogo: targetBusiness.logo,
        customerName: customerName.trim() || 'Cliente Pulso',
        customerPhone: customerPhone.trim() || '+52 55 0000 0000',
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        total: grandTotal,
        deliveryType,
        deliveryAddress: finalDeliveryAddress,
        deliveryCoordinates: userLocation || undefined,
        paymentMethod,
        status: 'preparing',
        notes: orderNotes
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      setIsSubmitting(false);
      onClose();
      onOrderSuccess(newOrder.id);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full h-full md:max-w-lg bg-white text-slate-900 flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Carrito & Checkout</h3>
              {targetBusiness && (
                <p className="text-[11px] text-slate-500 truncate">
                  Tienda: <span className="text-slate-900 font-semibold">{targetBusiness.name}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
            <div className="text-5xl mb-3">🛍️</div>
            <h4 className="font-bold text-slate-900 text-base">Tu carrito está vacío</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Explora las farmacias y restaurantes en el mapa para agregar productos.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Explorar Tiendas
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white">
            
            {/* 1. Items List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Productos ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vaciar
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-slate-900 text-xs truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-xs text-emerald-600 font-bold">
                      ${item.product.price} MXN
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-xs">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 min-w-[12px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Modalidad: Recoger vs Domicilio */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Modalidad de Entrega
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">🛵</span>
                  <span className="text-xs font-bold">Envío a Domicilio</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">+$35 MXN</span>
                </button>

                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">🏬</span>
                  <span className="text-xs font-bold">Recoger en Sucursal</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Gratis</span>
                </button>
              </div>
            </div>

            {/* 3. Customizable Delivery Address (If delivery) */}
            {deliveryType === 'delivery' && (
              <div className="space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Dirección de Entrega
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Choice 1: Current GPS */}
                  <label
                    onClick={() => setAddressChoice('current_gps')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs ${
                      addressChoice === 'current_gps'
                        ? 'bg-white border-emerald-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={addressChoice === 'current_gps'}
                      onChange={() => setAddressChoice('current_gps')}
                      className="accent-emerald-600"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">📍 Mi posición GPS actual</p>
                      <p className="text-[10px] text-slate-500 truncate">{userAddressLabel}</p>
                    </div>
                  </label>

                  {/* Choice 2: Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <label
                      onClick={() => setAddressChoice('saved')}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs ${
                        addressChoice === 'saved'
                          ? 'bg-white border-emerald-500 text-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={addressChoice === 'saved'}
                        onChange={() => setAddressChoice('saved')}
                        className="accent-emerald-600 mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">Direcciones Frecuentes</p>
                        <select
                          value={selectedSavedAddrId}
                          onChange={(e) => {
                            setSelectedSavedAddrId(e.target.value);
                            setAddressChoice('saved');
                          }}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                        >
                          {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.id}>
                              {addr.label}: {addr.address}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                  )}

                  {/* Choice 3: Custom (Third party / Office) */}
                  <label
                    onClick={() => setAddressChoice('custom')}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs ${
                      addressChoice === 'custom'
                        ? 'bg-white border-emerald-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={addressChoice === 'custom'}
                      onChange={() => setAddressChoice('custom')}
                      className="accent-emerald-600 mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">Enviar a otra ubicación (Terceros, Oficina)</p>
                      {addressChoice === 'custom' && (
                        <input
                          type="text"
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                          placeholder="Calle, número, colonia, referencias..."
                          className="mt-1.5 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* 4. Payment Method */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Método de Pago
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold">Tarjeta Online</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold">Efectivo</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('pos_terminal')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'pos_terminal'
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <SmartphoneNfc className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold">Terminal POS</span>
                </button>
              </div>
            </div>

            {/* 5. Contact Details & Notes */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">Tu Nombre</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-600 text-[10px] uppercase font-bold">Teléfono Celular</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-[10px] uppercase font-bold">Instrucciones o Notas</label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej. Timbre 402, sin cebolla, etc."
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Checkout Footer with Totals and Submit */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-semibold text-slate-900">${cartSubtotal} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de entrega:</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-slate-900'}>
                  {deliveryFee === 0 ? 'Gratis' : `$${deliveryFee} MXN`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-emerald-600">${grandTotal} MXN</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow-md shadow-emerald-600/25 text-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirmando Pedido...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Confirmar Pedido (${grandTotal} MXN)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
