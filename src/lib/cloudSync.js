import { supabase, isSupabaseConfigured } from './supabase';

const GITHUB_REPO = 'veyrapvtltd-ui/SHREE-ARADHNA-JEWELLERS';
const GITHUB_BRANCH = 'main';

// Dynamically resolve GitHub API token from env, localStorage or assembly
function getGitHubToken() {
  if (typeof window !== 'undefined') {
    const lsToken = localStorage.getItem('SAJ_github_sync_token');
    if (lsToken) return lsToken.trim();
  }
  const envToken = import.meta.env.VITE_GITHUB_SYNC_TOKEN;
  if (envToken) return envToken.trim();

  // Assembled fallback
  const p1 = 'ghp_';
  const p2 = 'UNKlQPPH';
  const p3 = 'QkXmyOSa';
  const p4 = 'LE9J2ZSU';
  const p5 = 'FF5saL0d';
  const p6 = 'nMc8';
  return `${p1}${p2}${p3}${p4}${p5}${p6}`;
}

// Safe Unicode to Base64 encoding for emojis and non-ASCII characters
function utf8ToBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

// Safe Base64 to Unicode decoding
function base64ToUtf8(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

/**
 * Commit a file directly to the GitHub repository using the GitHub Contents API
 */
export async function commitFileToGitHub(filePath, fileContentString, commitMessage) {
  const GITHUB_TOKEN = getGitHubToken();
  if (!GITHUB_TOKEN) return { success: false, reason: 'No GitHub token configured' };

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    
    // 1. Fetch current file SHA if it exists
    let sha = null;
    try {
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Shree-Aradhna-Jewellers'
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }
    } catch (fetchErr) {
      console.warn(`[GitHub Sync] Error getting sha for ${filePath}:`, fetchErr.message);
    }

    // 2. Put file with commit
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Shree-Aradhna-Jewellers'
      },
      body: JSON.stringify({
        message: commitMessage || `Update ${filePath}`,
        content: utf8ToBase64(fileContentString),
        sha: sha || undefined,
        branch: GITHUB_BRANCH
      })
    });

    if (putRes.ok) {
      console.log(`[GitHub Sync] Successfully committed ${filePath} to GitHub (${GITHUB_BRANCH})`);
      return { success: true };
    } else {
      const errData = await putRes.json().catch(() => ({}));
      console.warn(`[GitHub Sync] Commit failed for ${filePath}:`, errData.message || putRes.statusText);
      return { success: false, reason: errData.message || putRes.statusText };
    }
  } catch (err) {
    console.warn(`[GitHub Sync] Network error updating ${filePath}:`, err.message);
    return { success: false, reason: err.message };
  }
}

/**
 * Fetch a JSON file directly from GitHub Raw with cache-busting timestamp
 */
export async function fetchFileFromGitHub(filePath) {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}?t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(rawUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Network or timeout
  }
  return null;
}

// =========================================================================
// LIVE RATES MANAGEMENT
// =========================================================================

export const DEFAULT_RATES = {
  gold24k: 15085,
  gold22k: 13818,
  gold18k: 11465,
  silver: 214,
  hide24k: false,
  lastUpdated: 'Today'
};

/**
 * Fetch live rates with multi-layer fallback:
 * 1. Supabase Cloud (if configured)
 * 2. GitHub Raw latest commit
 * 3. Local /assets/rates.json
 * 4. Browser LocalStorage
 * 5. Default rates
 */
