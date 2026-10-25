import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredBranch, setPreferredBranch] = useState('Ambala Cantt');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();
        const cleanName = fullName.trim();

        if (!cleanEmail || !cleanPhone || !cleanName || !password) {
          throw new Error('Please fill in all required fields.');
        }

        let userRecord = null;

        // 1. Save directly into normal Supabase database table 'custom_users'
        if (isSupabaseConfigured()) {
          try {
            const { data: existingUser } = await supabase
              .from('custom_users')
              .select('id, email, phone_number')
              .or(`email.eq.${cleanEmail},phone_number.eq.${cleanPhone}`)
              .maybeSingle();

            if (existingUser) {
              throw new Error('An account with this email or phone number is already registered.');
            }

            const { data: newUser, error: insertError } = await supabase
              .from('custom_users')
              .insert([{
                email: cleanEmail,
                password,
                full_name: cleanName,
                phone_number: cleanPhone,
                preferred_branch: preferredBranch
              }])
              .select()
              .single();

            if (insertError) throw insertError;
            userRecord = newUser;
          } catch (dbErr) {
            console.warn('Supabase database signup fallback:', dbErr.message);
            if (dbErr.message.includes('already registered')) {
              throw dbErr;
            }
          }
        }

        // LocalStorage fallback if Supabase not configured or failed
        if (!userRecord) {
          const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
          if (users.some(u => u.email.toLowerCase() === cleanEmail || u.phone_number === cleanPhone)) {
            throw new Error('An account with this email or phone number is already registered.');
          }

          userRecord = {
            id: 'user_' + Date.now(),
            email: cleanEmail,
            password,
            full_name: cleanName,
            phone_number: cleanPhone,
            preferred_branch: preferredBranch,
            created_at: new Date().toISOString()
          };
        }

        // Save login info permanently
        const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
        const existingIdx = users.findIndex(u => u.id === userRecord.id);
        if (existingIdx >= 0) users[existingIdx] = userRecord;
        else users.push(userRecord);

        localStorage.setItem('SAJ_users', JSON.stringify(users));
        localStorage.setItem('userId', userRecord.id);
        localStorage.setItem('SAJ_current_user', JSON.stringify(userRecord));
        localStorage.setItem('SAJ_wishlist_user', userRecord.email);

        alert('Account created successfully! Today\'s rates are now unlocked.');
        navigate('/');
        return;
      } else {
        // LOGIN
        const cleanIdent = identifier.trim().toLowerCase();
        if (!cleanIdent || !password) {
          throw new Error('Please enter your email or phone number, and password.');
        }

        let userRecord = null;

        // 1. Authenticate against normal Supabase database table 'custom_users'
        if (isSupabaseConfigured()) {
          try {
            const { data: userProfile, error: loginError } = await supabase
              .from('custom_users')
              .select('*')
              .or(`email.eq.${cleanIdent},phone_number.eq.${cleanIdent}`)
              .eq('password', password)
              .maybeSingle();

            if (loginError) throw loginError;
            if (userProfile) {
              userRecord = userProfile;
            }
          } catch (dbErr) {
            console.warn('Supabase database login fallback:', dbErr.message);
          }
        }

        // LocalStorage fallback
        if (!userRecord) {
          const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
          const found = users.find(u => 
            (u.email.toLowerCase() === cleanIdent || u.phone_number === cleanIdent) && 
            u.password === password
          );
          if (found) {
            userRecord = found;
          }
        }

        if (!userRecord) {
          throw new Error('Invalid email/phone or password. Please try again.');
        }

        // Save login info permanently
        localStorage.setItem('userId', userRecord.id);
        localStorage.setItem('SAJ_current_user', JSON.stringify(userRecord));
        localStorage.setItem('SAJ_wishlist_user', userRecord.email);

        navigate('/');
        return;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf8f5 0%, #ffffff 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '440px', 
        padding: '36px 30px', 
        background: '#ffffff', 
        border: '1px solid rgba(123, 17, 34, 0.15)',
        borderRadius: '16px', 
        boxShadow: '0 20px 50px rgba(123, 17, 34, 0.08)',
        boxSizing: 'border-box'
      }}>
        {/* Back Button */}
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-gray)',
            textDecoration: 'none',
            fontWeight: '600',
            marginBottom: '18px'
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Back to Store
        </Link>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(123, 17, 34, 0.08)',
            color: 'var(--royal-gold)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Lock style={{ width: '22px', height: '22px' }} />
          </div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '800',
            color: 'var(--text-dark)',
            margin: '0 0 6px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {isSignUp ? 'Create Free Account' : 'Member Login'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-gray)', margin: 0 }}>
            {isSignUp 
              ? 'Sign up to unlock today\'s gold & silver rates and special benefits.' 
              : 'Login with your email or phone to view today\'s live rates.'}
          </p>
        </div>

        {/* Toggle Mode */}
        <div style={{
          display: 'flex',
          background: '#f4f1ea',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: '6px',
              background: !isSignUp ? '#ffffff' : 'transparent',
              color: !isSignUp ? 'var(--royal-gold)' : 'var(--text-gray)',
              fontWeight: !isSignUp ? '700' : '500',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: !isSignUp ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: '6px',
              background: isSignUp ? '#ffffff' : 'transparent',
              color: isSignUp ? 'var(--royal-gold)' : 'var(--text-gray)',
              fontWeight: isSignUp ? '700' : '500',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: isSignUp ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            SIGN UP
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          {isSignUp ? (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Preferred Branch
                </label>
                <select
                  value={preferredBranch}
                  onChange={(e) => setPreferredBranch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  <option value="Ambala Cantt">Ambala Cantt Showroom (Kasera Bazaar Rd, Sadar Bazar)</option>

                </select>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Email or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile number"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: 'var(--royal-gold)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(218, 165, 32, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account & Unlock Rates' : 'Login & View Rates')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-gray)' }}>
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--royal-gold)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Login here
              </button>
            </span>
          ) : (
            <span>
              New customer?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--royal-gold)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Sign Up Free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
