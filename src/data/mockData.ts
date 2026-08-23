import { Business, Product, Order, WhatsAppCampaign, ChatbotConfig, SavedAddress } from '../types';

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-farmacia-1',
    name: 'Farmacias San Rafael Express',
    category: 'farmacia',
    logo: '💊',
    bannerImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60',
    phone: '+52 55 8765 4321',
    address: 'Av. Central 452, Col. Del Valle',
    coordinates: { lat: 19.3985, lng: -99.1685 },
    openingHours: '24 Horas (Lunes a Domingo)',
    rating: 4.8,
    reviewsCount: 142,
    isVerified: true,
    isActive: true,
    commissionRate: 8,
    customPinColor: '#10b981',
    deliveryTime: '15-25 min',
    minOrder: 100,
    tags: ['farmacia', 'medicamentos', 'urgencias', 'salud', 'paracetamol', 'antigripal']
  },
  {
    id: 'biz-farmacia-2',
    name: 'Farmacia & Dermocuidado Vitalis',
    category: 'farmacia',
    logo: '🌿',
    bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=60',
    phone: '+52 55 1234 5678',
    address: 'Calle Durango 188, Col. Roma Norte',
    coordinates: { lat: 19.4190, lng: -99.1650 },
    openingHours: '08:00 AM - 10:00 PM',
    rating: 4.9,
    reviewsCount: 98,
    isVerified: true,
    isActive: true,
    commissionRate: 9,
    customPinColor: '#059669',
    deliveryTime: '20-30 min',
    minOrder: 150,
    tags: ['dermocosmetica', 'vitaminas', 'suplementos', 'pediatria', 'analgesico']
  },
  {
    id: 'biz-resto-1',
    name: 'Burger Craft & Wings House',
    category: 'restaurante',
    logo: '🍔',
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60',
    phone: '+52 55 9876 5432',
    address: 'Av. Insurgentes Sur 1205, Mixcoac',
    coordinates: { lat: 19.3780, lng: -99.1790 },
    openingHours: '12:00 PM - 11:30 PM',
    rating: 4.7,
    reviewsCount: 310,
    isVerified: true,
    isActive: true,
    commissionRate: 12,
    customPinColor: '#f97316',
    deliveryTime: '25-40 min',
    minOrder: 120,
    tags: ['hamburguesas', 'alitas', 'papas', 'comida rapida', 'cena', 'bbq']
  },
  {
    id: 'biz-resto-2',
    name: 'Pizzería Napolitana Bella Forno',
    category: 'restaurante',
    logo: '🍕',
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
    phone: '+52 55 4567 8901',
    address: 'Av. Álvaro Obregón 85, Col. Condesa',
    coordinates: { lat: 19.4165, lng: -99.1600 },
    openingHours: '01:00 PM - 11:00 PM',
    rating: 4.9,
    reviewsCount: 224,
    isVerified: true,
    isActive: true,
    commissionRate: 10,
    customPinColor: '#ef4444',
    deliveryTime: '30-45 min',
    minOrder: 180,
    tags: ['pizza', 'artesanal', 'italiana', 'pasta', 'lasagna', 'cena']
  },
  {
    id: 'biz-resto-3',
    name: 'Tacos Los Compadres & Birria',
    category: 'restaurante',
    logo: '🌮',
    bannerImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=60',
    phone: '+52 55 3322 1100',
    address: 'Eje Central Lázaro Cárdenas 210, Centro',
    coordinates: { lat: 19.4340, lng: -99.1410 },
    openingHours: '10:00 AM - 02:00 AM',
    rating: 4.8,
    reviewsCount: 450,
    isVerified: true,
    isActive: true,
    commissionRate: 10,
    customPinColor: '#eab308',
    deliveryTime: '15-30 min',
    minOrder: 80,
    tags: ['tacos', 'pastor', 'birria', 'consome', 'antojitos', 'cena']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Farmacia San Rafael
  {
    id: 'prod-1',
    businessId: 'biz-farmacia-1',
    name: 'Paracetamol 500mg (Caja 20 tabletas)',
    description: 'Analgésico y antipirético para alivio rápido de dolor de cabeza, muscular y fiebre.',
    price: 45,
    originalPrice: 65,
    category: 'Medicamentos',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 85,
    tags: ['paracetamol', 'analgesico', 'fiebre', 'dolor de cabeza', 'medicamento', 'pastillas'],
    isOfferOfTheDay: true
  },
  {
    id: 'prod-2',
    businessId: 'biz-farmacia-1',
    name: 'Ibuprofeno 400mg (10 cápsulas)',
    description: 'Antiinflamatorio no esteroideo para dolores agudos, inflamación y cólicos.',
    price: 78,
    originalPrice: 95,
    category: 'Medicamentos',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 42,
    tags: ['ibuprofeno', 'inflamacion', 'dolor', 'colicos', 'muscular', 'medicamento'],
    isOfferOfTheDay: false
  },
  {
    id: 'prod-3',
    businessId: 'biz-farmacia-1',
    name: 'Antigripal Descongestivo Jarabe 120ml',
    description: 'Fórmula completa para tos, congestión nasal y síntomas de gripe común.',
    price: 110,
    category: 'Respiratorio',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 20,
    tags: ['antigripal', 'gripe', 'tos', 'jarabe', 'resfriado', 'descongestivo'],
    isOfferOfTheDay: false
  },
  {
    id: 'prod-4',
    businessId: 'biz-farmacia-1',
    name: 'Suero Oral Electrolitos 500ml',
    description: 'Solución rehidratante oral sabor manzana para deshidratación y recuperación.',
    price: 32,
    originalPrice: 40,
    category: 'Cuidado & Bienestar',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 150,
    tags: ['suero', 'electrolitos', 'hidratacion', 'estomago', 'resaca', 'calor'],
    isOfferOfTheDay: false
  },

  // Farmacia Vitalis
  {
    id: 'prod-5',
    businessId: 'biz-farmacia-2',
    name: 'Protector Solar Facial FPS 50+ 50ml',
    description: 'Toque seco ultra ligero con alta protección UV y ácido hialurónico.',
    price: 340,
    originalPrice: 420,
    category: 'Dermatología',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 30,
    tags: ['bloqueador', 'solar', 'protector', 'piel', 'crema', 'dermatologia'],
    isOfferOfTheDay: true
  },
  {
    id: 'prod-6',
    businessId: 'biz-farmacia-2',
    name: 'Multivitamínico + Zinc & Vitamina C',
    description: 'Refuerzo para el sistema inmune y energía diaria con 30 cápsulas.',
    price: 210,
    category: 'Suplementos',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 65,
    tags: ['vitaminas', 'zinc', 'vitamina c', 'defensas', 'energia', 'suplemento'],
    isOfferOfTheDay: false
  },

  // Burger Craft
  {
    id: 'prod-7',
    businessId: 'biz-resto-1',
    name: 'Combo Monster Bacon Cheeseburger',
    description: 'Doble carne de res premium 300g, tocino ahumado crujiente, queso cheddar derretido + Papas + Bebida.',
    price: 189,
    originalPrice: 245,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 50,
    tags: ['hamburguesa', 'burger', 'queso', 'tocino', 'combo', 'papas', 'comida'],
    isOfferOfTheDay: true
  },
  {
    id: 'prod-8',
    businessId: 'biz-resto-1',
    name: 'Alitas BBQ Habanero (12 piezas)',
    description: 'Alitas doradas bañadas en salsa BBQ artesanal con toque de chile habanero y aderezo ranch.',
    price: 165,
    category: 'Alitas & Snacks',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 40,
    tags: ['alitas', 'wings', 'bbq', 'picante', 'botana', 'snack'],
    isOfferOfTheDay: false
  },

  // Pizzería Napolitana
  {
    id: 'prod-9',
    businessId: 'biz-resto-2',
    name: 'Pizza Pepperoni Clásica Grande (8 rebanadas)',
    description: 'Masa madre fermentada 48 hrs, salsa pomodoro San Marzano, mozzarella fior di latte y pepperoni selecto.',
    price: 230,
    originalPrice: 280,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 35,
    tags: ['pizza', 'pepperoni', 'queso', 'italiana', 'cena', 'horno'],
    isOfferOfTheDay: true
  },

  // Tacos Los Compadres
  {
    id: 'prod-10',
    businessId: 'biz-resto-3',
    name: 'Orden 5 Tacos de Pastor con Queso y Piña',
    description: 'Carne al pastor marinada al carbón en doble tortilla de maíz taquera con cebolla, cilantro y salsas.',
    price: 120,
    originalPrice: 150,
    category: 'Tacos',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60',
    inStock: true,
    stockCount: 120,
    tags: ['tacos', 'pastor', 'taqueria', 'mexicana', 'antojitos', 'salsa'],
    isOfferOfTheDay: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    businessId: 'biz-resto-1',
    businessName: 'Burger Craft & Wings House',
    businessLogo: '🍔',
    customerName: 'Carlos Mendoza',
    customerPhone: '+52 55 8912 3456',
    items: [
      {
        product: INITIAL_PRODUCTS[6], // Burger combo
        quantity: 2,
        businessId: 'biz-resto-1'
      },
      {
        product: INITIAL_PRODUCTS[7], // Wings
        quantity: 1,
        businessId: 'biz-resto-1'
      }
    ],
    subtotal: 543,
    deliveryFee: 35,
    total: 578,
    deliveryType: 'delivery',
    deliveryAddress: 'Calle Insurgentes Sur 950, Depto 402',
    deliveryCoordinates: { lat: 19.3820, lng: -99.1760 },
    paymentMethod: 'card',
    status: 'on_the_way',
    createdAt: 'Hace 15 min',
    notes: 'Tocar el timbre 402 por favor'
  },
  {
    id: 'ORD-9820',
    businessId: 'biz-farmacia-1',
    businessName: 'Farmacias San Rafael Express',
    businessLogo: '💊',
    customerName: 'Mariana Gómez',
    customerPhone: '+52 55 7766 5544',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Paracetamol
        quantity: 2,
        businessId: 'biz-farmacia-1'
      },
      {
        product: INITIAL_PRODUCTS[2], // Jarabe
        quantity: 1,
        businessId: 'biz-farmacia-1'
      }
    ],
    subtotal: 200,
    deliveryFee: 0,
    total: 200,
    deliveryType: 'pickup',
    deliveryAddress: 'Recoger en Sucursal: Av. Central 452',
    paymentMethod: 'cash_on_delivery',
    status: 'ready',
    createdAt: 'Hace 30 min',
    notes: 'Pagaré en efectivo en mostrador'
  }
];