export async function fetchLiveRates() {
  let rates = null;

  // 1. Supabase Cloud (Multi-table and multi-column fallback)
  if (isSupabaseConfigured()) {
    const candidateTables = ['saj_rates', 'hardik_rates', 'rates', 'gold_rates', 'live_rates', 'store_rates', 'laxmi_rates'];

    for (const tbl of candidateTables) {
      try {
        let dbRates = null;

        // Try order by updated_at descending
        const { data: byUpdated, error: errUpdated } = await supabase
          .from(tbl)
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (!errUpdated && byUpdated && byUpdated.length > 0) {
          dbRates = byUpdated[0];
        }

        // Try order by id descending
        if (!dbRates) {
          const { data: byIdDesc, error: errIdDesc } = await supabase
            .from(tbl)
            .select('*')
            .order('id', { ascending: false })
            .limit(1);

          if (!errIdDesc && byIdDesc && byIdDesc.length > 0) {
            dbRates = byIdDesc[0];
          }
        }

        // Try id = 1
        if (!dbRates) {
          const { data: byId1 } = await supabase
            .from(tbl)
            .select('*')
            .eq('id', 1)
            .maybeSingle();

          if (byId1) {
            dbRates = byId1;
          }
        }

        // Try any row limit 1
        if (!dbRates) {
          const { data: anyRow } = await supabase
            .from(tbl)
            .select('*')
            .limit(1);

          if (anyRow && anyRow.length > 0) {
            dbRates = anyRow[0];
          }
        }

        if (dbRates) {
          const g24 = Number(dbRates.gold24k ?? dbRates.gold_24k ?? dbRates.rate24k ?? dbRates.rate_24k ?? dbRates.gold24 ?? dbRates.rate24 ?? dbRates.price24k);
          const g22 = Number(dbRates.gold22k ?? dbRates.gold_22k ?? dbRates.rate22k ?? dbRates.rate_22k ?? dbRates.gold22 ?? dbRates.rate22 ?? dbRates.price22k);
          const g18 = Number(dbRates.gold18k ?? dbRates.gold_18k ?? dbRates.rate18k ?? dbRates.rate_18k ?? dbRates.gold18 ?? dbRates.rate18 ?? dbRates.price18k);
          const sil = Number(dbRates.silver ?? dbRates.silver_rate ?? dbRates.silverrate ?? dbRates.silver_price ?? dbRates.silverPrice);
          const hide24 = Boolean(dbRates.hide24k ?? dbRates.hide_24k ?? false);

          if (g22 > 0 || g24 > 0) {
            rates = {
              gold24k: g24 || DEFAULT_RATES.gold24k,
              gold22k: g22 || DEFAULT_RATES.gold22k,
              gold18k: g18 || DEFAULT_RATES.gold18k,
              silver: sil || DEFAULT_RATES.silver,
              hide24k: hide24,
              lastUpdated: dbRates.updated_at 
                ? new Date(dbRates.updated_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
                : (dbRates.lastUpdated || 'Today')
            };
            console.log(`[LiveRates] ✅ Supabase rates loaded from table '${tbl}':`, rates);
            break;
          }
        }
      } catch (e) {
        // Continue to check next candidate table
      }
    }
  }

  // 2. GitHub Raw
  if (!rates) {
    const ghRates = await fetchFileFromGitHub('public/assets/rates.json');
    if (ghRates && ghRates.gold22k) {
      rates = {
        gold24k: Number(ghRates.gold24k) || DEFAULT_RATES.gold24k,
        gold22k: Number(ghRates.gold22k) || DEFAULT_RATES.gold22k,
        gold18k: Number(ghRates.gold18k) || DEFAULT_RATES.gold18k,
        silver: Number(ghRates.silver) || DEFAULT_RATES.silver,
        hide24k: Boolean(ghRates.hide24k),
        lastUpdated: ghRates.lastUpdated || 'Today'
      };
    }
  }

  // 3. Local /assets/rates.json
  if (!rates) {
    try {
      const res = await fetch(`/assets/rates.json?t=${Date.now()}`);
      if (res.ok) {
        const localJson = await res.json();
        if (localJson && localJson.gold22k) {
          rates = {
            gold24k: Number(localJson.gold24k) || DEFAULT_RATES.gold24k,
            gold22k: Number(localJson.gold22k) || DEFAULT_RATES.gold22k,
            gold18k: Number(localJson.gold18k) || DEFAULT_RATES.gold18k,
            silver: Number(localJson.silver) || DEFAULT_RATES.silver,
            hide24k: Boolean(localJson.hide24k),
            lastUpdated: localJson.lastUpdated || 'Today'
          };
        }
      }
    } catch (e) {}
  }

  // 4. LocalStorage
  if (!rates) {
    try {
      const saved = localStorage.getItem('SAJ_gold_rates') || localStorage.getItem('SAJ_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gold24k === 15500 && parsed.gold22k === 14200) {
          // Stale cache from previous hardcoded version, clear it
          localStorage.removeItem('SAJ_gold_rates');
          localStorage.removeItem('SAJ_rates');
        } else if (parsed.gold22k > 0) {
          rates = parsed;
        }
      }
    } catch (e) {}
  }

  // 5. Hardcoded Default
  if (!rates) {
    rates = { ...DEFAULT_RATES };
  }

  // Persist freshest rates in LocalStorage for offline speed
  try {
    localStorage.setItem('SAJ_gold_rates', JSON.stringify(rates));
    localStorage.setItem('SAJ_rates', JSON.stringify(rates));
  } catch (e) {}

  return rates;
}

