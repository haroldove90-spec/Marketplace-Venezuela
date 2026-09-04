import { createClient } from '@supabase/supabase-js';
import {
  Business,
  Product,
  Order,
  WhatsAppCampaign,
  ChatbotConfig,
  SavedAddress,
  OrderStatus
} from '../types';

// Supabase Configuration from User Credentials
const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const SUPABASE_URL: string =
  metaEnv.VITE_SUPABASE_URL || 'https://cjoszqkgqtgfvzqxcsvi.supabase.co';

export const SUPABASE_ANON_KEY: string =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqb3N6cWtncXRnZnZ6cXhjc3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3OTksImV4cCI6MjEwNDA2Njc5OX0.L-u61LH5GKKrBWgnxThVbRWitqmdXtHJH64MhlWJqOQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// MAPPERS: TypeScript (camelCase) <-> DB (snake_case)
// ==========================================

export function mapBusinessFromDB(row: any): Business {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    logo: row.logo || '🏬',
    bannerImage: row.banner_image || '',
    phone: row.phone || '',
    address: row.address || '',
    coordinates: row.coordinates || { lat: 19.412, lng: -99.165 },
    openingHours: row.opening_hours || '08:00 AM - 10:00 PM',
    rating: Number(row.rating ?? 5.0),
    reviewsCount: Number(row.reviews_count ?? 0),
    isVerified: Boolean(row.is_verified ?? true),
    isActive: Boolean(row.is_active ?? true),
    commissionRate: Number(row.commission_rate ?? 10),
    customPinColor: row.custom_pin_color || '#10b981',
    deliveryTime: row.delivery_time || '20-35 min',
    minOrder: Number(row.min_order ?? 0),
    tags: Array.isArray(row.tags) ? row.tags : []
  };
}

export function mapBusinessToDB(biz: Business): any {
  return {
    id: biz.id,
    name: biz.name,
    category: biz.category,
    logo: biz.logo,
    banner_image: biz.bannerImage,
    phone: biz.phone,
    address: biz.address,
    coordinates: biz.coordinates,
    opening_hours: biz.openingHours,
    rating: biz.rating,
    reviews_count: biz.reviewsCount,
    is_verified: biz.isVerified,
    is_active: biz.isActive,
    commission_rate: biz.commissionRate,
    custom_pin_color: biz.customPinColor,
    delivery_time: biz.deliveryTime,
    min_order: biz.minOrder,
    tags: biz.tags
  };
}

export function mapProductFromDB(row: any): Product {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    category: row.category || 'General',
    image: row.image || '',
    inStock: Boolean(row.in_stock ?? true),
    stockCount: Number(row.stock_count ?? 50),
    tags: Array.isArray(row.tags) ? row.tags : [],
    isOfferOfTheDay: Boolean(row.is_offer_of_the_day ?? false)
  };
}

export function mapProductToDB(prod: Product): any {
  return {
    id: prod.id,
    business_id: prod.businessId,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    original_price: prod.originalPrice || null,
    category: prod.category,
    image: prod.image,
    in_stock: prod.inStock,
    stock_count: prod.stockCount,
    tags: prod.tags,
    is_offer_of_the_day: prod.isOfferOfTheDay
  };
}

export function mapOrderFromDB(row: any): Order {
  return {
    id: row.id,
    businessId: row.business_id,
    businessName: row.business_name || '',
    businessLogo: row.business_logo || '',
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee ?? 0),
    total: Number(row.total),
    deliveryType: row.delivery_type,
    deliveryAddress: row.delivery_address || '',
    deliveryCoordinates: row.delivery_coordinates || undefined,
    paymentMethod: row.payment_method,
    orderChannel: row.order_channel || 'app',
    status: row.status,
    createdAt: row.created_at || 'Reciente',
    notes: row.notes || undefined
  };
}

export function mapOrderToDB(order: Order): any {
  return {
    id: order.id,
    business_id: order.businessId,
    business_name: order.businessName,
    business_logo: order.businessLogo,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    delivery_type: order.deliveryType,
    delivery_address: order.deliveryAddress,
    delivery_coordinates: order.deliveryCoordinates || null,
    payment_method: order.paymentMethod,
    order_channel: order.orderChannel || 'app',
    status: order.status,
    notes: order.notes || null,
    created_at: new Date().toISOString()
  };
}

