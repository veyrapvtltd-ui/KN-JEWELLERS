-- =========================================================================
-- KN JEWELLERS - COMPLETE SUPABASE SETUP SCRIPT
-- Kasera Bazaar Rd, Sadar Bazar, Ambala, Ambala Sadar, Haryana 133001
-- Phone: 094662 19194 | WhatsApp: +91 94662 19194
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id integer PRIMARY KEY DEFAULT 1,
    upi_id text DEFAULT '9466219194@upi',
    qr_code_url text DEFAULT '/assets/logo.png',
    phone_branch1 text DEFAULT '094662 19194',
    phone_branch2 text DEFAULT '094662 19194',
    instagram_branch1 text DEFAULT 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr',
    instagram_branch2 text DEFAULT 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr',
    updated_at timestamp with time zone DEFAULT now()
);

-- Seed default store settings if not exists
INSERT INTO public.store_settings (id, upi_id, qr_code_url, phone_branch1, phone_branch2, instagram_branch1, instagram_branch2)
VALUES (1, '9466219194@upi', '/assets/logo.png', '094662 19194', '094662 19194', 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr', 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr')
ON CONFLICT (id) DO UPDATE SET
    upi_id = EXCLUDED.upi_id,
    phone_branch1 = EXCLUDED.phone_branch1,
    phone_branch2 = EXCLUDED.phone_branch2,
    instagram_branch1 = EXCLUDED.instagram_branch1,
    instagram_branch2 = EXCLUDED.instagram_branch2;

-- 2. LIVE GOLD & SILVER RATES TABLE
CREATE TABLE IF NOT EXISTS public.saj_rates (
    id integer PRIMARY KEY DEFAULT 1,
    gold24k numeric DEFAULT 15085,
    gold22k numeric DEFAULT 13818,
    gold18k numeric DEFAULT 11465,
    silver numeric DEFAULT 214,
    hide24k boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure hide24k exists if table was created earlier
ALTER TABLE public.saj_rates ADD COLUMN IF NOT EXISTS hide24k boolean DEFAULT false;

-- Seed initial rates
INSERT INTO public.saj_rates (id, gold24k, gold22k, gold18k, silver, hide24k)
VALUES (1, 15085, 13818, 11465, 214, false)
ON CONFLICT (id) DO UPDATE SET
    gold24k = EXCLUDED.gold24k,
    gold22k = EXCLUDED.gold22k,
    gold18k = EXCLUDED.gold18k,
    silver = EXCLUDED.silver,
    hide24k = EXCLUDED.hide24k,
    updated_at = now();

-- Compatibility views for rate queries
CREATE OR REPLACE VIEW public.kn_rates AS SELECT * FROM public.saj_rates;
CREATE OR REPLACE VIEW public.rates AS SELECT * FROM public.saj_rates;
CREATE OR REPLACE VIEW public.hardik_rates AS SELECT * FROM public.saj_rates;

-- 3. CUSTOM USERS (CUSTOMER PROFILES)
CREATE TABLE IF NOT EXISTS public.custom_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    full_name text,
    phone_number text,
    preferred_branch text DEFAULT 'Ambala Cantt',
    created_at timestamp with time zone DEFAULT now()
);

-- 4. SHOWROOM APPOINTMENTS & INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    phone text,
    email text,
    branch text DEFAULT 'Ambala Cantt',
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

-- Compatibility view for products
CREATE OR REPLACE VIEW public.products AS SELECT * FROM public.saj_products;

-- 6. BROADCAST NOTIFICATIONS HISTORY
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 7. WEB PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint text UNIQUE NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    user_agent text,
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

    ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public Full Access push_subscriptions" ON public.push_subscriptions;
    CREATE POLICY "Public Full Access push_subscriptions" ON public.push_subscriptions FOR ALL TO public USING (true) WITH CHECK (true);
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