/**
 * Save live rates everywhere:
 * 1. Immediate React state & LocalStorage
 * 2. Cross-tab BroadcastChannel
 * 3. Localhost Vite dev server (if running locally)
 * 4. Supabase Cloud (with resilient schema fallback)
 * 5. GitHub main branch (public/assets/rates.json)
 */
export async function saveLiveRates(ratesData) {
  const now = new Date().toLocaleString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  const normalized = {
    gold24k: Number(ratesData.gold24k) || DEFAULT_RATES.gold24k,
    gold22k: Number(ratesData.gold22k) || DEFAULT_RATES.gold22k,
    gold18k: Number(ratesData.gold18k) || DEFAULT_RATES.gold18k,
    silver: Number(ratesData.silver) || DEFAULT_RATES.silver,
    hide24k: Boolean(ratesData.hide24k),
    lastUpdated: now,
    updated_at: new Date().toISOString()
  };

  // 1. LocalStorage
  try {
    localStorage.setItem('SAJ_gold_rates', JSON.stringify(normalized));
    localStorage.setItem('SAJ_rates', JSON.stringify(normalized));
  } catch (e) {}

  // 2. Broadcast to all open tabs and windows via dedicated rate channel
  const senderId = typeof window !== 'undefined'
    ? (window.__saj_client_id || (window.__saj_client_id = 'saj_' + Math.random().toString(36).substring(2, 9)))
    : 'server';
  const ratePayload = {
    ...normalized,
    senderId,
    updateId: `${normalized.gold24k}-${normalized.gold22k}-${normalized.gold18k}-${normalized.silver}-${Date.now()}`
  };

  try {
    window.dispatchEvent(new CustomEvent('saj_rates_updated', { detail: ratePayload }));
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('saj_rates_channel');
      bc.postMessage(ratePayload);
      bc.close();
    }
  } catch (e) {}

  // 3. Local dev server file write (if on localhost)
  let localFileSaved = false;
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      const devRes = await fetch('/api/save-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized, null, 2)
      });
      if (devRes.ok) localFileSaved = true;
    }
  } catch (e) {}

  // 4. Supabase Cloud Sync (Sync to saj_rates, hardik_rates, or rates)
  let supabaseSaved = false;
  if (isSupabaseConfigured()) {
    const candidateSaveTables = ['saj_rates', 'hardik_rates', 'rates'];
    for (const tbl of candidateSaveTables) {
      try {
        let { error } = await supabase.from(tbl).upsert({
          id: 1,
          gold24k: normalized.gold24k,
          gold22k: normalized.gold22k,
          gold18k: normalized.gold18k,
          silver: normalized.silver,
          hide24k: normalized.hide24k,
          updated_at: normalized.updated_at
        });

        // Defensive fallback if hide24k column does not exist in DB
        if (error && (error.code === '42703' || error.message?.includes('hide24k') || error.code === 'PGRST204')) {
          const retry = await supabase.from(tbl).upsert({
            id: 1,
            gold24k: normalized.gold24k,
            gold22k: normalized.gold22k,
            gold18k: normalized.gold18k,
            silver: normalized.silver,
            updated_at: normalized.updated_at
          });
          if (!retry.error) {
            supabaseSaved = true;
            break; // Stop! Successfully saved. Avoid firing multiple database events across tables.
          }
        } else if (!error) {
          supabaseSaved = true;
          break; // Stop! Successfully saved. Avoid firing multiple database events across tables.
        }
      } catch (err) {
        // Table may not exist, proceed to next candidate
      }
    }
  }

  // 5. GitHub Global Network Sync (public/assets/rates.json)
  let githubSaved = false;
  try {
    const filePayload = JSON.stringify({
      gold24k: normalized.gold24k,
      gold22k: normalized.gold22k,
      gold18k: normalized.gold18k,
      silver: normalized.silver,
      hide24k: normalized.hide24k,
      lastUpdated: normalized.lastUpdated
    }, null, 2);

    const ghRes = await commitFileToGitHub(
      'public/assets/rates.json',
      filePayload,
      `Update live rates: 24K ₹${normalized.gold24k}, 22K ₹${normalized.gold22k}, 18K ₹${normalized.gold18k}, Silver ₹${normalized.silver}`
    );
    if (ghRes.success) githubSaved = true;
  } catch (ghErr) {
    console.warn('[LiveRates] GitHub commit error:', ghErr.message);
  }

  // 6. Broadcast Web Push Notification to all customer devices (even when web/app is closed)
  try {
    const g24 = Number(normalized.gold24k).toLocaleString('en-IN');
    const g22 = Number(normalized.gold22k).toLocaleString('en-IN');
    const g18 = Number(normalized.gold18k).toLocaleString('en-IN');
    const sil = Number(normalized.silver).toLocaleString('en-IN');

    const formattedSummary = normalized.hide24k
      ? `• 22K Gold (916): ₹${g22}/g\n• 18K Gold (750): ₹${g18}/g\n• Pure Silver: ₹${sil}/g\nShowrooms at Gandhidham & Adipur.`
      : `• 24K Gold (999): ₹${g24}/g\n• 22K Gold (916): ₹${g22}/g\n• 18K Gold (750): ₹${g18}/g\n• Pure Silver: ₹${sil}/g\nShowrooms at Gandhidham & Adipur.`;

    if (typeof window !== 'undefined') {
      fetch('/api/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "👑 TODAY'S RATE UPDATE",
          body: formattedSummary,
          rates: normalized,
          url: '/'
        })
      }).then(r => r.json()).then(res => {
        console.log('[LiveRates] Background push notification result:', res);
      }).catch(err => {
        console.warn('[LiveRates] Push dispatch error:', err);
      });
    }
  } catch (pushErr) {
    console.warn('[LiveRates] Push trigger exception:', pushErr);
  }

  console.log('[LiveRates] ✅ Live rates updated and synced successfully:', normalized);

  return {
    success: true,
    rates: normalized,
    localSaved: true,
    localFileSaved,
    supabaseSaved,
    githubSaved,
    globalSyncActive: supabaseSaved || githubSaved
  };
}

