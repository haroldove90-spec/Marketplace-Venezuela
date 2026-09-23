import { Business, Product, BusinessCategory } from '../types';
import { buildDeepLink } from '../utils/urlUtils';

export interface ChatbotResponse {
  messageText: string;
  foundProducts: Product[];
  recommendedBusinesses: Business[];
  deepLink?: string;
  categoryDetected?: BusinessCategory;
}

type ProductsDirectory = Product[];

export async function processChatbotMessage(
  userMessage: string,
  userLocation: { lat: number; lng: number } | null,
  businesses: Business[],
  products: ProductsDirectory
): Promise<ChatbotResponse> {
  const queryLower = userMessage.toLowerCase().trim();

  // Prepare catalog context for server-side Gemini AI
  const catalogContext = businesses.map((b) => {
    const bizProducts = products.filter((p) => p.businessId === b.id);
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      address: b.address,
      coords: b.coordinates,
      products: bizProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        tags: p.tags.join(', '),
        inStock: p.inStock,
        isOffer: p.isOfferOfTheDay
      }))
    };
  });

  // Call Server-Side Gemini API endpoint
  try {
    const response = await fetch('/api/gemini/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userMessage,
        userLocation,
        catalogContext
      })
    });

    if (response.ok) {
      const data = await response.json();

      if (data && data.messageText) {
        const matchedBusinesses = businesses.filter((b) =>
          data.matchedBusinessIds?.includes(b.id)
        );
        const matchedProducts = products.filter((p) =>
          data.matchedProductIds?.includes(p.id)
        );

        const primaryBiz = matchedBusinesses[0] || businesses[0];
        const primaryProd = matchedProducts[0];

        const deepLink = buildDeepLink({
          businessId: primaryBiz?.id,
          productId: primaryProd?.id,
          category: data.category || primaryBiz?.category
        });

        return {
          messageText: data.messageText,
          foundProducts: matchedProducts,
          recommendedBusinesses: matchedBusinesses.length > 0 ? matchedBusinesses : (primaryBiz ? [primaryBiz] : []),
          deepLink,
          categoryDetected: data.category as BusinessCategory
        };
      }
    }
  } catch (error) {
    console.warn('Chatbot server API route not reachable, transitioning smoothly to smart local assistant engine:', error);
  }

  // Advanced domain-aware automotive & Venezuelan commerce fallback engine
  return fallbackIntelligentMatcher(queryLower, businesses, products, userLocation);
}

/**
 * Intelligent Venezuelan Automotive, Spare Parts & Retail Matching Engine
 */