export function mapCampaignFromDB(row: any): WhatsAppCampaign {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    targetAudience: row.target_audience,
    status: row.status,
    sentCount: Number(row.sent_count ?? 0),
    openRate: Number(row.open_rate ?? 0),
    clickRate: Number(row.click_rate ?? 0),
    date: row.date || new Date().toISOString()
  };
}

export function mapCampaignToDB(camp: WhatsAppCampaign): any {
  return {
    id: camp.id,
    title: camp.title,
    message: camp.message,
    target_audience: camp.targetAudience,
    status: camp.status,
    sent_count: camp.sentCount,
    open_rate: camp.openRate,
    click_rate: camp.clickRate,
    date: camp.date
  };
}

export function mapChatbotFromDB(row: any): ChatbotConfig {
  return {
    metaApiToken: row.meta_api_token || '',
    phoneNumberId: row.phone_number_id || '',
    businessAccountId: row.business_account_id || '',
    webhookVerifyToken: row.webhook_verify_token || '',
    welcomeMessage: row.welcome_message || '',
    featuredOfferId: row.featured_offer_id || '',
    autoDeepLinksEnabled: Boolean(row.auto_deep_links_enabled ?? true),
    geminiSmartSearch: Boolean(row.gemini_smart_search ?? true),
    maxDistanceKm: Number(row.max_distance_km ?? 8),
    customKeywords: Array.isArray(row.custom_keywords) ? row.custom_keywords : []
  };
}

export function mapChatbotToDB(cfg: ChatbotConfig): any {
  return {
    id: 'default',
    meta_api_token: cfg.metaApiToken,
    phone_number_id: cfg.phoneNumberId,
    business_account_id: cfg.businessAccountId,
    webhook_verify_token: cfg.webhookVerifyToken,
    welcome_message: cfg.welcomeMessage,
    featured_offer_id: cfg.featuredOfferId,
    auto_deep_links_enabled: cfg.autoDeepLinksEnabled,
    gemini_smart_search: cfg.geminiSmartSearch,
    max_distance_km: cfg.maxDistanceKm,
    custom_keywords: cfg.customKeywords,
    updated_at: new Date().toISOString()
  };
}

export function mapAddressFromDB(row: any): SavedAddress {
  return {
    id: row.id,
    label: row.label,
    address: row.address,
    coordinates: row.coordinates || { lat: 19.412, lng: -99.165 },
    isDefault: Boolean(row.is_default ?? false)
  };
}

export function mapAddressToDB(addr: SavedAddress): any {
  return {
    id: addr.id,
    label: addr.label,
    address: addr.address,
    coordinates: addr.coordinates,
    is_default: addr.isDefault ?? false
  };
}

// ==========================================
// SUPABASE OPERATIONS & HEALTH CHECKS
// ==========================================

/**
 * Checks connection to the user's Supabase database.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  hasTables: boolean;
  tableCounts?: { [tableName: string]: number };
}> {
  try {
    const { data, error } = await supabase.from('businesses').select('id', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist yet (PGRST204 or 42P01 in postgres)
      if (error.code === '42P01' || error.message.includes('relation "businesses" does not exist') || error.message.includes('not found')) {
        return {
          connected: true,
          message: 'Conectado exitosamente a Supabase. Las tablas aún no han sido creadas en el Editor SQL.',
          hasTables: false
        };
      }
      return {
        connected: false,
        message: `Error de respuesta Supabase: ${error.message}`,
        hasTables: false
      };
    }

    // Now query counts
    const counts: { [tableName: string]: number } = {};
    const tables = ['businesses', 'products', 'orders', 'whatsapp_campaigns', 'saved_addresses'];
    
    for (const t of tables) {
      try {
        const { count } = await supabase.from(t).select('id', { count: 'exact', head: true });
        counts[t] = count ?? 0;
      } catch (e) {
        counts[t] = 0;
      }
    }

    return {
      connected: true,
      message: 'Conexión activa y tablas verificadas en Supabase PostgreSQL.',
      hasTables: true,
      tableCounts: counts
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Error al intentar conectar con Supabase: ${err.message || err}`,
      hasTables: false
    };
  }
}

/**
 * Fetches all businesses from Supabase.
 */