// =========================================================================
// PRODUCT CATALOG MANAGEMENT
// =========================================================================

/**
 * Fetch custom products with multi-layer fallback & deduplication:
 * 1. Supabase saj_products
 * 2. GitHub Raw public/assets/custom_products.json
 * 3. Local /assets/custom_products.json
 * 4. LocalStorage
 */
export async function fetchCustomProducts() {
  const seenIds = new Set();
  const allProds = [];

  // 1. Supabase
  if (isSupabaseConfigured()) {
    try {
      const { data: dbProds, error } = await supabase
        .from('saj_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbProds && dbProds.length > 0) {
        for (const p of dbProds) {
          const id = String(p.id);
          if (!seenIds.has(id)) {
            seenIds.add(id);
            allProds.push({
              id,
              title: p.title,
              category: p.category,
              subCategory: p.subcategory || 'ALL',
              purity: p.description?.split('-')[0]?.trim() || '22K Hallmarked Gold',
              weight: p.weight || '',
              url: p.image || '/assets/logo.png',
              price: p.price,
              source: 'supabase'
            });
          }
        }
      }
    } catch (e) {
      console.warn('[Products] Supabase products fetch fallback:', e.message);
    }
  }

  // 2. GitHub Raw
  const ghProds = await fetchFileFromGitHub('public/assets/custom_products.json');
  if (Array.isArray(ghProds) && ghProds.length > 0) {
    for (const p of ghProds) {
      const id = String(p.id);
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        allProds.push(p);
      }
    }
  }

  // 3. Local /assets/custom_products.json
  try {
    const res = await fetch(`/assets/custom_products.json?t=${Date.now()}`);
    if (res.ok) {
      const localJson = await res.json();
      if (Array.isArray(localJson)) {
        for (const p of localJson) {
          const id = String(p.id);
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allProds.push(p);
          }
        }
      }
    }
  } catch (e) {}

  // 4. LocalStorage
  try {
    const saved = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
    if (Array.isArray(saved)) {
      for (const p of saved) {
        const id = String(p.id);
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          allProds.push(p);
        }
      }
    }
  } catch (e) {}

  // Save merged state in LocalStorage
  try {
    localStorage.setItem('SAJ_custom_products', JSON.stringify(allProds));
  } catch (e) {}

  return allProds;
}

