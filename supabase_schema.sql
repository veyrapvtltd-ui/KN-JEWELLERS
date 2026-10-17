-- =========================================================================
-- SHREE ARADHNA JEWELLERS - COMPLETE SUPABASE SETUP SCRIPT
-- Branches: Gandhidham & Adipur, Gujarat
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id integer PRIMARY KEY DEFAULT 1,
    upi_id text DEFAULT '9638888170@okbizaxis',
    qr_code_url text DEFAULT '/assets/logo.png',
    phone_branch1 text DEFAULT '9638888170',
    phone_branch2 text DEFAULT '7202921222',
    instagram_branch1 text DEFAULT 'https://www.instagram.com/shree_aradhana_jewellers',
    instagram_branch2 text DEFAULT 'https://www.instagram.com/aradhanagoldhouse',
    updated_at timestamp with time zone DEFAULT now()
);

-- Seed default store settings if not exists
INSERT INTO public.store_settings (id, upi_id, qr_code_url, phone_branch1, phone_branch2)
VALUES (1, '9638888170@okbizaxis', '/assets/logo.png', '9638888170', '7202921222')
ON CONFLICT (id) DO UPDATE SET
    upi_id = EXCLUDED.upi_id,
    phone_branch1 = EXCLUDED.phone_branch1,
    phone_branch2 = EXCLUDED.phone_branch2;

-- 2. LIVE GOLD & SILVER RATES TABLE
CREATE TABLE IF NOT EXISTS public.saj_rates (
    id integer PRIMARY KEY DEFAULT 1,
    gold24k numeric DEFAULT 15500,
    gold22k numeric DEFAULT 14200,
    gold18k numeric DEFAULT 11625,
    silver numeric DEFAULT 235,
    hide24k boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure hide24k exists if table was created earlier
ALTER TABLE public.saj_rates ADD COLUMN IF NOT EXISTS hide24k boolean DEFAULT false;

-- Seed initial rates
INSERT INTO public.saj_rates (id, gold24k, gold22k, gold18k, silver, hide24k)
VALUES (1, 15500, 14200, 11625, 235, false)
ON CONFLICT (id) DO UPDATE SET
    gold24k = EXCLUDED.gold24k,
    gold22k = EXCLUDED.gold22k,
    gold18k = EXCLUDED.gold18k,
    silver = EXCLUDED.silver,
    hide24k = EXCLUDED.hide24k,
    updated_at = now();

-- Compatibility views for legacy or alternative rate queries
CREATE OR REPLACE VIEW public.hardik_rates AS SELECT * FROM public.saj_rates;
CREATE OR REPLACE VIEW public.rates AS SELECT * FROM public.saj_rates;

-- 3. CUSTOM USERS (CUSTOMER PROFILES)
CREATE TABLE IF NOT EXISTS public.custom_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    full_name text,
    phone_number text,
    preferred_branch text DEFAULT 'Gandhidham',
    created_at timestamp with time zone DEFAULT now()
);

-- 4. SHOWROOM APPOINTMENTS & INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    phone text,
    email text,
    branch text,
    appointment_date text,
    appointment_time text,
    inquiry_type text DEFAULT 'Appointment',
    product_title text,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS public.saj_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    category text NOT NULL,
    subcategory text,
    price numeric,
    weight text,
    image text,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. BROADCAST NOTIFICATIONS HISTORY
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Full Access store_settings" ON public.store_settings;
    CREATE POLICY "Public Full Access store_settings" ON public.store_settings FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access saj_rates" ON public.saj_rates;
    CREATE POLICY "Public Full Access saj_rates" ON public.saj_rates FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access custom_users" ON public.custom_users;
    CREATE POLICY "Public Full Access custom_users" ON public.custom_users FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access inquiries" ON public.inquiries;
    CREATE POLICY "Public Full Access inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access saj_products" ON public.saj_products;
    CREATE POLICY "Public Full Access saj_products" ON public.saj_products FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access broadcast_notifications" ON public.broadcast_notifications;
    CREATE POLICY "Public Full Access broadcast_notifications" ON public.broadcast_notifications FOR ALL TO public USING (true) WITH CHECK (true);
END $$;

-- =========================================================================
-- REALTIME SUBSCRIPTIONS
-- =========================================================================

ALTER TABLE public.saj_rates REPLICA IDENTITY FULL;
ALTER TABLE public.saj_products REPLICA IDENTITY FULL;

DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saj_rates;
    EXCEPTION WHEN duplicate_object THEN
        -- already added
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saj_products;
    EXCEPTION WHEN duplicate_object THEN
        -- already added
    END;
END $$;

-- =========================================================================
-- STORAGE BUCKETS CONFIGURATION
-- =========================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_screenshots', 'payment_screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read payment_screenshots" ON storage.objects;
    CREATE POLICY "Public Read payment_screenshots" ON storage.objects FOR SELECT TO public USING (bucket_id = 'payment_screenshots');

    DROP POLICY IF EXISTS "Public Upload payment_screenshots" ON storage.objects;
    CREATE POLICY "Public Upload payment_screenshots" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'payment_screenshots');

    DROP POLICY IF EXISTS "Public Update payment_screenshots" ON storage.objects;
    CREATE POLICY "Public Update payment_screenshots" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'payment_screenshots');

    DROP POLICY IF EXISTS "Public Read product_images" ON storage.objects;
    CREATE POLICY "Public Read product_images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product_images');

    DROP POLICY IF EXISTS "Public Upload product_images" ON storage.objects;
    CREATE POLICY "Public Upload product_images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product_images');

    DROP POLICY IF EXISTS "Public Update product_images" ON storage.objects;
    CREATE POLICY "Public Update product_images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'product_images');
END $$;
