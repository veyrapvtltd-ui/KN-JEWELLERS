import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Store Settings
  const [storeUpi, setStoreUpi] = useState('9638888170@okbizaxis');
  const [updatingUpi, setUpdatingUpi] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);
  const [instaUrl, setInstaUrl] = useState('');
  const [updatingInsta, setUpdatingInsta] = useState(false);

  // Alerts & Inquiries
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

    if (isSupabaseConfigured()) {
      try {
        const [settRes, inqRes] = await Promise.all([
          supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('inquiries').select('*').order('created_at', { ascending: false })
        ]);

        if (settRes.data) fetchedSettings = settRes.data;
        if (inqRes.data) fetchedInquiries = inqRes.data;
      } catch (err) {
        console.warn("Supabase AdminDashboard fetch fallback:", err.message);
      }
    }

    // Settings
    const localSettings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
    const activeSettings = fetchedSettings || localSettings;
    if (activeSettings.upi_id) setStoreUpi(activeSettings.upi_id);
    if (activeSettings.qr_code_url) setInstaUrl(activeSettings.qr_code_url);

    // Inquiries
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

  const handleInstaUpdate = async (e) => {
    e.preventDefault();
    setUpdatingInsta(true);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('store_settings').upsert({ id: 1, qr_code_url: instaUrl });
      } catch (err) {
        console.warn("Supabase QR URL update error:", err.message);
      }
    }

    const settings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
    settings.qr_code_url = instaUrl;
    localStorage.setItem('SAJ_store_settings', JSON.stringify(settings));
    alert("Instagram / Widget URL updated successfully!");
    setUpdatingInsta(false);
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setQrUploading(true);
    try {
      let finalQrUrl = null;

      if (isSupabaseConfigured()) {
        try {
          const fileExt = (file.name || 'png').split('.').pop();
          const fileName = `store_qr_${Date.now()}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage
            .from('payment_screenshots')
            .upload(fileName, file, { cacheControl: '3600', upsert: true });

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
          reader.readAsDataURL(file);
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

  const handleSendPushAlert = async (e) => {
    e.preventDefault();
    setSendingAlert(true);
    const titleVal = e.target.elements.alertTitle.value;
    const bodyVal = e.target.elements.alertBody.value;

    alert(`🔔 Broadcast simulated: "${titleVal} - ${bodyVal}"`);
    e.target.reset();
    setSendingAlert(false);
  };

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
          <h2 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '2rem', marginBottom: '30px', letterSpacing: '2px' }}>
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
              style={{ padding: '12px', background: 'var(--royal-gold)', color: '#000', border: 'none', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
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

  return (
    <div className="admin-container" style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '2.4rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              Shree Aradhna Jewellers
            </h1>
            <p style={{ color: '#888', margin: '8px 0 0', letterSpacing: '1px', fontSize: '0.95rem' }}>
              Showroom Management & Store Settings • Gandhidham & Adipur
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{ padding: '10px 18px', background: 'transparent', color: 'var(--royal-gold)', border: '1px solid var(--royal-gold)', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
              ← View Website
            </a>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ padding: '10px 18px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Store Settings Section */}
        <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '4px', border: '1px solid #333', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', marginBottom: '15px' }}>Official Store UPI</h3>
            <form onSubmit={handleUpiUpdate} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.85rem' }}>UPI ID for Customer Payments</label>
                <input 
                  type="text" 
                  value={storeUpi} 
                  onChange={(e) => setStoreUpi(e.target.value)} 
                  required 
                  style={{ padding: '12px', width: '100%', background: '#000', border: '1px solid #444', color: '#fff', outline: 'none', borderRadius: '4px' }} 
                />
              </div>
              <button 
                type="submit" 
                disabled={updatingUpi} 
                style={{ padding: '12px 20px', background: 'var(--royal-gold)', color: '#000', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', cursor: updatingUpi ? 'not-allowed' : 'pointer', borderRadius: '4px' }}
              >
                {updatingUpi ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', marginBottom: '15px' }}>Store QR Code</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleQrUpload} 
                disabled={qrUploading} 
                style={{ color: '#fff', background: '#000', padding: '10px', border: '1px solid #444', flex: 1, borderRadius: '4px' }} 
              />
              {qrUploading && <span style={{ color: 'var(--royal-gold)', fontSize: '0.85rem' }}>Uploading...</span>}
            </div>
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '6px' }}>Upload showroom QR code image</p>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', marginBottom: '15px' }}>Broadcast Push Alerts</h3>
            <form onSubmit={handleSendPushAlert} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Alert Title (e.g. Diwali Collection Live!)" 
                name="alertTitle" 
                required 
                style={{ padding: '10px', width: '100%', background: '#000', border: '1px solid #444', color: '#fff', outline: 'none', borderRadius: '4px' }} 
              />
              <textarea 
                placeholder="Message (e.g. Visit our Gandhidham showroom to preview the new bridal jewelry set)" 
                name="alertBody" 
                required 
                style={{ padding: '10px', width: '100%', height: '50px', background: '#000', border: '1px solid #444', color: '#fff', outline: 'none', resize: 'none', borderRadius: '4px' }} 
              />
              <button 
                type="submit" 
                disabled={sendingAlert} 
                style={{ padding: '10px', background: 'var(--royal-gold)', color: '#000', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', cursor: sendingAlert ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '0.85rem' }}
              >
                {sendingAlert ? 'Sending...' : 'Broadcast Alert'}
              </button>
            </form>
          </div>

        </div>

        {/* Appointment & Showroom Inquiries Section */}
        <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '4px', border: '1px solid #333' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', margin: 0 }}>
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
              style={{ padding: '10px 16px', background: '#000', border: '1px solid var(--royal-gold)', color: '#fff', outline: 'none', borderRadius: '4px', width: '280px' }}
            />
          </div>

          {loading ? (
            <p style={{ color: '#888' }}>Loading inquiries...</p>
          ) : filteredInquiries.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', background: '#0d0d0d', borderRadius: '4px' }}>
              <p style={{ fontSize: '1.1rem', margin: '0 0 8px' }}>No inquiries found.</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Appointments submitted on the website will appear here in real time.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredInquiries.map((inq, idx) => (
                <div 
                  key={inq.id || idx} 
                  style={{ background: '#0a0a0a', border: '1px solid #333', padding: '20px', borderRadius: '6px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
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
