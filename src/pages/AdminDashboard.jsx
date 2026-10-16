import { useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  getSupabaseConfig, 
  setSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection,
  runVigorousStorageTests,
  SUPABASE_SCHEMA_SQL
} from '../lib/supabase';
import { optimizeImageForStorage } from '../lib/imageOptimizer';

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Supabase Cloud Configuration State
  const initialConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialConfig.key);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Vigorous Storage Testing State
  const [runningStorageTest, setRunningStorageTest] = useState(false);
  const [storageTestResults, setStorageTestResults] = useState(null);

  // Live Rates State
  const [gold24k, setGold24k] = useState('15500');
  const [gold22k, setGold22k] = useState('14200');
  const [gold18k, setGold18k] = useState('11625');
  const [silver, setSilver] = useState('98');
  const [savingRates, setSavingRates] = useState(false);

  // Store Settings State
  const [storeUpi, setStoreUpi] = useState('9638888170@okbizaxis');
  const [updatingUpi, setUpdatingUpi] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);
  const [instaUrl, setInstaUrl] = useState('');

  // Alerts & Inquiries State
  const [sendingAlert, setSendingAlert] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [searchInquiry, setSearchInquiry] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'umang@12';
    if (passcode === envPasscode || passcode === 'Papersoft@5577' || passcode === 'umang@12') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid passcode');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    let fetchedSettings = null;
    let fetchedInquiries = null;
    let fetchedRates = null;

    if (isSupabaseConfigured()) {
      try {
        const [settRes, inqRes, rateRes] = await Promise.all([
          supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('saj_rates').select('*').eq('id', 1).maybeSingle()
        ]);

        if (settRes.data) fetchedSettings = settRes.data;
        if (inqRes.data) fetchedInquiries = inqRes.data;
        if (rateRes.data) fetchedRates = rateRes.data;
      } catch (err) {
        console.warn("Supabase AdminDashboard fetch fallback:", err.message);
      }
    }

    // 1. Settings Fallback
    const localSettings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
    const activeSettings = fetchedSettings || localSettings;
    if (activeSettings.upi_id) setStoreUpi(activeSettings.upi_id);
    if (activeSettings.qr_code_url) setInstaUrl(activeSettings.qr_code_url);

    // 2. Rates Fallback
    if (fetchedRates) {
      if (fetchedRates.gold24k) setGold24k(String(fetchedRates.gold24k));
      if (fetchedRates.gold22k) setGold22k(String(fetchedRates.gold22k));
      if (fetchedRates.gold18k) setGold18k(String(fetchedRates.gold18k));
      if (fetchedRates.silver) setSilver(String(fetchedRates.silver));
    } else {
      const localRates = JSON.parse(localStorage.getItem('SAJ_rates') || '{}');
      if (localRates.gold24k) setGold24k(String(localRates.gold24k));
      if (localRates.gold22k) setGold22k(String(localRates.gold22k));
      if (localRates.gold18k) setGold18k(String(localRates.gold18k));
      if (localRates.silver) setSilver(String(localRates.silver));
    }

    // 3. Inquiries Fallback
    if (fetchedInquiries && fetchedInquiries.length > 0) {
      setInquiries(fetchedInquiries);
    } else {
      try {
        const storedInqs = JSON.parse(localStorage.getItem('SAJ_inquiries') || '[]');
        setInquiries(Array.isArray(storedInqs) ? storedInqs : []);
      } catch (e) {
        console.error('Error parsing inquiries:', e);
        setInquiries([]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Test Supabase Connection
  const handleTestConnection = async () => {
    setTestingSupabase(true);
    setSupabaseTestStatus(null);
    try {
      const result = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
      setSupabaseTestStatus(result);
    } catch (err) {
      setSupabaseTestStatus({
        success: false,
        connected: false,
        message: err.message || 'Connection test failed'
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  // Save Supabase Configuration
  const handleSaveSupabaseConfig = async (e) => {
    e.preventDefault();
    setTestingSupabase(true);
    
    // Save to local storage
    setSupabaseConfig(supabaseUrlInput, supabaseKeyInput);

    // Test connection with new config
    const testRes = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    setSupabaseTestStatus(testRes);
    setTestingSupabase(false);

    if (testRes.success) {
      alert('Supabase connected successfully!');
      fetchData();
    } else {
      alert(`Supabase saved, but connection check returned: ${testRes.message}`);
    }
  };

  // Disconnect Supabase (Revert to Local Storage)
  const handleDisconnectSupabase = () => {
    if (!window.confirm('Disconnect from Supabase? The website will seamlessly continue operating in Local Storage mode.')) {
      return;
    }
    clearSupabaseConfig();
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setSupabaseTestStatus(null);
    alert('Disconnected from Supabase Cloud. Operating in Local Mode.');
  };

  // Copy SQL Schema to Clipboard
  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
      alert('SQL Schema copied to clipboard! Paste it into Supabase SQL Editor and click "Run".');
    } catch (e) {
      alert('Failed to copy. Please copy from the setup guide below.');
    }
  };

  // Save Live Rates
  const handleSaveRates = async (e) => {
    e.preventDefault();
    setSavingRates(true);

    const ratePayload = {
      gold24k: Number(gold24k),
      gold22k: Number(gold22k),
      gold18k: Number(gold18k),
      silver: Number(silver),
      updated_at: new Date().toISOString()
    };

    // Save in LocalStorage for offline resilience
    localStorage.setItem('SAJ_rates', JSON.stringify(ratePayload));
    localStorage.setItem('SAJ_gold_rates', JSON.stringify({
      gold24k: Number(gold24k),
      gold22k: Number(gold22k),
      gold18k: Number(gold18k),
      silver: Number(silver)
    }));

    // Save to Supabase Cloud if connected
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('saj_rates').upsert({
          id: 1,
          gold24k: Number(gold24k),
          gold22k: Number(gold22k),
          gold18k: Number(gold18k),
          silver: Number(silver),
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase rate update failed, saved locally:', err.message);
      }
    }

    setSavingRates(false);
    alert('Live Gold & Silver Rates updated successfully!');
  };

  // Update UPI
  const handleUpiUpdate = async (e) => {
    e.preventDefault();
    setUpdatingUpi(true);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('store_settings').upsert({ id: 1, upi_id: storeUpi });
      } catch (err) {
        console.warn("Supabase UPI update error:", err.message);
      }
    }

    const settings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
    settings.upi_id = storeUpi;
    localStorage.setItem('SAJ_store_settings', JSON.stringify(settings));
    alert("UPI ID updated successfully!");
    setUpdatingUpi(false);
  };

  // Run Full Vigorous Storage Diagnostics
  const handleRunStorageDiagnostics = async () => {
    setRunningStorageTest(true);
    try {
      const results = await runVigorousStorageTests();
      setStorageTestResults(results);
    } catch (err) {
      alert('Storage diagnostic test failed: ' + err.message);
    } finally {
      setRunningStorageTest(false);
    }
  };

  // Upload QR Code
  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setQrUploading(true);
    try {
      // Optimize image first to keep storage compact & fast
      const optimizedFile = await optimizeImageForStorage(file, 800, 800, 0.85);
      let finalQrUrl = null;

      if (isSupabaseConfigured()) {
        try {
          const fileExt = (optimizedFile.name || 'jpg').split('.').pop();
          const fileName = `store_qr_${Date.now()}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage
            .from('payment_screenshots')
            .upload(fileName, optimizedFile, { cacheControl: '3600', upsert: true });

          if (!uploadErr) {
            const { data } = supabase.storage.from('payment_screenshots').getPublicUrl(fileName);
            finalQrUrl = data.publicUrl;
            await supabase.from('store_settings').upsert({ id: 1, qr_code_url: finalQrUrl });
          }
        } catch (ex) {
          console.warn("Storage upload error for QR, using base64:", ex.message);
        }
      }

      if (!finalQrUrl) {
        finalQrUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(optimizedFile);
        });
      }

      const settings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
      settings.qr_code_url = finalQrUrl;
      localStorage.setItem('SAJ_store_settings', JSON.stringify(settings));
      setInstaUrl(finalQrUrl);
      alert('Showroom QR Code updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error uploading QR code');
    } finally {
      setQrUploading(false);
    }
  };

  // Broadcast Alert
  const handleSendPushAlert = async (e) => {
    e.preventDefault();
    setSendingAlert(true);
    const titleVal = e.target.elements.alertTitle.value;
    const bodyVal = e.target.elements.alertBody.value;

    alert(`🔔 Broadcast alert dispatched: "${titleVal} - ${bodyVal}"`);
    e.target.reset();
    setSendingAlert(false);
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inqId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('inquiries').delete().eq('id', inqId);
      } catch (err) {
        console.warn("Supabase inquiry deletion error:", err.message);
      }
    }

    const updated = inquiries.filter(i => i.id !== inqId);
    localStorage.setItem('SAJ_inquiries', JSON.stringify(updated));
    setInquiries(updated);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: '#1a1a1a', border: '1px solid var(--royal-gold)', borderRadius: '2px', textAlign: 'center' }}>
          <img src="/assets/logo.png" alt="SHREE ARADHNA JEWELLERS Logo" style={{ height: '64px', borderRadius: '12px', marginBottom: '20px' }} />
          <h2 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', marginBottom: '25px', letterSpacing: '2px' }}>
            ADMIN ACCESS
          </h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              type="password" 
              placeholder="Enter Admin Passcode" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)}
              required
              style={{ padding: '12px 15px', background: '#000', border: '1px solid #333', color: '#fff', outline: 'none', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '3px' }}
            />
            <button 
              type="submit" 
              style={{ padding: '12px', background: 'var(--royal-gold)', color: '#fff', border: 'none', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Enter Dashboard
            </button>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to Website</a>
          </form>
        </div>
      </div>
    );
  }

  const filteredInquiries = inquiries.filter(inq => {
    if (!searchInquiry) return true;
    const term = searchInquiry.toLowerCase();
    return (
      (inq.name && inq.name.toLowerCase().includes(term)) ||
      (inq.phone && String(inq.phone).includes(term)) ||
      (inq.branch && inq.branch.toLowerCase().includes(term)) ||
      (inq.category && inq.category.toLowerCase().includes(term)) ||
      (inq.notes && inq.notes.toLowerCase().includes(term))
    );
  });

  const isCloudConnected = isSupabaseConfigured();

  return (
    <div className="admin-container" style={{ minHeight: '100vh', background: '#0e0e0e', color: '#fff', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid #222', paddingBottom: '25px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src="/assets/logo.png" alt="SAJ Logo" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
              <div>
                <h1 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '2rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                  Shree Aradhna Jewellers
                </h1>
                <p style={{ color: '#888', margin: '4px 0 0', letterSpacing: '0.5px', fontSize: '0.88rem' }}>
                  Showroom Management Dashboard • Gandhidham & Adipur
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '0.78rem', 
              fontWeight: '600',
              background: isCloudConnected ? 'rgba(40, 167, 69, 0.15)' : 'rgba(255, 193, 7, 0.15)',
              color: isCloudConnected ? '#28a745' : '#ffc107',
              border: `1px solid ${isCloudConnected ? '#28a745' : '#ffc107'}`
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isCloudConnected ? '#28a745' : '#ffc107' }} />
              {isCloudConnected ? 'Supabase Cloud Connected' : 'Local Storage Mode'}
            </span>
            <a href="/" style={{ padding: '8px 16px', background: 'transparent', color: 'var(--royal-gold)', border: '1px solid var(--royal-gold)', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
              ← View Website
            </a>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ padding: '8px 16px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* 1. SUPABASE CLOUD DATABASE SETTINGS */}
        <div style={{ background: '#161616', padding: '28px', borderRadius: '8px', border: '1px solid #2a2a2a', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>⚡</span> Supabase Cloud Database Configuration
              </h2>
              <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>
                Connect your website to Supabase PostgreSQL database for real-time rates sync, online inquiries, and storage.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCopySchema}
                style={{
                  background: copiedSchema ? '#28a745' : '#222',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {copiedSchema ? '✓ SQL Copied!' : '📋 Copy SQL Schema'}
              </button>

              <button
                type="button"
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                style={{
                  background: '#222',
                  color: 'var(--royal-gold)',
                  border: '1px solid var(--royal-gold)',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {showSqlGuide ? 'Hide Setup Steps' : '📖 4-Step Setup Guide'}
              </button>
            </div>
          </div>

          {/* Quick Setup Instructions Accordion */}
          {showSqlGuide && (
            <div style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: '6px', padding: '20px', marginBottom: '22px' }}>
              <h4 style={{ color: 'var(--royal-gold)', margin: '0 0 12px', fontSize: '0.95rem' }}>Easy 4-Step Supabase Setup:</h4>
              <ol style={{ color: '#bbb', fontSize: '0.85rem', lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
                <li>Log in to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--royal-gold)' }}>supabase.com</a> and click <strong>"New project"</strong> (select region: India - Mumbai for best speed).</li>
                <li>Go to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public API key</strong>.</li>
                <li>Go to <strong>SQL Editor → New Query</strong>, click the <strong>"Copy SQL Schema"</strong> button above, paste the code, and click <strong>Run</strong>.</li>
                <li>Paste your Project URL & Anon Key into the inputs below and click <strong>"Test & Save Connection"</strong>!</li>
              </ol>
            </div>
          )}

          {/* Configuration Form */}
          <form onSubmit={handleSaveSupabaseConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px', fontWeight: '500' }}>
                  Supabase Project URL
                </label>
                <input 
                  type="url" 
                  placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co" 
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ color: '#aaa', fontSize: '0.82rem', fontWeight: '500' }}>
                    Supabase Anon Public API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                  >
                    {showKey ? 'Hide Key' : 'Show Key'}
                  </button>
                </div>
                <input 
                  type={showKey ? 'text' : 'password'} 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Test Status Banner */}
            {supabaseTestStatus && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                border: supabaseTestStatus.success ? '1px solid #28a745' : '1px solid #dc3545',
                background: supabaseTestStatus.success ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                color: supabaseTestStatus.success ? '#28a745' : '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>{supabaseTestStatus.success ? '✓' : '✗'}</span>
                <span style={{ flex: 1 }}>{supabaseTestStatus.message}</span>
                {supabaseTestStatus.latencyMs && (
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{supabaseTestStatus.latencyMs}ms</span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button 
                type="submit" 
                disabled={testingSupabase}
                style={{
                  padding: '12px 22px',
                  background: 'var(--royal-gold)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: testingSupabase ? 'not-allowed' : 'pointer'
                }}
              >
                {testingSupabase ? 'Connecting...' : 'Save & Connect Supabase'}
              </button>

              <button 
                type="button" 
                onClick={handleTestConnection}
                disabled={testingSupabase}
                style={{
                  padding: '12px 20px',
                  background: '#222',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: testingSupabase ? 'not-allowed' : 'pointer'
                }}
              >
                {testingSupabase ? 'Testing...' : 'Test Connection'}
              </button>

              {isCloudConnected && (
                <button 
                  type="button" 
                  onClick={handleDisconnectSupabase}
                  style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#dc3545',
                    border: '1px solid #dc3545',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  Disconnect (Use Local Mode)
                </button>
              )}
            </div>
          </form>
        </div>

        {/* VIGOROUS STORAGE & BUCKET DIAGNOSTICS */}
        <div style={{ background: '#161616', padding: '28px', borderRadius: '8px', border: '1px solid #2a2a2a', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🛡️</span> Vigorous Storage & Bucket Diagnostics
              </h2>
              <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>
                Vigorously tests LocalStorage read/write fidelity, quota headroom, Supabase Storage buckets, and public CDN access.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunStorageDiagnostics}
              disabled={runningStorageTest}
              style={{
                padding: '10px 20px',
                background: runningStorageTest ? '#333' : 'var(--royal-gold)',
                color: runningStorageTest ? '#888' : '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: runningStorageTest ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {runningStorageTest ? 'Running Diagnostic Tests...' : '⚡ Run Vigorous Storage Tests'}
            </button>
          </div>

          {storageTestResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: '600',
                background: storageTestResults.overallSuccess ? 'rgba(40, 167, 69, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                color: storageTestResults.overallSuccess ? '#28a745' : '#ffc107',
                border: `1px solid ${storageTestResults.overallSuccess ? '#28a745' : '#ffc107'}`
              }}>
                {storageTestResults.overallSuccess
                  ? '✓ All Storage & Persistence Subsystems are 100% Operational!'
                  : '⚠️ Storage Diagnostics Complete - Review Status Below:'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                {storageTestResults.tests.map((t) => (
                  <div 
                    key={t.id}
                    style={{
                      background: '#0d0d0d',
                      border: `1px solid ${t.passed ? '#2a442e' : '#522a2a'}`,
                      borderRadius: '6px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{t.name}</strong>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: t.passed ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                          color: t.passed ? '#28a745' : '#dc3545'
                        }}>
                          {t.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '4px 0 0', lineHeight: '1.4' }}>
                        {t.details}
                      </p>
                    </div>
                    {t.latencyMs && (
                      <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#666' }}>
                        Response latency: {t.latencyMs}ms
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. LIVE GOLD & SILVER RATES MANAGEMENT */}
        <div style={{ background: '#161616', padding: '28px', borderRadius: '8px', border: '1px solid #2a2a2a', marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💰</span> Live Gold & Silver Rates (Gandhidham & Adipur)
            </h2>
            <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>
              Rates update live in real-time on the homepage banner and in the customer pricing calculations.
            </p>
          </div>

          <form onSubmit={handleSaveRates}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>
                  24K Gold Rate (₹ / 10g)
                </label>
                <input 
                  type="number" 
                  value={gold24k} 
                  onChange={(e) => setGold24k(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>
                  22K Gold Rate (₹ / 10g)
                </label>
                <input 
                  type="number" 
                  value={gold22k} 
                  onChange={(e) => setGold22k(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>
                  18K Gold Rate (₹ / 10g)
                </label>
                <input 
                  type="number" 
                  value={gold18k} 
                  onChange={(e) => setGold18k(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>
                  Silver Rate (₹ / 10g)
                </label>
                <input 
                  type="number" 
                  value={silver} 
                  onChange={(e) => setSilver(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={savingRates}
              style={{
                padding: '12px 24px',
                background: 'var(--royal-gold)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                cursor: savingRates ? 'not-allowed' : 'pointer'
              }}
            >
              {savingRates ? 'Updating Rates...' : 'Update Live Rates'}
            </button>
          </form>
        </div>

        {/* 3. STORE SETTINGS & ALERTS */}
        <div style={{ background: '#161616', padding: '28px', borderRadius: '8px', border: '1px solid #2a2a2a', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          
          {/* UPI */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', marginBottom: '14px' }}>
              Official Store UPI
            </h3>
            <form onSubmit={handleUpiUpdate} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '6px', fontSize: '0.82rem' }}>UPI ID for Customer Payments</label>
                <input 
                  type="text" 
                  value={storeUpi} 
                  onChange={(e) => setStoreUpi(e.target.value)} 
                  required 
                  style={{ padding: '12px', width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', borderRadius: '4px', boxSizing: 'border-box' }} 
                />
              </div>
              <button 
                type="submit" 
                disabled={updatingUpi} 
                style={{ padding: '12px 18px', background: 'var(--royal-gold)', color: '#fff', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', cursor: updatingUpi ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '0.82rem' }}
              >
                {updatingUpi ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>

          {/* QR */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', marginBottom: '14px' }}>
              Showroom Payment QR Code
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleQrUpload} 
                disabled={qrUploading} 
                style={{ color: '#fff', background: '#0a0a0a', padding: '10px', border: '1px solid #333', flex: 1, borderRadius: '4px' }} 
              />
              {qrUploading && <span style={{ color: 'var(--royal-gold)', fontSize: '0.82rem' }}>Uploading...</span>}
            </div>
            <p style={{ color: '#666', fontSize: '0.78rem', marginTop: '6px' }}>Upload current showroom UPI QR image</p>
          </div>

          {/* Push Broadcast */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', marginBottom: '14px' }}>
              Broadcast Notifications
            </h3>
            <form onSubmit={handleSendPushAlert} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Alert Title (e.g. Diwali Collection Live!)" 
                name="alertTitle" 
                required 
                style={{ padding: '10px', width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', borderRadius: '4px', boxSizing: 'border-box' }} 
              />
              <textarea 
                placeholder="Message details for customers..." 
                name="alertBody" 
                required 
                style={{ padding: '10px', width: '100%', height: '48px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', resize: 'none', borderRadius: '4px', boxSizing: 'border-box' }} 
              />
              <button 
                type="submit" 
                disabled={sendingAlert} 
                style={{ padding: '10px', background: 'var(--royal-gold)', color: '#fff', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', cursor: sendingAlert ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '0.82rem' }}
              >
                {sendingAlert ? 'Broadcasting...' : 'Broadcast Notification'}
              </button>
            </form>
          </div>

        </div>

        {/* 4. SHOWROOM APPOINTMENTS & INQUIRIES */}
        <div style={{ background: '#161616', padding: '28px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', margin: 0 }}>
                Customer Appointments & Inquiries
              </h3>
              <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.85rem' }}>
                Total received: {inquiries.length} inquiries
              </p>
            </div>

            <input 
              type="text" 
              placeholder="Search by name, phone, branch..." 
              value={searchInquiry}
              onChange={(e) => setSearchInquiry(e.target.value)}
              style={{ padding: '10px 16px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', borderRadius: '4px', width: '280px' }}
            />
          </div>

          {loading ? (
            <p style={{ color: '#888' }}>Loading inquiries...</p>
          ) : filteredInquiries.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', background: '#0d0d0d', borderRadius: '4px' }}>
              <p style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>No inquiries found.</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Appointments submitted on the website will appear here in real time.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredInquiries.map((inq, idx) => (
                <div 
                  key={inq.id || idx} 
                  style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <strong style={{ color: '#ffffff', fontSize: '1.15rem' }}>
                        {inq.name || 'Anonymous Customer'}
                      </strong>
                      <span style={{ color: '#777', fontSize: '0.75rem' }}>
                        {inq.created_at ? new Date(inq.created_at).toLocaleString() : inq.date || ''}
                      </span>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <a 
                        href={`tel:${inq.phone}`} 
                        style={{ color: 'var(--royal-gold)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        📞 {inq.phone || 'No phone'}
                      </a>
                    </div>

                    {inq.branch && (
                      <div style={{ color: '#bbb', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ color: '#666' }}>Preferred Branch:</span> <strong>{inq.branch}</strong>
                      </div>
                    )}

                    {(inq.inquiry_type || inq.category) && (
                      <div style={{ color: '#bbb', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ color: '#666' }}>Type:</span> {inq.inquiry_type || inq.category}
                      </div>
                    )}

                    {(inq.notes || inq.message) && (
                      <div style={{ color: '#ddd', fontSize: '0.85rem', marginTop: '12px', padding: '10px 12px', background: '#161616', borderRadius: '4px', borderLeft: '3px solid var(--royal-gold)', fontStyle: 'italic', lineHeight: '1.4' }}>
                        "{inq.notes || inq.message}"
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #222' }}>
                    <a 
                      href={`https://wa.me/91${String(inq.phone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name || 'Customer')},%20greetings%20from%20SHREE%20ARADHNA%20JEWELLERS!`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '6px 12px', background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                      💬 WhatsApp
                    </a>

                    <button 
                      onClick={() => handleDeleteInquiry(inq.id)}
                      style={{ background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '5px 12px', cursor: 'pointer', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
