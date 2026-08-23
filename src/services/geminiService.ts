import { GoogleGenAI } from '@google/genai';
import { Business, Product } from '../types';

export interface ChatbotResponse {
  messageText: string;
  foundProducts: Product[];
  recommendedBusinesses: Business[];
  deepLink?: string;
  categoryDetected?: 'farmacia' | 'restaurante';
}

export async function processChatbotMessage(
  userMessage: string,
  userLocation: { lat: number; lng: number } | null,
  businesses: Business[],
  products: ProductsDirectory
): Promise<ChatbotResponse> {
  const queryLower = userMessage.toLowerCase().trim();

  // Extract catalog knowledge for context
  const catalogContext = businesses.map(b => {
    const bizProducts = products.filter(p => p.businessId === b.id);
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      address: b.address,
      coords: b.coordinates,
      products: bizProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        tags: p.tags.join(', '),
        inStock: p.inStock,
        isOffer: p.isOfferOfTheDay
      }))
    };
  });

  // Try using Gemini API if key is available
  try {
    const ai = new GoogleGenAI({});
    const prompt = `Eres el asistente inteligente oficial de WhatsApp para la aplicación móvil "Marketplace" (Farmacias y Restaurantes).
Tu objetivo es responder de manera ultra concisa, cordial y directa como en WhatsApp.

UBICACIÓN DEL USUARIO: ${userLocation ? `Lat: ${userLocation.lat}, Lng: ${userLocation.lng}` : 'Ubicación no proporcionada aún'}

CATÁLOGO Y NEGOCIOS DISPONIBLES:
${JSON.stringify(catalogContext, null, 2)}

MENSAJE DEL CLIENTE: "${userMessage}"

INSTRUCCIONES DE RESPUESTA:
1. Identifica qué producto, categoría (farmacia/comida) o síntoma/antojo busca el cliente.
2. Encuentra los productos o negocios más adecuados y con stock.
3. Responde en español en tono WhatsApp (usando emojis apropiados, sin rodeos ni textos largos).
4. Genera la respuesta en formato JSON estrictamente válido con la estructura:
{
  "messageText": "Texto conciso para el usuario en WhatsApp",
  "matchedBusinessIds": ["id_del_negocio"],
  "matchedProductIds": ["id_del_producto"],
  "category": "farmacia" o "restaurante" o null,
  "deepLinkSlug": "slug descriptivo para el deep link de la app"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      const matchedBusinesses = businesses.filter(b => parsed.matchedBusinessIds?.includes(b.id));
      const matchedProducts = products.filter(p => parsed.matchedProductIds?.includes(p.id));

      const primaryBiz = matchedBusinesses[0] || businesses[0];
      const deepLink = `https://marketplace.app/?view=business&id=${primaryBiz.id}${parsed.matchedProductIds?.[0] ? `&product=${parsed.matchedProductIds[0]}` : ''}`;

      return {
        messageText: parsed.messageText,
        foundProducts: matchedProducts,
        recommendedBusinesses: matchedBusinesses,
        deepLink,
        categoryDetected: parsed.category
      };
    }
  } catch (error) {
    console.warn('Gemini API call fallback to local rule-based engine:', error);
  }

  // Fallback intelligent local matcher
  return fallbackLocalMatcher(queryLower, businesses, products, userLocation);
}

type ProductsDirectory = Product[];

function fallbackLocalMatcher(
  query: string,
  businesses: Business[],
  products: Product[],
  userLocation: { lat: number; lng: number } | null
): ChatbotResponse {
  // 1. Search products by tag or name
  const matchedProducts = products.filter(p => {
    const inName = p.name.toLowerCase().includes(query);
    const inDesc = p.description.toLowerCase().includes(query);
    const inTags = p.tags.some(t => query.includes(t) || t.includes(query));
    return inName || inDesc || inTags;
  });

  if (matchedProducts.length > 0) {
    const primaryProduct = matchedProducts[0];
    const biz = businesses.find(b => b.id === primaryProduct.businessId) || businesses[0];
    const deepLink = `https://marketplace.app/?view=business&id=${biz.id}&product=${primaryProduct.id}`;

    return {
      messageText: `📍 ¡Encontré *${primaryProduct.name}* disponible en *${biz.name}* por *$${primaryProduct.price} MXN*!\n\n✨ Stock disponible para entrega inmediata o recojo en tienda. Toca el enlace para ver en el mapa y pedir:`,
      foundProducts: matchedProducts,
      recommendedBusinesses: [biz],
      deepLink,
      categoryDetected: biz.category
    };
  }

  // 2. Search category or pharmacy keywords
  const isPharmacyQuery = query.includes('farmacia') || query.includes('medicina') || query.includes('salud') || query.includes('pastilla') || query.includes('dolor') || query.includes('remedio');
  const isFoodQuery = query.includes('comida') || query.includes('hambre') || query.includes('restaurante') || query.includes('comer') || query.includes('tacos') || query.includes('burger') || query.includes('pizza');

  if (isPharmacyQuery) {
    const pharmacies = businesses.filter(b => b.category === 'farmacia');
    const biz = pharmacies[0];
    return {
      messageText: `💊 Tenemos ${pharmacies.length} farmacias activas cerca de ti con servicio express y 24 hrs. Puedes consultar catálogo y pedir directo aquí:`,
      foundProducts: products.filter(p => p.businessId === biz.id),
      recommendedBusinesses: pharmacies,
      deepLink: `https://marketplace.app/?filter=farmacia&view=business&id=${biz.id}`,
      categoryDetected: 'farmacia'
    };
  }

  if (isFoodQuery) {
    const restaurants = businesses.filter(b => b.category === 'restaurante');
    const biz = restaurants[0];
    return {
      messageText: `🍔 ¡Hay deliciosos restaurantes abiertos en tu zona! Burgers, Pizzas, Tacos y más con entrega express:`,
      foundProducts: products.filter(p => p.businessId === biz.id),
      recommendedBusinesses: restaurants,
      deepLink: `https://marketplace.app/?filter=restaurante&view=business&id=${biz.id}`,
      categoryDetected: 'restaurante'
    };
  }

  // 3. General offer / welcome
  const offerProduct = products.find(p => p.isOfferOfTheDay) || products[0];
  const offerBiz = businesses.find(b => b.id === offerProduct.businessId) || businesses[0];

  return {
    messageText: `🔥 ¡Oferta destacada de hoy en Marketplace!\n*${offerProduct.name}* a solo *$${offerProduct.price} MXN* (Antes $${offerProduct.originalPrice || offerProduct.price + 50}) en *${offerBiz.name}*.\n\nEscribe qué necesitas o explora en el mapa interactivo:`,
    foundProducts: [offerProduct],
    recommendedBusinesses: [offerBiz],
    deepLink: `https://marketplace.app/?view=business&id=${offerBiz.id}&product=${offerProduct.id}`
  };
}