function fallbackIntelligentMatcher(
  query: string,
  businesses: Business[],
  products: Product[],
  _userLocation: { lat: number; lng: number } | null
): ChatbotResponse {
  // Normalize query words
  const words = query
    .replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // 1. Exact or partial product tag/name search
  const matchedProducts = products.filter((p) => {
    const nameLower = p.name.toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const tagsLower = p.tags.map((t) => t.toLowerCase());

    // Check full query
    if (nameLower.includes(query) || descLower.includes(query)) return true;

    // Check individual keywords
    const matchCount = words.filter((w) => {
      return (
        nameLower.includes(w) ||
        descLower.includes(w) ||
        tagsLower.some((t) => t.includes(w) || w.includes(t))
      );
    }).length;

    return matchCount >= 1;
  });

  if (matchedProducts.length > 0) {
    const primaryProduct = matchedProducts[0];
    const biz = businesses.find((b) => b.id === primaryProduct.businessId) || businesses[0];
    const deepLink = buildDeepLink({
      businessId: biz?.id,
      productId: primaryProduct.id
    });

    const isPlural = matchedProducts.length > 1;
    return {
      messageText: `📍 ¡Encontré *${primaryProduct.name}* disponible en *${biz?.name || 'Comercio'}* por *Bs. ${primaryProduct.price.toLocaleString()}*!\n\n${
        isPlural
          ? `🔍 También localicé ${matchedProducts.length - 1} opción(es) adicional(es) en catálogo.`
          : '✨ Stock disponible para entrega inmediata o retiro en tienda.'
      }\n\n👉 Accede directo al Marketplace para pedir:`,
      foundProducts: matchedProducts,
      recommendedBusinesses: biz ? [biz] : [],
      deepLink,
      categoryDetected: biz?.category
    };
  }

  // 2. Automotive knowledge & auto parts analysis
  const autoPartsKeywords = [
    'repuesto', 'repuestos', 'bomba', 'pastilla', 'freno', 'amortiguador', 'bujia', 'bujía',
    'bobina', 'filtro', 'aceite', 'correa', 'tiempo', 'croche', 'embrague', 'empacadura',
    'alternador', 'arranque', 'tripoide', 'terminal', 'rotula', 'muñon', 'muñón', 'radiador',
    'termostato', 'bateria', 'batería', 'refrigerante', 'aveo', 'optra', 'corsa', 'spark',
    'cruze', 'silverado', 'tahoe', 'fiesta', 'focus', 'explorer', 'hilux', 'corolla', 'yaris',
    'fortuner', 'palio', 'siena', 'chevrolet', 'toyota', 'ford', 'fiat', 'chery'
  ];

  const isAutoQuery = autoPartsKeywords.some((k) => query.includes(k));
  if (isAutoQuery) {
    // Find businesses specialized in repuestos or automotive
    const autoBiz = businesses.filter(
      (b) =>
        b.category === 'repuestos' ||
        b.name.toLowerCase().includes('repuesto') ||
        b.name.toLowerCase().includes('auto') ||
        b.name.toLowerCase().includes('motor') ||
        b.name.toLowerCase().includes('force')
    );

    const targetBiz = autoBiz[0] || businesses[0];
    const bizProds = targetBiz ? products.filter((p) => p.businessId === targetBiz.id) : [];

    const deepLink = buildDeepLink({
      businessId: targetBiz?.id,
      category: 'repuestos'
    });

    return {
      messageText: `🚗 *Especialistas en Repuestos y Autopartes Con Force*\n\nDetectamos tu búsqueda automotriz. Contamos con repuestos para las principales marcas de Venezuela (Chevrolet, Ford, Toyota, Fiat y más).\n\nPuedes consultar stock inmediato con nuestros asesores o explorar el catálogo aquí:`,
      foundProducts: bizProds.slice(0, 3),
      recommendedBusinesses: autoBiz.length > 0 ? autoBiz : (targetBiz ? [targetBiz] : []),
      deepLink,
      categoryDetected: 'repuestos'
    };
  }

  // 3. Pharmacy search
  const isPharmacyQuery =
    query.includes('farmacia') ||
    query.includes('medicina') ||
    query.includes('salud') ||
    query.includes('pastilla') ||
    query.includes('dolor') ||
    query.includes('jarabe') ||
    query.includes('paracetamol') ||
    query.includes('acetaminofen') ||
    query.includes('remedio');

  if (isPharmacyQuery) {
    const pharmacies = businesses.filter((b) => b.category === 'farmacia');
    const biz = pharmacies[0];
    const deepLink = buildDeepLink({
      businessId: biz?.id,
      category: 'farmacia'
    });

    return {
      messageText: `💊 *Farmacias Con Force en tu zona*\n\nTenemos ${pharmacies.length > 0 ? pharmacies.length : 'varias'} farmacias activas con medicinas, artículos de cuidado y entrega a domicilio express en Bolívares.\n\nRevisa el catálogo completo aquí:`,
      foundProducts: biz ? products.filter((p) => p.businessId === biz.id) : [],
      recommendedBusinesses: pharmacies,
      deepLink,
      categoryDetected: 'farmacia'
    };
  }

  // 4. Food & restaurants
  const isFoodQuery =
    query.includes('comida') ||
    query.includes('hambre') ||
    query.includes('restaurante') ||
    query.includes('comer') ||
    query.includes('tacos') ||
    query.includes('burger') ||
    query.includes('pizza') ||
    query.includes('almuerzo') ||
    query.includes('cena');

  if (isFoodQuery) {
    const restaurants = businesses.filter((b) => b.category === 'restaurante');
    const biz = restaurants[0];
    const deepLink = buildDeepLink({
      businessId: biz?.id,
      category: 'restaurante'
    });

    return {
      messageText: `🍔 *Restaurantes y Delivery Con Force*\n\n¡Hay locales con opciones listas para ti! Hamburguesas, pizzas, platos típicos y bebidas con entrega rápida.\n\nOrdena directo aquí:`,
      foundProducts: biz ? products.filter((p) => p.businessId === biz.id) : [],
      recommendedBusinesses: restaurants,
      deepLink,
      categoryDetected: 'restaurante'
    };
  }

  // 5. Featured Offer of the Day or Welcome
  const offerProduct = products.find((p) => p.isOfferOfTheDay) || (products.length > 0 ? products[0] : null);
  const offerBiz = offerProduct ? businesses.find((b) => b.id === offerProduct.businessId) || businesses[0] : null;

  if (offerProduct && offerBiz) {
    const deepLink = buildDeepLink({
      businessId: offerBiz.id,
      productId: offerProduct.id
    });

    return {
      messageText: `🔥 *¡Bienvenido a Con Force Venezuela!*\n\n*Oferta destacada de hoy:*\n🚗 *${offerProduct.name}* a solo *Bs. ${offerProduct.price.toLocaleString()}* en *${offerBiz.name}*.\n\nEscribe el repuesto, artículo o comercio que buscas para asistirte de inmediato:`,
      foundProducts: [offerProduct],
      recommendedBusinesses: [offerBiz],
      deepLink
    };
  }

  const defaultDeepLink = buildDeepLink();
  return {
    messageText: `👋 ¡Hola! Soy el asistente inteligente de *Con Force Venezuela*.\n\n¿En qué podemos ayudarte hoy? Escribe qué repuesto, marca de vehículo o servicio necesitas y te daré opciones en tiempo real con precios en Bs.`,
    foundProducts: [],
    recommendedBusinesses: businesses.slice(0, 3),
    deepLink: defaultDeepLink
  };
}
