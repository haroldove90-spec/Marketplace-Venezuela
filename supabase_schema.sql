-- ==============================================================================
-- PULSO MARKETPLACE - ESQUEMA COMPLETO Y DATOS INICIALES PARA SUPABASE
-- Proyecto: marketplace@force-express.com's Project
-- Project ID: cjoszqkgqtgfvzqxcsvi
-- URL: https://cjoszqkgqtgfvzqxcsvi.supabase.co
-- ==============================================================================
-- INSTRUCCIONES:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/cjoszqkgqtgfvzqxcsvi
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor".
-- 3. Haz clic en "New Query".
-- 4. Pega todo el contenido de este archivo y presiona "RUN" (o Ctrl + Enter).
-- ==============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLA: businesses (Comercios, Farmacias y Restaurantes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('farmacia', 'restaurante')),
    logo TEXT NOT NULL DEFAULT '🏬',
    banner_image TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    coordinates JSONB NOT NULL DEFAULT '{"lat": 19.4120, "lng": -99.1650}'::jsonb,
    opening_hours TEXT NOT NULL DEFAULT '08:00 AM - 10:00 PM',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.0,
    custom_pin_color TEXT NOT NULL DEFAULT '#10b981',
    delivery_time TEXT NOT NULL DEFAULT '20-35 min',
    min_order NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para businesses
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON public.businesses(is_active);

-- ------------------------------------------------------------------------------
-- 2. TABLA: products (Catálogo de productos e inventario)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL DEFAULT 'General',
    image TEXT NOT NULL DEFAULT '',
    in_stock BOOLEAN NOT NULL DEFAULT true,
    stock_count INTEGER NOT NULL DEFAULT 100,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_offer_of_the_day BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_offer ON public.products(is_offer_of_the_day);