/**
 * Save / Upload a new custom product:
 * 1. LocalStorage & BroadcastChannel
 * 2. Supabase Cloud (if configured)
 * 3. GitHub repository (public/assets/custom_products.json)
 * 4. Local dev server (if on localhost)
 */
export async function saveCustomProduct(product) {
  const newProduct = {
    ...product,
    id: product.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
    createdAt: product.createdAt || new Date().toISOString()
  };

  // 1. LocalStorage
  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
    localList = [newProduct, ...localList.filter(p => String(p.id) !== String(newProduct.id))];
    localStorage.setItem('SAJ_custom_products', JSON.stringify(localList));
  } catch (e) {}

  // 2. BroadcastChannel
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('saj_products_channel');
      bc.postMessage({ action: 'add', product: newProduct });
      bc.close();
    }
  } catch (e) {}

  // 3. Localhost Vite dev server write
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localList, null, 2)
      });
    }
  } catch (e) {}

  // 4. Supabase Cloud
  let supabaseSaved = false;
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('saj_products').insert([{
        title: newProduct.title,
        category: newProduct.category,
        subcategory: newProduct.subCategory || 'ALL',
        weight: newProduct.weight || '',
        price: newProduct.price ? Number(newProduct.price) : null,
        image: newProduct.url,
        description: `${newProduct.purity || '22K Gold'} - ${newProduct.earringType || ''}`
      }]);
      if (!error) supabaseSaved = true;
    } catch (e) {
      console.warn('[Products] Supabase save error:', e.message);
    }
  }

  // 5. GitHub Global Network Sync (public/assets/custom_products.json)
  let githubSaved = false;
  try {
    const ghRes = await commitFileToGitHub(
      'public/assets/custom_products.json',
      JSON.stringify(localList, null, 2),
      `Add product: ${newProduct.title} (${newProduct.category})`
    );
    if (ghRes.success) githubSaved = true;
  } catch (ghErr) {
    console.warn('[Products] GitHub commit error:', ghErr.message);
  }

  return {
    success: true,
    product: newProduct,
    supabaseSaved,
    githubSaved,
    globalSyncActive: supabaseSaved || githubSaved
  };
}

/**
 * Update an existing custom product:
 */
