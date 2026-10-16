import { createClient } from '@supabase/supabase-js';

// Get current Supabase credentials (localStorage priority -> import.meta.env fallback)
export const getSupabaseConfig = () => {
  let url = '';
  let key = '';

  if (typeof window !== 'undefined') {
    url = localStorage.getItem('SAJ_supabase_url') || '';
    key = localStorage.getItem('SAJ_supabase_anon_key') || '';
  }

  if (!url) {
    url = import.meta.env.VITE_SUPABASE_URL || '';
  }
  if (!key) {
    key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }

  return {
    url: url.trim(),
    key: key.trim()
  };
};

// Check if valid, non-placeholder credentials are provided
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return false;

  // Filter out placeholders or outdated/dead endpoints
  const isPlaceholder = 
    url.includes('your-project') || 
    url.includes('placeholder-project') ||
    url.includes('xfkcnmhophacnluofauu') ||
    key.includes('your-anon-key') ||
    key.includes('placeholder-anon-key');

  if (isPlaceholder) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

// Internal client cache
let activeClient = null;
let activeConfigKey = '';

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  const configKey = `${url}|${key}`;

  if (activeClient && activeConfigKey === configKey) {
    return activeClient;
  }

  if (isSupabaseConfigured()) {
    try {
      activeClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      activeConfigKey = configKey;
      return activeClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }

  // Safe fallback dummy client so calling supabase.from(...) never throws reference errors
  activeClient = createClient(
    'https://placeholder-project.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
    { auth: { persistSession: false } }
  );
  activeConfigKey = 'dummy';
  return activeClient;
};

// Dynamic proxy export so all imports `import { supabase } from '../lib/supabase'` stay reactive
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const val = client[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});

// Update credentials dynamically
export const setSupabaseConfig = (url, key) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('SAJ_supabase_url', url.trim());
    else localStorage.removeItem('SAJ_supabase_url');

    if (key) localStorage.setItem('SAJ_supabase_anon_key', key.trim());
    else localStorage.removeItem('SAJ_supabase_anon_key');

    activeClient = null;
    activeConfigKey = '';
    window.dispatchEvent(new Event('saj_supabase_config_changed'));
  }
};

// Clear credentials (revert to local mode)
export const clearSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('SAJ_supabase_url');
    localStorage.removeItem('SAJ_supabase_anon_key');
    activeClient = null;
    activeConfigKey = '';
    window.dispatchEvent(new Event('saj_supabase_config_changed'));
  }
};

// Test active or candidate Supabase connection
export const testSupabaseConnection = async (candidateUrl, candidateKey) => {
  const url = (candidateUrl !== undefined ? candidateUrl : getSupabaseConfig().url || '').trim();
  const key = (candidateKey !== undefined ? candidateKey : getSupabaseConfig().key || '').trim();

  if (!url || !key) {
    return { 
      success: false, 
      connected: false,
      message: 'Project URL and Anon Key cannot be empty.' 
    };
  }

  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) throw new Error();
  } catch {
    return { 
      success: false, 
      connected: false,
      message: 'Invalid URL format. Example: https://xxxxxxxxxxxx.supabase.co' 
    };
  }

  const startTime = Date.now();
  try {
    const client = createClient(url, key, { auth: { persistSession: false } });

    // Race against 7-second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timed out after 7s. Please verify your Project URL.')), 7000)
    );

    const queryPromise = client.from('saj_rates').select('id').limit(1);
    const { error } = await Promise.race([queryPromise, timeoutPromise]);
    const latency = Date.now() - startTime;

    if (error) {
      // Table does not exist error codes (PGRST204 / PGRST205 / 42P01)
      if (
        error.code === '42P01' || 
        error.code === 'PGRST204' || 
        error.code === 'PGRST205' || 
        (error.message && error.message.toLowerCase().includes('relation'))
      ) {
        return {
          success: true,
          connected: true,
          needsSchema: true,
          latencyMs: latency,
          message: 'Connected to Supabase project! However, the database tables have not been created yet. Please execute the SQL Schema in your Supabase SQL Editor.'
        };
      }

      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('API key')) {
        return {
          success: false,
          connected: false,
          latencyMs: latency,
          message: 'Invalid Anon Public Key. Please check the API key from Supabase Project Settings -> API.'
        };
      }

      return {
        success: false,
        connected: false,
        latencyMs: latency,
        message: `Supabase error: ${error.message} (${error.code || 'unknown'})`
      };
    }

    return {
      success: true,
      connected: true,
      needsSchema: false,
      latencyMs: latency,
      message: `Successfully connected to Supabase Cloud! Database is active and responsive (${latency}ms).`
    };
  } catch (err) {
    return {
      success: false,
      connected: false,
      message: err.message || 'Network error connecting to Supabase. Please verify the URL and your internet connection.'
    };
  }
};

// SQL Schema for 1-click copy
export const SUPABASE_SCHEMA_SQL = `-- SHREE ARADHNA JEWELLERS - COMPLETE SUPABASE SETUP
-- Branches: Gandhidham & Adipur, Gujarat
-- Run in: Supabase Dashboard -> SQL Editor -> New Query -> Run

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STORE SETTINGS
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

INSERT INTO public.store_settings (id, upi_id, qr_code_url, phone_branch1, phone_branch2)
VALUES (1, '9638888170@okbizaxis', '/assets/logo.png', '9638888170', '7202921222')
ON CONFLICT (id) DO UPDATE SET
    upi_id = EXCLUDED.upi_id,
    phone_branch1 = EXCLUDED.phone_branch1,
    phone_branch2 = EXCLUDED.phone_branch2;

-- 2. LIVE GOLD & SILVER RATES
CREATE TABLE IF NOT EXISTS public.saj_rates (
    id integer PRIMARY KEY DEFAULT 1,
    gold24k numeric DEFAULT 15500,
    gold22k numeric DEFAULT 14200,
    gold18k numeric DEFAULT 11625,
    silver numeric DEFAULT 98,
    updated_at timestamp with time zone DEFAULT now()
);

INSERT INTO public.saj_rates (id, gold24k, gold22k, gold18k, silver)
VALUES (1, 15500, 14200, 11625, 98)
ON CONFLICT (id) DO NOTHING;

-- 3. CUSTOM USERS
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

-- ENABLE RLS & PUBLIC ACCESS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_products ENABLE ROW LEVEL SECURITY;

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
END $$;

-- STORAGE BUCKETS
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

    DROP POLICY IF EXISTS "Public Read product_images" ON storage.objects;
    CREATE POLICY "Public Read product_images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product_images');

    DROP POLICY IF EXISTS "Public Upload product_images" ON storage.objects;
    CREATE POLICY "Public Upload product_images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product_images');
END $$;
`;
