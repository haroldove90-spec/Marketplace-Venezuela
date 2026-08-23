export type Role = 'client' | 'seller' | 'admin';

export type BusinessCategory = 'farmacia' | 'restaurante';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  logo: string;
  bannerImage: string;
  phone: string;
  address: string;
  coordinates: Coordinates;
  openingHours: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isActive: boolean;
  commissionRate: number; // e.g. 10 (%)
  customPinColor: string;
  deliveryTime: string; // e.g. '20-35 min'
  minOrder: number;
  tags: string[];
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  inStock: boolean;
  stockCount: number;
  tags: string[]; // for Chatbot search: e.g. ['paracetamol', 'analgesico', 'fiebre']
  isOfferOfTheDay: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  businessId: string;
}

export type OrderStatus = 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'card' | 'cash_on_delivery' | 'pos_terminal';

export interface Order {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryCoordinates?: Coordinates;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'farmacias_users' | 'food_users' | 'inactive_users';
  status: 'draft' | 'scheduled' | 'sent';
  sentCount: number;
  openRate: number;
  clickRate: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  type?: 'text' | 'location' | 'product_card' | 'business_card' | 'quick_reply';
  data?: any;
}

export interface ChatbotConfig {
  metaApiToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookVerifyToken: string;
  welcomeMessage: string;
  featuredOfferId: string;
  autoDeepLinksEnabled: boolean;
  geminiSmartSearch: boolean;
  maxDistanceKm: number;
  customKeywords: { keyword: string; category: BusinessCategory; targetTag: string }[];
}

export interface SavedAddress {
  id: string;
  label: string; // 'Casa', 'Oficina', 'Mamá'
  address: string;
  coordinates: Coordinates;
  isDefault?: boolean;
}
