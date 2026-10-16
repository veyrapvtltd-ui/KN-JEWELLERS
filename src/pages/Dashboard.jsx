import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, CreditCard, UploadCloud, Gem, Sparkles, PlusCircle } from 'lucide-react';
import heic2any from 'heic2any';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeUpi, setStoreUpi] = useState('9638888170@okbizaxis');
  const [storeQrUrl, setStoreQrUrl] = useState('/assets/logo.png');
  const [showNewSchemeForm, setShowNewSchemeForm] = useState(false);
  
  // Payment Modal State
  const [showModal, setShowModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'Cash'
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileNameLower = (file.name || '').toLowerCase();
    const fileTypeLower = (file.type || '').toLowerCase();

    const isHeicOrHeif = fileNameLower.endsWith('.heic') || 
                         fileNameLower.endsWith('.heif') || 
                         fileNameLower.endsWith('.heics') || 
                         fileNameLower.endsWith('.heifs') || 
                         fileTypeLower.includes('heic') || 
                         fileTypeLower.includes('heif');

    if (isHeicOrHeif) {
      setIsConvertingHeic(true);
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85
        });
        const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const newFileName = file.name.replace(/\.(heic|heif|heics|heifs)$/i, '.jpg');
        const convertedFile = new File([resultBlob], newFileName, { type: 'image/jpeg' });
        setScreenshotFile(convertedFile);
      } catch (err) {
        console.error("HEIC/HEIF conversion error:", err);
        setScreenshotFile(file);
      } finally {
        setIsConvertingHeic(false);
      }
    } else {
      setScreenshotFile(file);
    }
  };

  const navigate = useNavigate();

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    let userData = null;
    let userSchemes = [];

    if (isSupabaseConfigured()) {
      try {
        // 1. Fetch user details from Supabase
        const { data: dbUser } = await supabase
          .from('custom_users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (dbUser) {
          userData = dbUser;
        }

        // 2. Fetch store settings
        const { data: dbSettings } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (dbSettings) {
          if (dbSettings.upi_id) setStoreUpi(dbSettings.upi_id);
          if (dbSettings.qr_code_url) setStoreQrUrl(dbSettings.qr_code_url);
        }

        // 3. Fetch schemes and payments from Supabase
        const { data: dbSchemes } = await supabase
          .from('harvest_schemes')
          .select('*, payments(*)')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (dbSchemes && dbSchemes.length > 0) {
          userSchemes = dbSchemes.map(s => ({
            ...s,
            payments: s.payments || []
          }));
        }
      } catch (err) {
        console.warn("Supabase Dashboard fetch fallback:", err.message);
      }
    }

    // Fallback to localStorage if needed
    if (!userData) {
      const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
      userData = users.find(u => u.id === userId);
    }

    if (!userData) {
      localStorage.removeItem('userId');
      navigate('/login');
      return;
    }
    setUser(userData);

    // Settings fallback
    const settings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
    if (settings.upi_id && !storeUpi) setStoreUpi(settings.upi_id);
    if (settings.qr_code_url && !storeQrUrl) setStoreQrUrl(settings.qr_code_url);

    // Schemes fallback
    if (userSchemes.length === 0) {
      const allSchemes = JSON.parse(localStorage.getItem('SAJ_schemes') || '[]');
      const allPayments = JSON.parse(localStorage.getItem('SAJ_payments') || '[]');

      userSchemes = allSchemes
        .filter(s => s.user_id === userId && s.status === 'active')
        .map(s => ({
          ...s,
          payments: allPayments.filter(p => p.scheme_id === s.id)
        }));
    }

    setSchemes(userSchemes);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "My Scheme Dashboard | SHREE ARADHNA JEWELLERS";
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScheme = async (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);

    if (isSupabaseConfigured()) {
      try {
        const { data: newDbScheme, error: schemeErr } = await supabase
          .from('harvest_schemes')
          .insert([{
            user_id: user.id,
            monthly_amount: amount,
            status: 'active',
            branch: 'Gandhidham'
          }])
          .select()
          .single();

        if (!schemeErr && newDbScheme) {
          const allSchemes = JSON.parse(localStorage.getItem('SAJ_schemes') || '[]');
          allSchemes.unshift(newDbScheme);
          localStorage.setItem('SAJ_schemes', JSON.stringify(allSchemes));
          setShowNewSchemeForm(false);
          fetchData();
          return;
        }
      } catch (err) {
        console.warn("Supabase scheme creation fallback:", err.message);
      }
    }

    const allSchemes = JSON.parse(localStorage.getItem('SAJ_schemes') || '[]');
    const newScheme = {
      id: 'scheme_' + Date.now(),
      user_id: user.id,
      monthly_amount: amount,
      status: 'active',
      created_at: new Date().toISOString()
    };
    allSchemes.unshift(newScheme);
    localStorage.setItem('SAJ_schemes', JSON.stringify(allSchemes));
    setShowNewSchemeForm(false);
    fetchData();
  };

  const openPaymentModal = (schemeId, monthNumber) => {
    setSelectedSchemeId(schemeId);
    setSelectedMonth(monthNumber);
    setPaymentMethod('UPI');
    setScreenshotFile(null);
    setPaymentSuccess(false);
    setShowModal(true);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setUploading(true);

    const targetScheme = schemes.find(s => s.id === selectedSchemeId);
    if (!targetScheme) {
      setUploading(false);
      return;
    }

    let screenshot_url = null;

    if (paymentMethod === 'UPI') {
      if (!screenshotFile) {
        alert("Please upload a payment screenshot for UPI transactions.");
        setUploading(false);
        return;
      }

      if (isSupabaseConfigured()) {
        try {
          const fileExt = (screenshotFile.name || 'jpg').split('.').pop();
          const safeName = `${user.id}/${Date.now()}_payment.${fileExt}`;
          const { error: uploadErr } = await supabase.storage
            .from('payment_screenshots')
            .upload(safeName, screenshotFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from('payment_screenshots')
              .getPublicUrl(safeName);
            screenshot_url = urlData.publicUrl;
          }
        } catch (uploadEx) {
          console.warn("Supabase Storage upload error:", uploadEx.message);
        }
      }
      
      if (!screenshot_url) {
        screenshot_url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(screenshotFile);
        });
      }
    }

    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: existingPay } = await supabase
          .from('payments')
          .select('id')
          .eq('scheme_id', selectedSchemeId)
          .eq('month_number', selectedMonth)
          .maybeSingle();

        if (existingPay) {
          await supabase
            .from('payments')
            .update({
              status: 'pending',
              payment_method: paymentMethod,
              screenshot_url: screenshot_url || undefined,
              amount: targetScheme.monthly_amount
            })
            .eq('id', existingPay.id);
        } else {
          await supabase
            .from('payments')
            .insert([{
              scheme_id: selectedSchemeId,
              user_id: user.id,
              month_number: selectedMonth,
              amount: targetScheme.monthly_amount,
              status: 'pending',
              payment_method: paymentMethod,
              screenshot_url
            }]);
        }
      } catch (payDbErr) {
        console.warn("Supabase payment record error:", payDbErr.message);
      }
    }

    // Cache locally
    const allPayments = JSON.parse(localStorage.getItem('SAJ_payments') || '[]');
    const existingIndex = allPayments.findIndex(p => p.scheme_id === selectedSchemeId && p.month_number === selectedMonth);

    if (existingIndex >= 0) {
      allPayments[existingIndex] = {
        ...allPayments[existingIndex],
        status: 'pending',
        payment_method: paymentMethod,
        screenshot_url: screenshot_url || allPayments[existingIndex].screenshot_url,
        updated_at: new Date().toISOString()
      };
    } else {
      allPayments.push({
        id: 'pay_' + Date.now(),
        scheme_id: selectedSchemeId,
        user_id: user.id,
        month_number: selectedMonth,
        amount: targetScheme.monthly_amount,
        status: 'pending',
        payment_method: paymentMethod,
        screenshot_url: screenshot_url,
        created_at: new Date().toISOString()
      });
    }

    localStorage.setItem('SAJ_payments', JSON.stringify(allPayments));
    setPaymentSuccess(true);
    fetchData();
    setUploading(false);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--ivory-bg)', color: 'var(--royal-gold)', fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', letterSpacing: '2px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory-bg)', color: 'var(--text-dark)', padding: '120px 20px 60px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: 'var(--peacock-green)', fontFamily: '"Cinzel", serif', fontSize: '2.8rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              Digital Harvest
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px', margin: '10px 0 0 0' }}>
              Welcome back, <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>{user?.full_name || 'Customer'}</span>
            </p>
            <div style={{ width: '60px', height: '2px', background: 'var(--royal-gold)', margin: '15px 0 0 0' }} />
          </div>

          {schemes.length > 0 && !showNewSchemeForm && (
            <button 
              onClick={() => setShowNewSchemeForm(true)}
              className="btn-gold" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 25px', cursor: 'pointer' }}
            >
              <PlusCircle size={18} />
              Start New Scheme
            </button>
          )}
        </div>
        
        {schemes.length === 0 || showNewSchemeForm ? (
          <div style={{ background: 'var(--pristine-white)', padding: '50px', border: '1px solid var(--royal-gold-border)', borderRadius: '0', textAlign: 'center', boxShadow: 'var(--box-shadow-luxury)', marginBottom: '40px' }}>
            {showNewSchemeForm && schemes.length > 0 && (
              <button onClick={() => setShowNewSchemeForm(false)} style={{ position: 'absolute', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
                Cancel
              </button>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Sparkles size={48} color="var(--royal-gold)" />
            </div>
            <h3 style={{ color: 'var(--peacock-green)', fontSize: '2rem', fontFamily: '"Cinzel", serif', marginBottom: '15px' }}>Start Your Golden Journey</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 auto 30px', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6' }}>Invest in pure BIS Hallmarked gold simply for 11 months, and get the 12th month as an absolute BONUS from SHREE ARADHNA JEWELLERS.</p>
            <form onSubmit={startScheme} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Monthly Installment (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--royal-gold)', fontSize: '1.2rem', fontWeight: 'bold' }}>₹</span>
                  <input 
                    type="number" 
                    name="amount" 
                    min="1000" 
                    step="500" 
                    required 
                    style={{ padding: '15px 15px 15px 45px', background: 'var(--ivory-cards)', border: '1px solid var(--royal-gold-border)', borderRadius: '0', color: 'var(--text-dark)', outline: 'none', width: '300px', fontSize: '1.2rem', transition: 'border-color 0.3s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--royal-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--royal-gold-border)'}
                  />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ cursor: 'pointer', padding: '16px 40px', fontSize: '12px' }}>
                Start Saving Now
              </button>
            </form>
          </div>
        ) : null}

        {schemes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {schemes.map((scheme, index) => {
              
              const schemePayments = scheme.payments || [];
              const totalGoldAccumulated = schemePayments.reduce((acc, curr) => {
                if (curr.status === 'approved' && curr.gold_purchased) return acc + Number(curr.gold_purchased);
                return acc;
              }, 0).toFixed(4);

              return (
                <div key={scheme.id} style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
                  
                  {schemes.length > 1 && (
                    <div style={{ position: 'absolute', top: '-15px', left: '20px', background: 'var(--royal-gold)', color: '#fff', padding: '5px 15px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', zIndex: 10 }}>
                      A/C {schemes.length - index}
                    </div>
                  )}

                  {/* Wallet Card - Ivory Theme */}
                  <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--pristine-white)', borderRadius: '0', border: '1px solid var(--royal-gold-border)', padding: '40px', boxShadow: 'var(--box-shadow-luxury)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <Gem color="var(--royal-gold)" size={24} />
                          <h3 style={{ color: 'var(--peacock-green)', fontFamily: '"Cinzel", serif', fontSize: '1.6rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Gold Wallet</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0', fontSize: '0.9rem' }}>Scheme Started: {new Date(scheme.start_date).toLocaleDateString()}</p>
                        
                        <div style={{ marginTop: '20px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: 'bold' }}>Monthly Installment</p>
                          <p style={{ color: 'var(--text-dark)', fontSize: '1.8rem', fontWeight: 'bold', margin: 0, fontFamily: '"Cinzel", serif' }}>₹{scheme.monthly_amount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* 
                      <div style={{ textAlign: 'right', background: 'var(--ivory-cards)', padding: '20px 30px', borderRadius: '0', border: '1px solid var(--royal-gold-light)', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                        <p style={{ color: 'var(--peacock-green)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 'bold' }}>Total Gold Accumulated</p>
                        <div style={{ color: 'var(--royal-gold)', fontSize: '2.8rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'baseline', gap: '5px', justifyContent: 'flex-end', fontFamily: '"Cinzel", serif' }}>
                          {totalGoldAccumulated} <span style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>g</span>
                        </div>
                      </div>
                      */}
                    </div>
                  </div>
                  
                  {/* Payment Schedule Grid */}
                  <div style={{ background: 'var(--pristine-white)', border: '1px solid var(--royal-gold-border)', borderRadius: '0', padding: '40px', boxShadow: 'var(--box-shadow-luxury)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h4 style={{ color: 'var(--peacock-green)', fontSize: '1.4rem', fontFamily: '"Cinzel", serif', letterSpacing: '1px' }}>Payment Schedule</h4>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        {schemePayments.filter(p => p.status === 'approved').length} / 11 Months Paid
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                      {[...Array(11)].map((_, i) => {
                        const monthNum = i + 1;
                        const payment = schemePayments.find(p => p.month_number === monthNum);
                        
                        let statusText = "Unpaid";
                        let Icon = Clock;
                        let iconColor = "var(--text-muted)";
                        let borderColor = "var(--royal-gold-light)";
                        let bg = "var(--ivory-bg)";

                        if (payment) {
                          if (payment.status === 'approved') { 
                            statusText = "Approved"; 
                            Icon = CheckCircle;
                            iconColor = "#28a745"; 
                            borderColor = "rgba(40,167,69,0.3)"; 
                            bg = "rgba(40,167,69,0.05)"; 
                          }
                          else if (payment.status === 'pending_approval') { 
                            statusText = "Pending Approval"; 
                            Icon = Clock;
                            iconColor = "var(--royal-gold)"; 
                            borderColor = "var(--royal-gold-border)"; 
                            bg = "var(--royal-gold-light)"; 
                          }
                          else if (payment.status === 'rejected') { 
                            statusText = "Payment Failed"; 
                            Icon = XCircle;
                            iconColor = "#dc3545"; 
                            borderColor = "rgba(220,53,69,0.3)"; 
                            bg = "rgba(220,53,69,0.05)"; 
                          }
                        }

                        return (
                          <div 
                            key={monthNum} 
                            style={{ 
                              padding: '25px 20px', 
                              border: `1px solid ${borderColor}`, 
                              borderRadius: '0', 
                              textAlign: 'center', 
                              background: bg, 
                              position: 'relative',
                              transition: 'transform 0.3s, box-shadow 0.3s',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.05)`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', fontWeight: 'bold' }}>Month {monthNum}</div>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                              <Icon color={iconColor} size={28} />
                            </div>
                            
                            <div style={{ color: iconColor, fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>{statusText}</div>
                            
                            {!payment || payment.status === 'rejected' ? (
                              <button 
                                onClick={() => openPaymentModal(scheme.id, monthNum)}
                                className="btn-outline"
                                style={{ 
                                  padding: '10px 20px', 
                                  width: '100%', 
                                  cursor: 'pointer',
                                  fontSize: '10px'
                                }}
                              >
                                Pay Now
                              </button>
                            ) : (
                              <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '15px', marginTop: 'auto' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Paid on: {new Date(payment.payment_date).toLocaleDateString()}</div>
                                {payment.gold_purchased && (
                                  <div style={{ fontSize: '1.1rem', color: 'var(--royal-gold)', fontWeight: 'bold' }}>
                                    +{payment.gold_purchased}g
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* 12th Month Bonus Card */}
                      <div style={{ 
                        padding: '25px 20px', 
                        border: '1px solid var(--royal-gold-border)', 
                        borderRadius: '0', 
                        textAlign: 'center', 
                        background: 'var(--royal-gold-light)', 
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'pulseGold 2s infinite'
                      }}>
                        <div style={{ color: 'var(--peacock-green)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', fontWeight: 'bold' }}>Month 12</div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                          <Sparkles color="var(--royal-gold)" size={32} />
                        </div>
                        <div style={{ margin: '10px 0', fontWeight: 'bold', color: 'var(--royal-gold)', fontSize: '1.5rem', fontFamily: '"Cinzel", serif', letterSpacing: '2px' }}>BONUS</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--royal-gold-border)', paddingTop: '15px', marginTop: '15px', fontWeight: 'bold' }}>
                          Unlocks Automatically
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal (White & Pink Premium Luxury Theme) */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            padding: '36px', 
            width: '100%', 
            maxWidth: '440px', 
            border: '1px solid rgba(123, 17, 34, 0.15)', 
            borderRadius: '20px', 
            boxShadow: '0 24px 64px rgba(123, 17, 34, 0.12)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(123, 17, 34, 0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--peacock-green)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, fontWeight: 700, letterSpacing: '0.5px' }}>SECURE PAYMENT</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', color: '#1a1a1a', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', fontSize: '14px' }}>
                ✕
              </button>
            </div>
            
            {!paymentSuccess ? (
              <>
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(123, 17, 34, 0.15)' }}>
                  <p style={{ color: 'var(--peacock-green)', margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Paying for Month {selectedMonth}</p>
                  {schemes.find(s => s.id === selectedSchemeId) && (
                    <p style={{ color: '#1a1a1a', fontSize: '1.8rem', fontWeight: '700', margin: 0, fontFamily: 'var(--font-serif)' }}>
                      ₹{schemes.find(s => s.id === selectedSchemeId).monthly_amount.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                
                <form onSubmit={submitPayment}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#555555', marginBottom: '10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Select Payment Method</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ flex: 1, padding: '12px 8px', border: `1px solid ${paymentMethod === 'UPI' ? 'var(--royal-gold)' : '#e2e8f0'}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: paymentMethod === 'UPI' ? 'rgba(123, 17, 34, 0.08)' : 'transparent', color: paymentMethod === 'UPI' ? 'var(--peacock-green)' : '#666666', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <input type="radio" name="method" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} style={{ display: 'none' }} />
                        <CreditCard size={18} />
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>UPI / QR Scan</span>
                      </label>
                      <label style={{ flex: 1, padding: '12px 8px', border: `1px solid ${paymentMethod === 'Cash' ? 'var(--royal-gold)' : '#e2e8f0'}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: paymentMethod === 'Cash' ? 'rgba(123, 17, 34, 0.08)' : 'transparent', color: paymentMethod === 'Cash' ? 'var(--peacock-green)' : '#666666', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <input type="radio" name="method" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} style={{ display: 'none' }} />
                        <Gem size={18} />
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Store Cash</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid rgba(123, 17, 34, 0.12)', marginBottom: '20px', textAlign: 'center', boxShadow: '0 8px 24px rgba(123, 17, 34, 0.03)' }}>
                      <p style={{ color: '#555555', fontSize: '12px', marginBottom: '14px', fontWeight: '600' }}>Scan the Official QR Code to Pay</p>
                      
                      <div style={{ marginBottom: '16px', padding: '8px', background: '#fff', display: 'inline-block', borderRadius: '8px', border: '1px solid rgba(123, 17, 34, 0.15)' }}>
                        <img 
                          src={storeQrUrl} 
                          alt="Store QR Code" 
                          style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '4px' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--peacock-green)', fontWeight: '700', marginBottom: '20px', padding: '10px 14px', background: '#ffffff', border: '1px dashed var(--royal-gold)', borderRadius: '8px' }}>
                        UPI ID: <span style={{ color: '#1a1a1a' }}>{storeUpi}</span>
                      </div>
                      
                      <label style={{ display: 'block', color: '#555555', marginBottom: '8px', fontSize: '11px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Upload Screenshot</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="file" 
                          accept="image/*,.heic,.heif,.heics,.heifs,image/heic,image/heif" 
                          onChange={handleScreenshotChange}
                          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                        />
                        <div style={{ padding: '12px', border: '1px dashed rgba(123, 17, 34, 0.3)', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: screenshotFile ? 'var(--peacock-green)' : '#888888', transition: 'all 0.2s' }}>
                          <UploadCloud size={16} />
                          <span style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: '700' }}>
                            {isConvertingHeic ? "Converting iPhone photo..." : screenshotFile ? screenshotFile.name : "Choose screenshot image (.jpg, .png, .heic, .heif)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Cash' && (
                    <div style={{ background: '#ffffff', border: '1px solid rgba(123, 17, 34, 0.15)', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--peacock-green)', margin: 0, lineHeight: '1.5', fontWeight: '700', fontSize: '13px' }}>Please visit our showroom to pay the installment in cash.</p>
                      <p style={{ color: '#666666', fontSize: '11px', margin: '8px 0 0 0' }}>Your status will be pending until our admin verifies receipt.</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={uploading} 
                    className="btn-gold"
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      cursor: uploading ? 'not-allowed' : 'pointer', 
                      opacity: uploading ? 0.7 : 1,
                      background: 'var(--royal-gold)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      fontSize: '12px',
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      transition: 'background 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    {uploading ? 'Processing...' : 'Submit Payment Request'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={54} color="#28a745" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ color: 'var(--peacock-green)', fontSize: '1.4rem', marginBottom: '8px', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>PAYMENT SUBMITTED!</h4>
                <p style={{ color: '#666666', marginBottom: '24px', lineHeight: '1.5', fontSize: '12px' }}>Your request for Month {selectedMonth} has been sent successfully and is now pending admin approval.</p>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ 
                    cursor: 'pointer',
                    background: '#ffffff',
                    color: 'var(--peacock-green)',
                    border: '1px solid rgba(123, 17, 34, 0.3)',
                    padding: '10px 24px',
                    borderRadius: '24px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
