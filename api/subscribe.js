import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://waequzdpezwszugitylg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZXF1emRwZXp3c3p1Z2l0eWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MTAxMjIsImV4cCI6MjEwODQ4NjEyMn0.dnOC-1aWbGe-_EgCgF8b4VvTEuVvcNLiKmLjnyzf0UY';

export default async function handler(req, res) {
  // Support both Express/Vercel and standard Node.js/Vite ServerResponse
  if (!res.status) {
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function (data) {
      this.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
      this.end(JSON.stringify(data));
    };
  }

  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, userAgent } = req.body || {};
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing subscription endpoint' });
    }

    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys?.p256dh || '';
    const auth = subscription.keys?.auth || '';
    const agent = userAgent || req.headers['user-agent'] || 'Browser Device';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. Save or update in inquiries table (inquiry_type: 'push_subscription')
    try {
      const { data: existing } = await supabase
        .from('inquiries')
        .select('id')
        .eq('inquiry_type', 'push_subscription')
        .eq('name', endpoint)
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from('inquiries')
          .update({
            phone: p256dh,
            email: auth,
            product_title: agent.substring(0, 100),
            notes: JSON.stringify(subscription),
            created_at: new Date().toISOString()
          })
          .eq('id', existing[0].id);
      } else {
        await supabase
          .from('inquiries')
          .insert([{
            name: endpoint,
            phone: p256dh,
            email: auth,
            inquiry_type: 'push_subscription',
            product_title: agent.substring(0, 100),
            notes: JSON.stringify(subscription)
          }]);
      }
    } catch (inqErr) {
      console.warn('Failed to save to inquiries:', inqErr);
    }

    // 2. Also try push_subscriptions table if present
    try {
      await supabase
        .from('push_subscriptions')
        .upsert({
          endpoint,
          p256dh,
          auth,
          user_agent: agent,
          created_at: new Date().toISOString()
        }, { onConflict: 'endpoint' });
    } catch (tblErr) {}

    return res.status(200).json({ success: true, message: 'Push subscription successfully registered' });
  } catch (err) {
    console.error('Error saving subscription:', err);
    return res.status(500).json({ error: err.message });
  }
}
