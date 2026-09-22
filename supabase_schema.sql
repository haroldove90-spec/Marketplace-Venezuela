-- ==============================================================================
-- CON FORCE MARKETPLACE - ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Ejecuta este script en el SQL Editor de tu panel de Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLA DE USUARIOS (users)
-- Compatible con Clientes, Vendedores y Administradores
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'seller', 'admin')),
    phone TEXT,
    address TEXT,
    business_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==============================================================================
-- 3. TABLA DE NEGOCIOS / COMERCIOS ALIADOS (businesses)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY DEFAULT ('biz_' || substring(gen_random_uuid()::TEXT from 1 for 8)),
    name TEXT NOT NULL,
    rif TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'Repuestos',
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Caracas',
    state TEXT NOT NULL DEFAULT 'Distrito Capital',
    lat DOUBLE PRECISION NOT NULL DEFAULT 10.4806,
    lng DOUBLE PRECISION NOT NULL DEFAULT -66.9036,
    rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_sponsor BOOLEAN NOT NULL DEFAULT false,
    owner_username TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_username);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);

-- ==============================================================================
-- 4. TABLA DE PRODUCTOS / REPUESTOS (products)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod_' || substring(gen_random_uuid()::TEXT from 1 for 8)),
    business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    stock INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL,
    vehicle_compatibility TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- ==============================================================================
-- 5. TABLA DE PEDIDOS (orders)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord_' || substring(gen_random_uuid()::TEXT from 1 for 8)),
    client_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address TEXT NOT NULL,
    business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
    total NUMERIC(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_route', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL DEFAULT 'pago_movil',
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_client ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ==============================================================================
-- 6. POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas públicas permisivas para desarrollo / frontend anónimo autenticado por app:
DROP POLICY IF EXISTS "Permitir lectura publica de negocios" ON public.businesses;
CREATE POLICY "Permitir lectura publica de negocios" ON public.businesses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercion de negocios" ON public.businesses;
CREATE POLICY "Permitir insercion de negocios" ON public.businesses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion de negocios" ON public.businesses;
CREATE POLICY "Permitir actualizacion de negocios" ON public.businesses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
CREATE POLICY "Permitir lectura publica de productos" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
CREATE POLICY "Permitir gestion de productos" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir gestion de usuarios" ON public.users;
CREATE POLICY "Permitir gestion de usuarios" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir gestion de pedidos" ON public.orders;
CREATE POLICY "Permitir gestion de pedidos" ON public.orders FOR ALL USING (true);

-- ==============================================================================
-- 7. DATOS INICIALES SEMILLA (SEED DATA)
-- Incluye Superadmin Master y Comercios Iniciales
-- ==============================================================================

-- Superadmin Master
INSERT INTO public.users (id, username, name, email, password, role, phone, address)
VALUES (
    'usr_admin_master',
    'admin_master',
    'Administrador Maestro Con Force',
    'admin@conforce.com',
    'Chevropar#1970',
    'admin',
    '+58 412 1234567',
    'Sede Central Con Force, Caracas'
)
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password, role = 'admin';

-- Negocio Demostración 1: Multirepuestos Caracas
INSERT INTO public.businesses (id, name, rif, category, phone, email, address, city, state, lat, lng, rating, review_count, is_verified, is_sponsor)
VALUES (
    'biz_1',
    'Multirepuestos Caracas Express',
    'J-31415926-0',
    'Repuestos en General',
    '+58 412 5550199',
    'ventas@multirepuestosccs.com',
    'Av. Libertador, Sector Chacao, Caracas',
    'Caracas',
    'Distrito Capital',
    10.4912,
    -66.8524,
    4.9,
    142,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Negocio Demostración 2: Frenos y Embragues La Concordia
INSERT INTO public.businesses (id, name, rif, category, phone, email, address, city, state, lat, lng, rating, review_count, is_verified, is_sponsor)
VALUES (
    'biz_2',
    'Frenos y Embragues La Concordia',
    'J-20593847-1',
    'Frenos y Suspensión',
    '+58 414 9988771',
    'contacto@frenoslaconcordia.com',
    'Av. San Martín, Edif. Repuestos Centro, Caracas',
    'Caracas',
    'Distrito Capital',
    10.4851,
    -66.9205,
    4.8,
    89,
    true,
    false
)
ON CONFLICT (id) DO NOTHING;

-- Función para actualizar columna updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_businesses_updated_at ON public.businesses;
CREATE TRIGGER trigger_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
