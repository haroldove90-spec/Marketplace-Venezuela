import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { userMessage, userLocation, catalogContext } = req.body || {};

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Missing userMessage in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `Eres "Asistente Con Force", el asesor comercial experto e inteligente de Con Force Venezuela (Marketplace Automotriz, Repuestos, Servicios, Tiendas y Comercios).
Tu objetivo es responder a clientes por WhatsApp con tono ultra profesional, empático, directo y enfocado en solucionar su necesidad y concretar ventas.

DATOS CLAVE DEL NEGOCIO Y CONTEXTO VENEZOLANO:
- Moneda oficial en la plataforma: Bolívares (Bs.).
- Con Force es especialista en repuestos automotrices para todas las marcas (Chevrolet, Ford, Toyota, Renault, Fiat, Chery, Hyundai, Jeep, Mitsubishi, etc.).
- También cuenta con farmacias, víveres, restaurantes y ferretería.
- Si el cliente pregunta por un repuesto para un vehículo (ej: "pastillas para Aveo", "bomba de gasolina para Corsa", "filtro de aceite Optra"), entiende inmediatamente qué pieza es, su función y sugiere los repuestos y comercios del catálogo disponibles.
- Si el usuario comparte ubicación o está buscando tiendas cercanas, prioriza los comercios locales.
- Si un producto NO está exactamente en el catálogo, recomiéndale amablemente los comercios del rubro disponibles o la categoría más afin, sin inventar precios falsos.
- Sé breve, usa viñetas con emojis estilo WhatsApp (🇻🇪, 🚗, 🔧, 🛵, 💳, 🛒, 📍) y mantén la respuesta atractiva para lectura en pantalla móvil.`;

    const prompt = `UBICACIÓN DEL CLIENTE: ${userLocation ? `Lat: ${userLocation.lat}, Lng: ${userLocation.lng}` : 'No especificada'}

CATÁLOGO REAL DE NEGOCIOS Y PRODUCTOS DISPONIBLES:
${JSON.stringify(catalogContext || [], null, 2)}

MENSAJE DEL CLIENTE:
"${userMessage}"

Por favor analiza la consulta, selecciona los comercios y productos más pertinentes y genera la respuesta.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            messageText: {
              type: Type.STRING,
              description: 'Texto de respuesta profesional en español adaptado para WhatsApp con emojis.'
            },
            matchedBusinessIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs de comercios del catálogo que tienen o atienden lo que busca el cliente.'
            },
            matchedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs de productos del catálogo que coinciden con la búsqueda.'
            },
            category: {
              type: Type.STRING,
              description: 'Categoría identificada (repuestos, farmacia, restaurante, tecnologia, ferreteria, supermercado) o null.'
            }
          },
          required: ['messageText', 'matchedBusinessIds', 'matchedProductIds']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Gemini chatbot error:', error);
    return res.status(500).json({
      error: error.message || 'Error processing message with Gemini AI'
    });
  }
}