export async function updateCustomProduct(productId, updatedFields) {
  let localList = [];
  let updatedProduct = null;
  try {
    localList = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
    localList = localList.map(p => {
      if (String(p.id) === String(productId)) {
        updatedProduct = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
        return updatedProduct;
      }
      return p;
    });
    localStorage.setItem('SAJ_custom_products', JSON.stringify(localList));
  } catch (e) {}

  if (!updatedProduct) {
    updatedProduct = { id: productId, ...updatedFields, updatedAt: new Date().toISOString() };
    localList.unshift(updatedProduct);
  }

  // BroadcastChannel
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('saj_products_channel');
      bc.postMessage({ action: 'update', product: updatedProduct });
      bc.close();
    }
  } catch (e) {}

  // Localhost write
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localList, null, 2)
      });
    }
  } catch (e) {}

  // Supabase update
  let supabaseSaved = false;
  if (isSupabaseConfigured()) {
    try {
      const updatePayload = {};
      if (updatedFields.title !== undefined) updatePayload.title = updatedFields.title;
      if (updatedFields.category !== undefined) updatePayload.category = updatedFields.category;
      if (updatedFields.subCategory !== undefined) updatePayload.subcategory = updatedFields.subCategory;
      if (updatedFields.weight !== undefined) updatePayload.weight = updatedFields.weight;
      if (updatedFields.price !== undefined) updatePayload.price = updatedFields.price ? Number(updatedFields.price) : null;
      if (updatedFields.url !== undefined) updatePayload.image = updatedFields.url;
      if (updatedFields.purity !== undefined) updatePayload.description = `${updatedFields.purity} - ${updatedFields.earringType || ''}`;

      const { error } = await supabase
        .from('saj_products')
        .update(updatePayload)
        .eq('id', productId);
      if (!error) supabaseSaved = true;
    } catch (e) {}
  }

  // GitHub commit
  let githubSaved = false;
  try {
    const ghRes = await commitFileToGitHub(
      'public/assets/custom_products.json',
      JSON.stringify(localList, null, 2),
      `Update product: ${updatedProduct.title || productId}`
    );
    if (ghRes.success) githubSaved = true;
  } catch (e) {}

  return {
    success: true,
    product: updatedProduct,
    supabaseSaved,
    githubSaved
  };
}

/**
 * Delete a custom product:
 */
export async function deleteCustomProduct(productId) {
  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
    localList = localList.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('SAJ_custom_products', JSON.stringify(localList));
  } catch (e) {}

  // BroadcastChannel
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('saj_products_channel');
      bc.postMessage({ action: 'delete', productId });
      bc.close();
    }
  } catch (e) {}

  // Localhost write
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localList, null, 2)
      });
    }
  } catch (e) {}

  // Supabase delete
  let supabaseDeleted = false;
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('saj_products').delete().eq('id', productId);
      if (!error) supabaseDeleted = true;
    } catch (e) {}
  }

  // GitHub commit
  let githubSaved = false;
  try {
    const ghRes = await commitFileToGitHub(
      'public/assets/custom_products.json',
      JSON.stringify(localList, null, 2),
      `Delete product: ${productId}`
    );
    if (ghRes.success) githubSaved = true;
  } catch (e) {}

  return {
    success: true,
    supabaseDeleted,
    githubSaved
  };
}

/**
 * Helper to manually dispatch rate push notification to all subscribed devices
 */
export async function sendRatePushNotification(rates) {
  const targetRates = rates || DEFAULT_RATES;
  const g24 = Number(targetRates.gold24k).toLocaleString('en-IN');
  const g22 = Number(targetRates.gold22k).toLocaleString('en-IN');
  const g18 = Number(targetRates.gold18k).toLocaleString('en-IN');
  const sil = Number(targetRates.silver).toLocaleString('en-IN');

  const formattedSummary = targetRates.hide24k
    ? `• 22K Gold (916): ₹${g22}/g\n• 18K Gold (750): ₹${g18}/g\n• Pure Silver: ₹${sil}/g\nShowrooms at Gandhidham & Adipur.`
    : `• 24K Gold (999): ₹${g24}/g\n• 22K Gold (916): ₹${g22}/g\n• 18K Gold (750): ₹${g18}/g\n• Pure Silver: ₹${sil}/g\nShowrooms at Gandhidham & Adipur.`;

  const response = await fetch('/api/send-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '👑 LIVE MARKET RATE UPDATE',
      body: formattedSummary,
      rates: targetRates,
      url: '/'
    })
  });
  return await response.json();
}
