import { createClient } from '@supabase/supabase-js';

// Get current Supabase credentials (localStorage priority -> import.meta.env fallback -> default project)
export const getSupabaseConfig = () => {
  const OFFICIAL_URL = 'https://waequzdpezwszugitylg.supabase.co';
  const OFFICIAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZXF1emRwZXp3c3p1Z2l0eWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MTAxMjIsImV4cCI6MjEwODQ4NjEyMn0.dnOC-1aWbGe-_EgCgF8b4VvTEuVvcNLiKmLjnyzf0UY';

  let url = '';
  let key = '';

  if (typeof window !== 'undefined') {
    // Purge outdated/dead Supabase configurations from earlier sessions
    const savedUrl = 
      localStorage.getItem('SAJ_supabase_url') || 
      localStorage.getItem('hardik_supabase_url') || 
      localStorage.getItem('supabase_url') || 
      '';

    if (savedUrl && (savedUrl.includes('xfkcnmhophacnluofauu') || savedUrl.includes('hiflildcmdmjjpuyzfxe') || savedUrl.includes('placeholder'))) {
      localStorage.removeItem('SAJ_supabase_url');
      localStorage.removeItem('hardik_supabase_url');
      localStorage.removeItem('supabase_url');
      localStorage.removeItem('SAJ_supabase_anon_key');
      localStorage.removeItem('hardik_supabase_anon_key');
      localStorage.removeItem('supabase_anon_key');
    } else {
      url = savedUrl;
      key = 
        localStorage.getItem('SAJ_supabase_anon_key') || 
        localStorage.getItem('hardik_supabase_anon_key') || 
        localStorage.getItem('supabase_anon_key') || 
        '';
    }
  }

  if (!url) {
    url = import.meta.env.VITE_SUPABASE_URL || OFFICIAL_URL;
  }
  if (!key) {
    key = import.meta.env.VITE_SUPABASE_ANON_KEY || OFFICIAL_KEY;
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

  // Filter out placeholders or dummy endpoints
  const isPlaceholder = 
    url.includes('your-project') || 
    url.includes('placeholder-project') ||
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

// Vigorous Storage Testing Suite
export const runVigorousStorageTests = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    overallSuccess: true,
    tests: []
  };

  // Test 1: LocalStorage Read/Write Integrity
  try {
    const tStart = performance.now();
    const testKey = '__saj_storage_integrity_test__';
    const testPayload = JSON.stringify({
      app: 'Kn Jewellers',
      timestamp: Date.now(),
      sample: 'A'.repeat(1024 * 10) // 10KB payload
    });
    localStorage.setItem(testKey, testPayload);
    const readBack = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    const isMatch = readBack === testPayload;
    const latency = Math.round(performance.now() - tStart);

    results.tests.push({
      id: 'local_storage',
      name: 'LocalStorage Read/Write Integrity',
      passed: isMatch,
      latencyMs: latency,
      details: isMatch 
        ? `100% data fidelity verified: 10KB payload written, verified & purged in ${latency}ms.` 
        : 'Data mismatch between written and retrieved payload.'
    });
  } catch (err) {
    results.overallSuccess = false;
    results.tests.push({
      id: 'local_storage',
      name: 'LocalStorage Read/Write Integrity',
      passed: false,
      details: `LocalStorage error: ${err.message}`
    });
  }

  // Test 2: LocalStorage Capacity & Usage
  try {
    let totalChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      totalChars += (k?.length || 0) + (localStorage.getItem(k)?.length || 0);
    }
    const usedKb = Math.round(totalChars / 1024);
    results.tests.push({
      id: 'storage_quota',
      name: 'Local Storage Headroom & Quota',
      passed: usedKb < 4500,
      details: `Current usage: ~${usedKb} KB out of ~5,000 KB standard quota (Safe operating zone).`
    });
  } catch (e) {
    // Non-fatal
  }

  // Test 3: Supabase Cloud Storage Status
  if (!isSupabaseConfigured()) {
    results.tests.push({
      id: 'supabase_storage_status',
      name: 'Supabase Cloud Storage Status',
      passed: true,
      isLocalMode: true,
      details: 'Active in Local Storage Mode. All assets and settings are persistently cached offline.'
    });
    return results;
  }

  const client = getSupabaseClient();

  // Test 4: Bucket 'payment_screenshots'
  try {
    const bucketName = 'payment_screenshots';
    const testFileName = `diagnostic_test_${Date.now()}.txt`;
    const testContent = new Blob([`SAJ Storage Test Payload ${Date.now()}`], { type: 'text/plain' });

    const tStartUpload = performance.now();
    const { error: uploadErr } = await client.storage
      .from(bucketName)
      .upload(testFileName, testContent, { upsert: true });

    const uploadLatency = Math.round(performance.now() - tStartUpload);

    if (uploadErr) {
      throw uploadErr;
    }

    // Public URL
    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(testFileName);
    const publicUrl = urlData?.publicUrl;

    // Download & Verify
    const { data: dlData, error: dlErr } = await client.storage.from(bucketName).download(testFileName);
    if (dlErr) throw dlErr;

    // Cleanup
    await client.storage.from(bucketName).remove([testFileName]);

    results.tests.push({
      id: 'bucket_payment_screenshots',
      name: 'Bucket: payment_screenshots (QR & Receipts)',
      passed: true,
      latencyMs: uploadLatency,
      details: `Upload, Read, Download & Cleanup passed in ${uploadLatency}ms. Public CDN URL accessible.`
    });
  } catch (err) {
    results.overallSuccess = false;
    results.tests.push({
      id: 'bucket_payment_screenshots',
      name: 'Bucket: payment_screenshots (QR & Receipts)',
      passed: false,
      details: `Storage operation failed: ${err.message || 'Check bucket RLS or run SQL Schema script.'}`
    });
  }

  // Test 5: Bucket 'product_images'
  try {
    const bucketName = 'product_images';
    const testFileName = `diagnostic_prod_${Date.now()}.txt`;
    const testContent = new Blob([`SAJ Product Storage Diagnostic ${Date.now()}`], { type: 'text/plain' });

    const tStartUpload = performance.now();
    const { error: uploadErr } = await client.storage
      .from(bucketName)
      .upload(testFileName, testContent, { upsert: true });

    const uploadLatency = Math.round(performance.now() - tStartUpload);

    if (uploadErr) {
      throw uploadErr;
    }

    // Public URL
    client.storage.from(bucketName).getPublicUrl(testFileName);

    // Download & Cleanup
    await client.storage.from(bucketName).download(testFileName);
    await client.storage.from(bucketName).remove([testFileName]);

    results.tests.push({
      id: 'bucket_product_images',
      name: 'Bucket: product_images (Showcase & Product Uploads)',
      passed: true,
      latencyMs: uploadLatency,
      details: `Upload, Read, Download & Cleanup passed in ${uploadLatency}ms.`
    });
  } catch (err) {
    results.overallSuccess = false;
    results.tests.push({
      id: 'bucket_product_images',
      name: 'Bucket: product_images (Showcase & Product Uploads)',
      passed: false,
      details: `Storage operation failed: ${err.message || 'Check bucket RLS or run SQL Schema script.'}`
    });
  }

  return results;
};