export const INITIAL_CAMPAIGNS: WhatsAppCampaign[] = [
  {
    id: 'camp-1',
    title: 'Flash Promo Fin de Semana: 30% OFF en Pizzas & Burgers',
    message: '🔥 ¡Hola! Aprovecha este fin de semana con 30% de descuento en tus restaurantes favoritos usando el código MARKET30. Pide aquí: https://marketplace.app/deals',
    targetAudience: 'food_users',
    status: 'sent',
    sentCount: 3450,
    openRate: 94.2,
    clickRate: 38.5,
    date: '2026-08-20'
  },
  {
    id: 'camp-2',
    title: 'Botiquín de Emergencia 24/7 en tu zona',
    message: '💊 ¿Necesitas medicamentos urgentes? Encuentra la farmacia de guardia más cercana a tu ubicación en segundos.',
    targetAudience: 'all',
    status: 'sent',
    sentCount: 5200,
    openRate: 91.8,
    clickRate: 29.4,
    date: '2026-08-15'
  }
];

export const INITIAL_CHATBOT_CONFIG: ChatbotConfig = {
  metaApiToken: 'EAAG...META_CLOUD_API_TOKEN_PULSO',
  phoneNumberId: '10982348572194',
  businessAccountId: 'WABA_992817264819',
  webhookVerifyToken: 'pulso_secure_webhook_token_2026',
  welcomeMessage: '👋 ¡Hola! Bienvenido al asistente oficial de Pulso. ¿Qué estás buscando hoy? (Ejemplo: "paracetamol cerca", "hamburguesas", "farmacia 24h", "pizza")',
  featuredOfferId: 'prod-7', // Monster burger
  autoDeepLinksEnabled: true,
  geminiSmartSearch: true,
  maxDistanceKm: 10,
  customKeywords: [
    { keyword: 'paracetamol', category: 'farmacia', targetTag: 'paracetamol' },
    { keyword: 'dolor', category: 'farmacia', targetTag: 'analgesico' },
    { keyword: 'gripe', category: 'farmacia', targetTag: 'antigripal' },
    { keyword: 'hamburguesa', category: 'restaurante', targetTag: 'hamburguesas' },
    { keyword: 'pizza', category: 'restaurante', targetTag: 'pizza' },
    { keyword: 'tacos', category: 'restaurante', targetTag: 'tacos' },
    { keyword: 'bloqueador', category: 'farmacia', targetTag: 'bloqueador' }
  ]
};

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Casa 🏠',
    address: 'Av. División del Norte 1420, Depto 301, Benito Juárez',
    coordinates: { lat: 19.3850, lng: -99.1620 },
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Trabajo / Oficina 🏢',
    address: 'Paseo de la Reforma 222, Piso 14, Cuauhtémoc',
    coordinates: { lat: 19.4290, lng: -99.1610 },
    isDefault: false
  }
];