-- ------------------------------------------------------------------------------
-- 3. TABLA: orders (Pedidos, Checkout App y WhatsApp)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    business_name TEXT NOT NULL DEFAULT '',
    business_logo TEXT NOT NULL DEFAULT '',
    customer_name TEXT NOT NULL DEFAULT '',
    customer_phone TEXT NOT NULL DEFAULT '',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
    delivery_address TEXT NOT NULL DEFAULT '',
    delivery_coordinates JSONB,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cash_on_delivery', 'pos_terminal')),
    order_channel TEXT NOT NULL DEFAULT 'app' CHECK (order_channel IN ('app', 'whatsapp')),
    status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'ready', 'on_the_way', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. TABLA: whatsapp_campaigns (Campañas de difusión por WhatsApp)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience TEXT NOT NULL DEFAULT 'all',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
    sent_count INTEGER NOT NULL DEFAULT 0,
    open_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    click_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    date TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABLA: chatbot_config (Configuración del Chatbot IA y Webhook de WhatsApp)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chatbot_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    meta_api_token TEXT NOT NULL DEFAULT '',
    phone_number_id TEXT NOT NULL DEFAULT '',
    business_account_id TEXT NOT NULL DEFAULT '',
    webhook_verify_token TEXT NOT NULL DEFAULT '',
    welcome_message TEXT NOT NULL DEFAULT '¡Hola! Soy el asistente virtual de Pulso. ¿En qué puedo ayudarte hoy?',
    featured_offer_id TEXT NOT NULL DEFAULT '',
    auto_deep_links_enabled BOOLEAN NOT NULL DEFAULT true,
    gemini_smart_search BOOLEAN NOT NULL DEFAULT true,
    max_distance_km NUMERIC(5, 2) NOT NULL DEFAULT 8.0,
    custom_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. TABLA: saved_addresses (Direcciones frecuentes de clientes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_addresses (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB NOT NULL DEFAULT '{"lat": 19.4120, "lng": -99.1650}'::jsonb,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- Permite acceso anónimo seguro mediante tu API key pública (anon)
-- ==============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
DROP POLICY IF EXISTS "Public access for businesses" ON public.businesses;
CREATE POLICY "Public access for businesses" ON public.businesses
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas para products
DROP POLICY IF EXISTS "Public access for products" ON public.products;
CREATE POLICY "Public access for products" ON public.products
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas para orders
DROP POLICY IF EXISTS "Public access for orders" ON public.orders;
CREATE POLICY "Public access for orders" ON public.orders
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas para whatsapp_campaigns
DROP POLICY IF EXISTS "Public access for whatsapp_campaigns" ON public.whatsapp_campaigns;
CREATE POLICY "Public access for whatsapp_campaigns" ON public.whatsapp_campaigns
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas para chatbot_config
DROP POLICY IF EXISTS "Public access for chatbot_config" ON public.chatbot_config;
CREATE POLICY "Public access for chatbot_config" ON public.chatbot_config
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas para saved_addresses
DROP POLICY IF EXISTS "Public access for saved_addresses" ON public.saved_addresses;
CREATE POLICY "Public access for saved_addresses" ON public.saved_addresses
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- HABILITAR TIEMPO REAL (REALTIME) EN SUPABASE
-- Permite sincronizar pedidos y productos en vivo sin recargar la página
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'businesses'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
    END IF;
END $$;

-- ==============================================================================
-- DATOS SEMILLA (SEED DATA)
-- Inserción inicial de farmacias, restaurantes y productos comparables
-- ==============================================================================

-- 1. Insertar Comercios
INSERT INTO public.businesses (
    id, name, category, logo, banner_image, phone, address, coordinates,
    opening_hours, rating, reviews_count, is_verified, is_active,
    commission_rate, custom_pin_color, delivery_time, min_order, tags
) VALUES
(
    'biz-farmacia-1', 'Farmacias San Rafael Express', 'farmacia', '💊',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60',
    '+52 55 8765 4321', 'Av. Central 452, Col. Del Valle', '{"lat": 19.3985, "lng": -99.1685}'::jsonb,
    '24 Horas (Lunes a Domingo)', 4.8, 142, true, true,
    8.0, '#10b981', '15-25 min', 100.0,
    ARRAY['farmacia', 'medicamentos', 'urgencias', 'salud', 'paracetamol', 'antigripal', 'dolor']
),
(
    'biz-farmacia-2', 'Farmacia & Dermocuidado Vitalis', 'farmacia', '🌿',
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=60',
    '+52 55 1234 5678', 'Calle Durango 188, Col. Roma Norte', '{"lat": 19.4190, "lng": -99.1650}'::jsonb,
    '08:00 AM - 10:00 PM', 4.9, 98, true, true,
    9.0, '#059669', '20-30 min', 150.0,
    ARRAY['dermocosmetica', 'vitaminas', 'suplementos', 'pediatria', 'analgesico', 'bloqueador', 'skincare']
),
(
    'biz-farmacia-3', 'Farmacia Familiar & Pediátrica San Lucas', 'farmacia', '🍼',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=60',
    '+52 55 4433 2211', 'Av. Coyoacán 810, Col. Del Valle Sur', '{"lat": 19.3750, "lng": -99.1710}'::jsonb,
    '07:00 AM - 11:00 PM', 4.9, 165, true, true,
    8.0, '#0ea5e9', '20-35 min', 120.0,
    ARRAY['pediatria', 'bebes', 'panales', 'leche', 'termometro', 'infantil', 'salud']
),
(
    'biz-farmacia-4', 'Farmacia Botica Natural VerdeVida', 'farmacia', '🍃',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=60',
    '+52 55 9988 7766', 'Av. Tamaulipas 64, Col. Condesa', '{"lat": 19.4110, "lng": -99.1730}'::jsonb,
    '09:00 AM - 09:00 PM', 4.7, 84, true, true,
    8.0, '#16a34a', '25-40 min', 130.0,
    ARRAY['natural', 'homeopatia', 'propoleo', 'colageno', 'herbolaria', 'te', 'suplementos']
),
(
    'biz-resto-1', 'Burger Craft & Wings House', 'restaurante', '🍔',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60',
    '+52 55 9876 5432', 'Av. Insurgentes Sur 1205, Mixcoac', '{"lat": 19.3780, "lng": -99.1790}'::jsonb,
    '12:00 PM - 11:30 PM', 4.7, 310, true, true,
    12.0, '#f97316', '25-40 min', 120.0,
    ARRAY['hamburguesas', 'alitas', 'papas', 'comida rapida', 'cena', 'bbq', 'tocino']
),
(
    'biz-resto-2', 'Pizzería Napolitana Bella Forno', 'restaurante', '🍕',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
    '+52 55 4567 8901', 'Av. Álvaro Obregón 85, Col. Condesa', '{"lat": 19.4165, "lng": -99.1600}'::jsonb,
    '01:00 PM - 11:00 PM', 4.9, 224, true, true,
    10.0, '#ef4444', '30-45 min', 180.0,
    ARRAY['pizza', 'artesanal', 'italiana', 'pasta', 'lasagna', 'cena', 'pepperoni']
),
(
    'biz-resto-3', 'Tacos Los Compadres & Birria', 'restaurante', '🌮',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=60',
    '+52 55 3322 1100', 'Eje Central Lázaro Cárdenas 210, Centro', '{"lat": 19.4340, "lng": -99.1410}'::jsonb,
    '10:00 AM - 02:00 AM', 4.8, 450, true, true,
    10.0, '#eab308', '15-30 min', 80.0,
    ARRAY['tacos', 'pastor', 'birria', 'consome', 'antojitos', 'cena', 'quesadillas']
),
(
    'biz-resto-4', 'Sushi Roll Master & Poke Bar', 'restaurante', '🍣',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60',
    '+52 55 6677 8899', 'Calle Michoacán 42, Col. Condesa', '{"lat": 19.4125, "lng": -99.1705}'::jsonb,
    '12:30 PM - 10:30 PM', 4.8, 189, true, true,
    11.0, '#ec4899', '25-35 min', 150.0,
    ARRAY['sushi', 'poke', 'salmon', 'japonesa', 'rollos', 'mariscos', 'tempura']
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    logo = EXCLUDED.logo,
    banner_image = EXCLUDED.banner_image,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    coordinates = EXCLUDED.coordinates,
    opening_hours = EXCLUDED.opening_hours,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    is_verified = EXCLUDED.is_verified,
    is_active = EXCLUDED.is_active,
    commission_rate = EXCLUDED.commission_rate,
    custom_pin_color = EXCLUDED.custom_pin_color,
    delivery_time = EXCLUDED.delivery_time,
    min_order = EXCLUDED.min_order,
    tags = EXCLUDED.tags;

-- 2. Insertar Productos de Ejemplo y Comparables
INSERT INTO public.products (
    id, business_id, name, description, price, original_price,
    category, image, in_stock, stock_count, tags, is_offer_of_the_day
) VALUES
(
    'prod-farm-1', 'biz-farmacia-1', 'Paracetamol 500mg (Caja con 20 tabletas)',
    'Alivio eficaz del dolor de cabeza, dolor dental y reducción de la fiebre.',
    45.0, 58.0, 'Medicamentos',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    true, 120, ARRAY['paracetamol', 'analgesico', 'fiebre', 'dolor', 'medicamento'], true
),
(
    'prod-comp-para-2', 'biz-farmacia-2', 'Paracetamol 500mg Genérico (Caja 20 tabletas)',
    'Analgésico y antipirético para alivio rápido de dolor leve a moderado.',
    48.0, NULL, 'Medicamentos',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    true, 60, ARRAY['paracetamol', 'analgesico', 'fiebre', 'dolor', 'medicamento'], false
),
(
    'prod-comp-para-3', 'biz-farmacia-3', 'Paracetamol 500mg Línea Familiar (20 tabletas)',
    'Fórmula efectiva para control térmico y malestar general en adultos.',
    42.0, 55.0, 'Medicamentos',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    true, 95, ARRAY['paracetamol', 'analgesico', 'fiebre', 'dolor de cabeza', 'medicamento'], true
),
(
    'prod-farm-2', 'biz-farmacia-1', 'Suero Oral Electrolitos 500ml Manzana',
    'Solución rehidratante oral con glucosa y electrolitos balanceados.',
    32.0, 40.0, 'Cuidado & Bienestar',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    true, 90, ARRAY['suero', 'electrolitos', 'hidratacion', 'deshidratacion'], true
),
(
    'prod-comp-suero-2', 'biz-farmacia-2', 'Suero Oral Electrolitos 500ml Fresa-Kiwi',
    'Bebida isotónica grado farmacéutico para rehidratación inmediata.',
    35.0, NULL, 'Cuidado & Bienestar',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    true, 80, ARRAY['suero', 'electrolitos', 'hidratacion', 'resaca', 'estomago'], false
),
(
    'prod-comp-suero-3', 'biz-farmacia-3', 'Suero Oral Pediátrico & Familiar 500ml',
    'Fórmula balanceada con zinc para recuperación gastrointestinal.',
    29.0, 38.0, 'Cuidado & Bienestar',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    true, 110, ARRAY['suero', 'electrolitos', 'bebe', 'pediatria', 'hidratacion', 'fiebre'], true
),
(
    'prod-resto-1', 'biz-resto-1', 'Hamburguesa Doble Smash con Queso Cheddar & Tocino',
    'Doble carne angus de 120g con queso cheddar madurado, tocino crujiente y aderezo especial.',
    159.0, 189.0, 'Hamburguesas',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    true, 40, ARRAY['hamburguesa', 'burger', 'tocino', 'carne', 'queso', 'comida'], true
),
(
    'prod-resto-2', 'biz-resto-2', 'Pizza Napolitana Margarita Clásica',
    'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca y aceite de oliva virgen extra.',
    195.0, 230.0, 'Pizzas',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    true, 25, ARRAY['pizza', 'margarita', 'queso', 'albahaca', 'italiana', 'cena'], true
),
(
    'prod-resto-3', 'biz-resto-3', 'Orden de 5 Tacos al Pastor con Queso & Piña',
    'Cinco tacos de pastor adobado al carbón con cilantro, cebolla, piña asada y queso asadero.',
    95.0, 115.0, 'Tacos',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60',
    true, 150, ARRAY['tacos', 'pastor', 'queso', 'pina', 'antojitos', 'comida'], true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    category = EXCLUDED.category,
    image = EXCLUDED.image,
    in_stock = EXCLUDED.in_stock,
    stock_count = EXCLUDED.stock_count,
    tags = EXCLUDED.tags,
    is_offer_of_the_day = EXCLUDED.is_offer_of_the_day;

-- 3. Insertar Configuración del Chatbot
INSERT INTO public.chatbot_config (
    id, welcome_message, featured_offer_id, auto_deep_links_enabled,
    gemini_smart_search, max_distance_km, custom_keywords
) VALUES (
    'default',
    '¡Hola! Soy PulsoBot, tu asistente inteligente para encontrar y pedir en farmacias y restaurantes cercanos.',
    'prod-farm-1', true, true, 8.0,
    '[
        {"keyword": "paracetamol", "category": "farmacia", "targetTag": "paracetamol"},
        {"keyword": "dolor", "category": "farmacia", "targetTag": "analgesico"},
        {"keyword": "hamburguesa", "category": "restaurante", "targetTag": "hamburguesa"},
        {"keyword": "pizza", "category": "restaurante", "targetTag": "pizza"},
        {"keyword": "suero", "category": "farmacia", "targetTag": "suero"}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    welcome_message = EXCLUDED.welcome_message,
    featured_offer_id = EXCLUDED.featured_offer_id,
    auto_deep_links_enabled = EXCLUDED.auto_deep_links_enabled,
    gemini_smart_search = EXCLUDED.gemini_smart_search,
    max_distance_km = EXCLUDED.max_distance_km,
    custom_keywords = EXCLUDED.custom_keywords;

-- 4. Insertar Direcciones de Prueba
INSERT INTO public.saved_addresses (id, label, address, coordinates, is_default)
VALUES
(
    'addr-1', 'Casa', 'Av. Michoacán 84, Col. Condesa',
    '{"lat": 19.4120, "lng": -99.1650}'::jsonb, true
),
(
    'addr-2', 'Oficina', 'Paseo de la Reforma 222, Col. Juárez',
    '{"lat": 19.4290, "lng": -99.1620}'::jsonb, false
)
ON CONFLICT (id) DO NOTHING;