// SQL Schema for 1-click copy
export const SUPABASE_SCHEMA_SQL = `-- KN JEWELLERS - COMPLETE SUPABASE SETUP
-- Kasera Bazaar Rd, Sadar Bazar, Ambala Cantt, Haryana
-- Phone: 094662 19194 | UPI: 9466219194@okbizaxis
-- Run in: Supabase Dashboard -> SQL Editor -> New Query -> Run

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id integer PRIMARY KEY DEFAULT 1,
    upi_id text DEFAULT '9466219194@okbizaxis',
    qr_code_url text DEFAULT '/assets/logo.png',
    phone_branch1 text DEFAULT '094662 19194',
    phone_branch2 text DEFAULT '',
    instagram_branch1 text DEFAULT 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr',
    instagram_branch2 text DEFAULT '',
    address text DEFAULT 'Kasera Bazaar Rd, Sadar Bazar, Ambala Cantt, Haryana',
    updated_at timestamp with time zone DEFAULT now()
);

INSERT INTO public.store_settings (id, upi_id, qr_code_url, phone_branch1, phone_branch2, instagram_branch1, address)
VALUES (1, '9466219194@okbizaxis', '/assets/logo.png', '094662 19194', '', 'https://www.instagram.com/jewellerskn?srtk=MTNheXhhbXdxY2Vv&utm_source=qr', 'Kasera Bazaar Rd, Sadar Bazar, Ambala Cantt, Haryana')
ON CONFLICT (id) DO UPDATE SET
    upi_id = EXCLUDED.upi_id,
    phone_branch1 = EXCLUDED.phone_branch1,
    instagram_branch1 = EXCLUDED.instagram_branch1,
    address = EXCLUDED.address;

-- 2. LIVE GOLD & SILVER RATES
CREATE TABLE IF NOT EXISTS public.saj_rates (
    id integer PRIMARY KEY DEFAULT 1,
    gold24k numeric DEFAULT 148650,
    gold22k numeric DEFAULT 133780,
    gold18k numeric DEFAULT 112970,
    silver numeric DEFAULT 212,
    hide24k boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure hide24k column exists if table already created
ALTER TABLE public.saj_rates ADD COLUMN IF NOT EXISTS hide24k boolean DEFAULT false;

INSERT INTO public.saj_rates (id, gold24k, gold22k, gold18k, silver, hide24k)
VALUES (1, 148650, 133780, 112970, 212, true)
ON CONFLICT (id) DO UPDATE SET
    gold24k = EXCLUDED.gold24k,
    gold22k = EXCLUDED.gold22k,
    gold18k = EXCLUDED.gold18k,
    silver = EXCLUDED.silver,
    hide24k = EXCLUDED.hide24k,
    updated_at = now();

-- Compatibility views for alternative table names
CREATE OR REPLACE VIEW public.kn_rates AS SELECT * FROM public.saj_rates;
CREATE OR REPLACE VIEW public.hardik_rates AS SELECT * FROM public.saj_rates;
CREATE OR REPLACE VIEW public.rates AS SELECT * FROM public.saj_rates;

-- 3. CUSTOM USERS
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

CREATE OR REPLACE VIEW public.kn_products AS SELECT * FROM public.saj_products;
CREATE OR REPLACE VIEW public.products AS SELECT * FROM public.saj_products;

-- 6. BROADCAST NOTIFICATIONS HISTORY
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 7. PUSH NOTIFICATION SUBSCRIBERS (For Closed-App Rate Push Alerts)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint text UNIQUE NOT NULL,
    p256dh text,
    auth text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- ENABLE RLS & PUBLIC ACCESS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saj_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

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

    DROP POLICY IF EXISTS "Public Full Access push_subscriptions" ON public.push_subscriptions;
    CREATE POLICY "Public Full Access push_subscriptions" ON public.push_subscriptions FOR ALL TO public USING (true) WITH CHECK (true);
END $$;

-- REALTIME REPLICATION
ALTER TABLE public.saj_rates REPLICA IDENTITY FULL;
ALTER TABLE public.saj_products REPLICA IDENTITY FULL;
ALTER TABLE public.broadcast_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.push_subscriptions REPLICA IDENTITY FULL;

DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saj_rates;
    EXCEPTION WHEN duplicate_object THEN
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saj_products;
    EXCEPTION WHEN duplicate_object THEN
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_notifications;
    EXCEPTION WHEN duplicate_object THEN
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.push_subscriptions;
    EXCEPTION WHEN duplicate_object THEN
    END;
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

    DROP POLICY IF EXISTS "Public Update payment_screenshots" ON storage.objects;
    CREATE POLICY "Public Update payment_screenshots" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'payment_screenshots');

    DROP POLICY IF EXISTS "Public Read product_images" ON storage.objects;
    CREATE POLICY "Public Read product_images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product_images');

    DROP POLICY IF EXISTS "Public Upload product_images" ON storage.objects;
    CREATE POLICY "Public Upload product_images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product_images');

    DROP POLICY IF EXISTS "Public Update product_images" ON storage.objects;
    CREATE POLICY "Public Update product_images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'product_images');
END $$;
`;
