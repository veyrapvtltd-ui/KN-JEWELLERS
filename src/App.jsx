import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const BisPolicy = lazy(() => import('./pages/BisPolicy'));

// Simple Navigation Bar using localStorage for session
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    // Listen for storage changes if multiple tabs are open
    const handleStorageChange = () => setUserId(localStorage.getItem('userId'));
    window.addEventListener('storage', handleStorageChange);
    // Poll for changes to instantly update navbar in the same tab
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    navigate('/');
  };

  if (location.pathname === '/') return null;

  return (
    <div style={{ background: 'var(--royal-gold)', padding: '10px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '15px' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
      {userId ? (
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
      ) : (
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Login / Register</Link>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b1122', fontWeight: 600 }}>Loading KN Jewellers...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/bis-policy" element={<BisPolicy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
