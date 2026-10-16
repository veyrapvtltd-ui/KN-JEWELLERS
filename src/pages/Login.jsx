import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured()) {
        try {
          if (isSignUp) {
            // Check if user already exists in Supabase
            const { data: existingUser } = await supabase
              .from('custom_users')
              .select('id')
              .eq('email', cleanEmail)
              .maybeSingle();

            if (existingUser) {
              throw new Error('Email already registered in system.');
            }

            const { data: newUser, error: insertError } = await supabase
              .from('custom_users')
              .insert([{
                email: cleanEmail,
                password,
                full_name: fullName.trim(),
                phone_number: phone.trim()
              }])
              .select()
              .single();

            if (insertError) throw insertError;

            // Cache locally
            const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
            users.push(newUser);
            localStorage.setItem('SAJ_users', JSON.stringify(users));
            localStorage.setItem('userId', newUser.id);
            alert('Profile created successfully! You are now logged in.');
            navigate(-1);
            return;
          } else {
            // Sign in with Supabase
            const { data: userProfile, error: loginError } = await supabase
              .from('custom_users')
              .select('*')
              .eq('email', cleanEmail)
              .eq('password', password)
              .maybeSingle();

            if (loginError) throw loginError;

            if (userProfile) {
              // Cache locally
              const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
              const existingIdx = users.findIndex(u => u.id === userProfile.id);
              if (existingIdx >= 0) users[existingIdx] = userProfile;
              else users.push(userProfile);
              localStorage.setItem('SAJ_users', JSON.stringify(users));

              localStorage.setItem('userId', userProfile.id);
              navigate(-1);
              return;
            } else {
              throw new Error('Invalid email or password');
            }
          }
        } catch (dbErr) {
          console.warn("Supabase auth failed or table pending, attempting local storage fallback:", dbErr.message);
          // If the error was explicitly 'Invalid email or password' or 'Email already registered', propagate it
          if (dbErr.message.includes('Invalid email') || dbErr.message.includes('already registered')) {
            throw dbErr;
          }
        }
      }

      // LocalStorage Fallback
      const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
      
      if (isSignUp) {
        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
          throw new Error('Email already registered.');
        }

        const newUser = {
          id: 'user_' + Date.now(),
          email: cleanEmail,
          password,
          full_name: fullName.trim(),
          phone_number: phone.trim(),
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('SAJ_users', JSON.stringify(users));
        localStorage.setItem('userId', newUser.id);
        alert('Profile created successfully! You are now logged in.');
        navigate(-1);
      } else {
        const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
        if (!found) {
          throw new Error('Invalid email or password');
        }

        localStorage.setItem('userId', found.id);
        navigate(-1);
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
      background: '#ffffff',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '440px', 
        padding: '40px', 
        background: '#ffffff', 
        border: '1px solid rgba(123, 17, 34, 0.15)',
        borderRadius: '16px', 
        boxShadow: '0 20px 40px rgba(123, 17, 34, 0.08)',
        boxSizing: 'border-box'
      }}>
        {/* Back navigation button to last used screen */}
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--peacock-green)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/assets/logo.png" alt="SHREE ARADHNA JEWELLERS Logo" style={{ height: '64px', borderRadius: '16px', marginBottom: '15px', objectFit: 'contain' }} />
          <h2 style={{ 
            color: 'var(--peacock-green)', 
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            margin: 0
          }}>
            {isSignUp ? 'Join the Harvest' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#666666', fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.4' }}>
            {isSignUp ? 'Begin your journey of pure gold' : 'Access your Digital Gold Harvest Dashboard'}
          </p>
        </div>
        
        {error && (
          <div style={{ 
            color: '#e53e3e', 
            background: '#fff5f5', 
            padding: '12px', 
            marginBottom: '20px', 
            textAlign: 'center', 
            border: '1px solid #fed7d7', 
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ 
                  padding: '14px 16px', 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  color: '#1a1a1a', 
                  outline: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ 
                  padding: '14px 16px', 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  color: '#1a1a1a', 
                  outline: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              />
            </>
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: '14px 16px', 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              color: '#1a1a1a', 
              outline: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              boxSizing: 'border-box',
              width: '100%'
            }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              padding: '14px 16px', 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              color: '#1a1a1a', 
              outline: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              boxSizing: 'border-box',
              width: '100%'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', 
              background: 'var(--royal-gold)', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: '700', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: '8px',
              borderRadius: '8px',
              fontSize: '12px',
              transition: 'background 0.2s ease',
              boxSizing: 'border-box',
              width: '100%'
            }}>
            {loading ? 'Processing...' : (isSignUp ? 'Create Profile' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'transparent', border: 'none', color: '#666666', cursor: 'pointer', fontSize: '0.85rem' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have a profile? "}
            <span style={{ color: 'var(--royal-gold)', textDecoration: 'underline', fontWeight: '600' }}>
              {isSignUp ? 'Sign In' : 'Join Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
