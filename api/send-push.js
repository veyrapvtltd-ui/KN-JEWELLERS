import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY || 'BCibRN0IM4-L0mr28TLXa_5Nu_gbU5v_p3rTzvSxiL4Emkhi3Tr2dfjfcXjSvka39AYKxlu8pRmYyTO0ZZ0qGPY';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'tha1Bx2yTPgY2R3S5XeuAhWclJrfg5ydHRYhodOKVzE';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://waequzdpezwszugitylg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZXF1emRwZXp3c3p1Z2l0eWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MTAxMjIsImV4cCI6MjEwODQ4NjEyMn0.dnOC-1aWbGe-_EgCgF8b4VvTEuVvcNLiKmLjnyzf0UY';

webpush.setVapidDetails(
  'mailto:contact@knjewellers.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

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
    const { title, body, icon, url, rates } = req.body || {};

    const notificationPayload = JSON.stringify({
      title: title || '👑 LIVE MARKET RATE UPDATE',
      body: body || 'Today\'s latest gold & silver rates live at Kn Jewellers!',
      icon: icon || '/assets/logo.png',
      badge: '/assets/logo.png',
      url: url || '/',
      rates: rates || null,
      timestamp: Date.now()
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const subsToNotify = [];
    const seenEndpoints = new Set();

    // 1. Fetch from inquiries table (push_subscription)
    try {
      const { data: inqSubs, error: inqErr } = await supabase
        .from('inquiries')
        .select('*')
        .eq('inquiry_type', 'push_subscription');

      if (inqSubs && inqSubs.length > 0) {
        for (const s of inqSubs) {
          const endpoint = s.name;
          if (endpoint && !seenEndpoints.has(endpoint)) {
            seenEndpoints.add(endpoint);
            let parsedKeys = { p256dh: s.phone, auth: s.email };
            try {
              if (s.notes) {
                const parsed = JSON.parse(s.notes);
                if (parsed.keys) parsedKeys = parsed.keys;
              }
            } catch (err) {}

            subsToNotify.push({
              sourceTable: 'inquiries',
              id: s.id,
              subscription: {
                endpoint,
                keys: parsedKeys
              }
            });
          }
        }
      }
    } catch (e) {
      console.warn('Inquiries query error:', e);
    }

    // 2. Also check push_subscriptions table if present
    try {
      const { data: dbSubs } = await supabase
        .from('push_subscriptions')
        .select('*');

      if (dbSubs && dbSubs.length > 0) {
        for (const s of dbSubs) {
          if (s.endpoint && !seenEndpoints.has(s.endpoint)) {
            seenEndpoints.add(s.endpoint);
            subsToNotify.push({
              sourceTable: 'push_subscriptions',
              id: s.id,
              subscription: {
                endpoint: s.endpoint,
                keys: { p256dh: s.p256dh, auth: s.auth }
              }
            });
          }
        }
      }
    } catch (e) {}

    if (subsToNotify.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        total: 0,
        message: 'No registered devices found. Enable live rate alerts on your device first.'
      });
    }

    // 3. Dispatch web-push in parallel to all endpoints
    let sentCount = 0;
    let failedCount = 0;

    const pushPromises = subsToNotify.map(async (item) => {
      try {
        await webpush.sendNotification(item.subscription, notificationPayload, {
          TTL: 86400 // 24 hours
        });
        sentCount++;
      } catch (err) {
        failedCount++;
        // If expired or gone (404/410), clean up from DB
        if (err.statusCode === 404 || err.statusCode === 410) {
          try {
            await supabase.from(item.sourceTable).delete().eq('id', item.id);
          } catch (delErr) {}
        }
      }
    });

    await Promise.allSettled(pushPromises);

    return res.status(200).json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: subsToNotify.length
    });
  } catch (err) {
    console.error('Error dispatching push notifications:', err);
    return res.status(500).json({ error: err.message });
  }
}