export async function fetchBusinessesFromSupabase(): Promise<Business[] | null> {
  try {
    const { data, error } = await supabase.from('businesses').select('*').order('name');
    if (error || !data) return null;
    return data.map(mapBusinessFromDB);
  } catch (err) {
    console.warn('Error fetching businesses from Supabase:', err);
    return null;
  }
}

/**
 * Fetches all products from Supabase.
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error || !data) return null;
    return data.map(mapProductFromDB);
  } catch (err) {
    console.warn('Error fetching products from Supabase:', err);
    return null;
  }
}

/**
 * Fetches all orders from Supabase.
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapOrderFromDB);
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err);
    return null;
  }
}

/**
 * Upserts a business in Supabase.
 */
export async function upsertBusinessInSupabase(biz: Business): Promise<boolean> {
  try {
    const { error } = await supabase.from('businesses').upsert(mapBusinessToDB(biz));
    if (error) {
      console.warn('Supabase upsertBusiness error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsertBusiness exception:', err);
    return false;
  }
}

/**
 * Deletes a business in Supabase.
 */
export async function deleteBusinessInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('businesses').delete().eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

/**
 * Upserts a product in Supabase.
 */
export async function upsertProductInSupabase(prod: Product): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').upsert(mapProductToDB(prod));
    if (error) {
      console.warn('Supabase upsertProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsertProduct exception:', err);
    return false;
  }
}

/**
 * Deletes a product in Supabase.
 */
export async function deleteProductInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

/**
 * Inserts an order into Supabase.
 */
export async function insertOrderInSupabase(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').insert(mapOrderToDB(order));
    if (error) {
      console.warn('Supabase insertOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase insertOrder exception:', err);
    return false;
  }
}

/**
 * Updates order status in Supabase.
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  newStatus: OrderStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    return !error;
  } catch (err) {
    return false;
  }
}

/**
 * Seed all initial dataset to Supabase in batch.
 */
export async function seedAllDataToSupabase(params: {
  businesses: Business[];
  products: Product[];
  orders: Order[];
  campaigns: WhatsAppCampaign[];
  chatbotConfig: ChatbotConfig;
  savedAddresses: SavedAddress[];
}): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Businesses
    const bizRows = params.businesses.map(mapBusinessToDB);
    const { error: bizErr } = await supabase.from('businesses').upsert(bizRows, { onConflict: 'id' });
    if (bizErr) throw new Error(`Negocios: ${bizErr.message}`);

    // 2. Products
    const prodRows = params.products.map(mapProductToDB);
    const { error: prodErr } = await supabase.from('products').upsert(prodRows, { onConflict: 'id' });
    if (prodErr) throw new Error(`Productos: ${prodErr.message}`);

    // 3. Orders
    const orderRows = params.orders.map(mapOrderToDB);
    const { error: orderErr } = await supabase.from('orders').upsert(orderRows, { onConflict: 'id' });
    if (orderErr) throw new Error(`Órdenes: ${orderErr.message}`);

    // 4. WhatsApp Campaigns
    const campRows = params.campaigns.map(mapCampaignToDB);
    const { error: campErr } = await supabase.from('whatsapp_campaigns').upsert(campRows, { onConflict: 'id' });
    if (campErr) throw new Error(`Campañas: ${campErr.message}`);

    // 5. Chatbot Config
    const chatRow = mapChatbotToDB(params.chatbotConfig);
    const { error: chatErr } = await supabase.from('chatbot_config').upsert(chatRow, { onConflict: 'id' });
    if (chatErr) throw new Error(`Chatbot Config: ${chatErr.message}`);

    // 6. Saved Addresses
    const addrRows = params.savedAddresses.map(mapAddressToDB);
    const { error: addrErr } = await supabase.from('saved_addresses').upsert(addrRows, { onConflict: 'id' });
    if (addrErr) throw new Error(`Direcciones: ${addrErr.message}`);

    return {
      success: true,
      message: `¡Sincronización exitosa! Se sembraron ${bizRows.length} comercios, ${prodRows.length} productos y ${orderRows.length} pedidos en Supabase.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error al sembrar en Supabase: ${err.message || err}`
    };
  }
}
