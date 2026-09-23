import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini AI Chatbot Endpoint
app.post('/api/gemini/chatbot', async (req, res) => {
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

    const systemInstruction = `Eres "Asistente Con Force", el asesor de compras inteligente, empático y servicial de Con Force Venezuela (Marketplace Multicategoría de Comercio, Tecnología, Alimentos, Farmacia, Ferretería, Repuestos, Moda y Servicios en Venezuela).
Tu objetivo es atender a los clientes por WhatsApp con tono ultra profesional, cálido, ágil y enfocado en ayudarlos a encontrar lo que necesitan en el marketplace.

PAUTAS CRUCIALES DE CONVERSACIÓN:
1. SALUDOS Y CORTESÍA:
   - Si el cliente te saluda (ej: "Buenas tardes", "Buenos días", "Buenas noches", "Hola", "Saludos", "Qué tal"):
     RESPONDE DIRECTAMENTE AL SALUDO con amabilidad y educación humana (ej: si dice "Buenas tardes", responde: "¡Buenas tardes! ☀️ Un placer saludarte. Bienvenido a Con Force Venezuela. ¿En qué te puedo colaborar hoy? ¿Buscas tecnología, comida, farmacia, repuestos o algún servicio?").
     No sueltes discursos prefabricados ni párrafos impersonales.
     En un saludo simple, matchedBusinessIds y matchedProductIds deben ser arreglos vacíos [].
   - Si el cliente te saluda Y pregunta algo a la vez (ej: "Buenas tardes, ¿tienen comida o pizza?"):
     Devuélvele el saludo con cortesía ("¡Buenas tardes! 🍕 Con gusto...") y atiende de inmediato lo que busca.

2. MULTICATEGORÍA COMPLETA:
   - Con Force vende de TODO: teléfonos y computación, comida y restaurantes, medicinas y farmacia, supermercado y víveres, herramientas y ferretería, ropa y calzado, repuestos automotrices, etc.
   - NUNCA asumas que el usuario busca repuestos a menos que él lo mencione explícitamente.

3. PRECIOS Y DISPONIBILIDAD:
   - Moneda oficial: Bolívares (Bs.). Precios transparentes.
   - Si el producto exacto no está en el catálogo, recomiéndale con amabilidad los comercios afines disponibles en Con Force.
   - Formato WhatsApp: breve, claro, emojis amigables (🇻🇪, 🛒, 📱, 🍔, 💊, 🛠️, 🚗, ✨) y llamada a la acción.`;

    const prompt = `UBICACIÓN DEL CLIENTE: ${userLocation ? `Lat: ${userLocation.lat}, Lng: ${userLocation.lng}` : 'No especificada'}

CATÁLOGO REAL DISPONIBLE:
${JSON.stringify(catalogContext || [], null, 2)}

MENSAJE DEL CLIENTE:
"${userMessage}"

Analiza el mensaje del cliente. Si es un saludo, responde al saludo con cortesía y pregúntale en qué le ayudas. Si busca productos o servicios, oriéntalo con precisión.`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let parsed: any = null;

    for (const model of modelsToTry) {
      try {
        const responsePromise = ai.models.generateContent({
          model,
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
                  description: 'Categoría identificada (tecnologia, farmacia, restaurante, supermercado, ferreteria, repuestos, moda, servicios) o null.'
                }
              },
              required: ['messageText', 'matchedBusinessIds', 'matchedProductIds']
            }
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout exceeding 12000ms on ${model}`)), 12000)
        );

        const response: any = await Promise.race([responsePromise, timeoutPromise]);

        const text = response.text;
        if (text) {
          const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
          parsed = JSON.parse(cleanedText);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${model} failed, trying fallback:`, err.message || err);
      }
    }

    if (!parsed) {
      throw lastError || new Error('All Gemini candidate models failed to produce a valid response.');
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Gemini chatbot error in server.ts:', error);
    return res.status(500).json({
      error: error.message || 'Error processing message with Gemini AI'
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: attach Vite middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Con Force Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
