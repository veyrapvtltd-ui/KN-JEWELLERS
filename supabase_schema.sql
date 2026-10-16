-- =========================================================================
-- SHREE ARADHNA JEWELLERS - COMPLETE SUPABASE SETUP SCRIPT
-- Branches: Gandhidham & Adipur, Gujarat
-- Run this entire script in your Supabase Dashboard: SQL Editor -> New Query -> Run
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
    silver numeric DEFAULT 98,
    updated_at timestamp with time zone DEFAULT now()
);

-- Seed initial rates
INSERT INTO public.saj_rates (id, gold24k, gold22k, gold18k, silver)
VALUES (1, 15500, 14200, 11625, 98)
ON CONFLICT (id) DO NOTHING;

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

-- 4. GOLD HARVEST SCHEMES
CREATE TABLE IF NOT EXISTS public.harvest_schemes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.custom_users(id) ON DELETE CASCADE,
    monthly_amount numeric NOT NULL,
    status text DEFAULT 'active',
    branch text DEFAULT 'Gandhidham',
    created_at timestamp with time zone DEFAULT now()
);

-- 5. SCHEME PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id uuid REFERENCES public.harvest_schemes(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.custom_users(id) ON DELETE CASCADE,
    month_number integer NOT NULL,
    amount numeric NOT NULL,
    status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    payment_method text DEFAULT 'UPI', -- 'UPI' or 'Cash'
    screenshot_url text,
    gold_rate numeric,
    gold_purchased numeric,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. SHOWROOM APPOINTMENTS & INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    phone text,
    email text,
    branch text,
    appointment_date text,
    appointment_time text,
    inquiry_type text DEFAULT 'Appointment', -- 'Appointment', 'Custom Order', 'Product Inquiry'
    product_title text,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- 7. PRODUCTS CATALOG
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

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for easy website and client operations
-- =========================================================================

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_products ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for website functionalities
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Full Access store_settings" ON public.store_settings;
    CREATE POLICY "Public Full Access store_settings" ON public.store_settings FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access saj_rates" ON public.saj_rates;
    CREATE POLICY "Public Full Access saj_rates" ON public.saj_rates FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access custom_users" ON public.custom_users;
    CREATE POLICY "Public Full Access custom_users" ON public.custom_users FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access harvest_schemes" ON public.harvest_schemes;
    CREATE POLICY "Public Full Access harvest_schemes" ON public.harvest_schemes FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access payments" ON public.payments;
    CREATE POLICY "Public Full Access payments" ON public.payments FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access inquiries" ON public.inquiries;
    CREATE POLICY "Public Full Access inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access saj_products" ON public.saj_products;
    CREATE POLICY "Public Full Access saj_products" ON public.saj_products FOR ALL TO public USING (true) WITH CHECK (true);
END $$;

-- =========================================================================
-- STORAGE BUCKETS CONFIGURATION
-- Buckets: payment_screenshots, product_images
-- =========================================================================

-- Insert buckets into storage.buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_screenshots', 'payment_screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS policies for payment_screenshots
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
