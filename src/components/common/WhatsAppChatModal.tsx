import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, Product, Business } from '../../types';
import { processChatbotMessage } from '../../services/geminiService';
import {
  Send,
  MapPin,
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  ExternalLink,
  ShoppingBag,
  Flame,
  ArrowLeft
} from 'lucide-react';

export const WhatsAppChatModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    whatsappInitialPrompt,
    businesses,
    products,
    userLocation,
    setSelectedBusinessForDetail,
    chatbotConfig
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message + offer of the day on open
  useEffect(() => {
    if (isWhatsAppModalOpen && messages.length === 0) {
      const offerProd = products.find(p => p.id === chatbotConfig.featuredOfferId || p.isOfferOfTheDay) || products[0];
      const offerBiz = businesses.find(b => b.id === offerProd?.businessId) || businesses[0];

      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        sender: 'bot',
        text: chatbotConfig.welcomeMessage || '¡Hola! Bienvenido al asistente oficial de Marketplace.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const offerMsg: ChatMessage = {
        id: 'msg-offer',
        sender: 'bot',
        text: `🔥 *OFERTA DEL DÍA EN TU ZONA* 🔥\n*${offerProd.name}*\n🏷️ Solo *$${offerProd.price} MXN* (Antes $${offerProd.originalPrice || offerProd.price + 45})\n🏪 Disponible en *${offerBiz.name}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'product_card',
        data: {
          product: offerProd,
          business: offerBiz,
          deepLink: `https://marketplace.app/?view=business&id=${offerBiz.id}&product=${offerProd.id}`
        }
      };

      setMessages([welcomeMsg, offerMsg]);

      // If an initial prompt was passed from button
      if (whatsappInitialPrompt) {
        setTimeout(() => {
          handleSendMessage(whatsappInitialPrompt);
        }, 600);
      }
    }
  }, [isWhatsAppModalOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await processChatbotMessage(query, userLocation, businesses, products);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: response.foundProducts.length > 0 ? 'product_card' : 'text',
        data: {
          products: response.foundProducts,
          business: response.recommendedBusinesses[0],
          deepLink: response.deepLink
        }
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Entendido. Puedes explorar todo nuestro catálogo de Farmacias y Restaurantes en el mapa interactivo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // User shares location via quick action
  const handleSendLocation = () => {
    const locMsg: ChatMessage = {
      id: `user-loc-${Date.now()}`,
      sender: 'user',
      text: '📍 Compartí mi ubicación en tiempo real',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'location'
    };

    setMessages(prev => [...prev, locMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nearbyPharmacies = businesses.filter(b => b.category === 'farmacia');
      const nearbyRestos = businesses.filter(b => b.category === 'restaurante');

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📍 *¡Ubicación recibida con éxito!*\n\nDetectamos a tu alrededor:\n• 💊 *${nearbyPharmacies.length} Farmacias* con medicamentos y entrega express.\n• 🍔 *${nearbyRestos.length} Restaurantes* abiertos.\n\n¿Qué te gustaría pedir?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
    }, 700);
  };

  const handleOpenDeepLink = (businessId?: string) => {
    if (businessId) {
      const biz = businesses.find(b => b.id === businessId);
      if (biz) {
        setSelectedBusinessForDetail(biz);
        setIsWhatsAppModalOpen(false);
      }
    }
  };

  if (!isWhatsAppModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* WhatsApp Window Container */}
      <div className="w-full h-full md:h-[650px] md:max-w-md bg-[#0b141a] text-slate-100 flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
        
        {/* WhatsApp Top Header Bar */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-700/40 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="text-slate-300 hover:text-white p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar & Bot Info */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                🤖
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1f2c34] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Marketplace Bot IA</h3>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded">
                  Oficial
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span>en línea</span>
                <span className="text-slate-400">· Meta Cloud API</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <button className="hover:text-white p-1"><Phone className="w-4 h-4" /></button>
            <button className="hover:text-white p-1"><Video className="w-4 h-4" /></button>
            <button onClick={() => setIsWhatsAppModalOpen(false)} className="hover:text-white p-1 font-bold">✕</button>
          </div>
        </div>

        {/* Quick Location Action Bar */}
        <div className="bg-[#111b21] px-4 py-2 flex items-center justify-between border-b border-slate-800/80">
          <button
            onClick={handleSendLocation}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>📍 Enviar mi ubicación actual</span>
          </button>
          <span className="text-[10px] text-slate-400">Deep Links Activos</span>
        </div>

        {/* WhatsApp Chat Messages Canvas with subtle wallpaper pattern */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-md relative text-xs md:text-sm ${
                    isUser
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/40'
                  }`}
                >
                  {/* Text body */}
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Product Rich Deep Link Card inside WhatsApp */}
                  {msg.data?.product && (
                    <div className="mt-2.5 p-2 bg-[#111b21] rounded-xl border border-slate-700/60 overflow-hidden">
                      <div className="flex gap-2.5 items-center">
                        <img
                          src={msg.data.product.image}
                          alt={msg.data.product.name}
                          className="w-14 h-14 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase">
                            Oferta Exclusiva
                          </span>
                          <h4 className="font-bold text-white text-xs truncate">
                            {msg.data.product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-extrabold text-emerald-400 text-xs">
                              ${msg.data.product.price} MXN
                            </span>
                            {msg.data.product.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ${msg.data.product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Deep link button */}
                      <button
                        onClick={() => handleOpenDeepLink(msg.data?.business?.id || msg.data?.product?.businessId)}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Abrir en Marketplace PWA</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp & read status */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400/80">
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bot Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bg-[#202c33] text-slate-400 px-3.5 py-2 rounded-2xl rounded-tl-none w-fit border border-slate-700/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span className="text-xs">Buscando en comercios cercanos...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="bg-[#111b21] px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800">
          <button
            onClick={() => handleSendMessage('¿Tienen paracetamol o analgésico cerca?')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[11px] whitespace-nowrap"
          >
            💊 Paracetamol cerca
          </button>
          <button
            onClick={() => handleSendMessage('Quiero ver hamburguesas y pizzas')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[11px] whitespace-nowrap"
          >
            🍔 Burgers y Pizzas
          </button>
          <button
            onClick={() => handleSendMessage('¿Cuál es la oferta del día?')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[11px] whitespace-nowrap"
          >
            🔥 Oferta del día
          </button>
        </div>

        {/* WhatsApp Message Input Bar */}
        <div className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-700/40 shrink-0">
          <button className="text-slate-400 hover:text-white p-1">
            <Smile className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-white p-1" onClick={handleSendLocation}>
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje o busca producto..."
            className="flex-1 bg-[#2a3942] text-white text-xs md:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
          />

          {inputMessage.trim() ? (
            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0">
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
