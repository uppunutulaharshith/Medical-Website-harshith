import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertCircle, ShieldAlert } from 'lucide-react';

const Auth = () => {
  const { login, register, token } = useApp();
  const navigate = useNavigate();

  // Toggle mode
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect immediately
  if (token) {
    setTimeout(() => {
      navigate('/shop');
    }, 0);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim() || !password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    if (isLoginMode) {
      // Login
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/shop');
      } else {
        setErrorMessage(result.message || 'Invalid email or password.');
      }
    } else {
      // Register
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        setLoading(false);
        return;
      }

      const result = await register(name, email, password, address, phone);
      setLoading(false);
      if (result.success) {
        navigate('/shop');
      } else {
        setErrorMessage(result.message || 'Failed to register account.');
      }
    }
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="section">
      <div className="container">
        <div className="auth-wrapper glass-card" style={{ padding: '40px' }}>
          <div className="auth-header">
            <h2>{isLoginMode ? 'Welcome Back' : 'Create an Account'}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isLoginMode 
                ? 'Sign in to access order history and counter details.' 
                : 'Join Laxmi Narsimha Medical for quick uploads & deliveries.'}
            </p>
          </div>

          {errorMessage && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 16px', 
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              color: '#ef4444',
              fontSize: '0.88rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            {/* Registration specific fields */}
            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    id="reg-name" 
                    required 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address *</label>
              <input 
                type="email" 
                id="auth-email" 
                required 
                placeholder="name@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password *</label>
              <input 
                type="password" 
                id="auth-password" 
                required 
                placeholder="••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Registration optional fields */}
            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-phone">WhatsApp Number (Optional)</label>
                  <input 
                    type="tel" 
                    id="reg-phone" 
                    placeholder="e.g. 9876543210" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reg-address">Delivery Address (Optional)</label>
                  <input 
                    type="text" 
                    id="reg-address" 
                    placeholder="Street No, Colony, City" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  width: '18px', 
                  height: '18px', 
                  animation: 'spin 0.6s linear infinite',
                  margin: '0 auto'
                }}></div>
              ) : (
                isLoginMode ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Seed info help box */}
          {isLoginMode && (
            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: 'var(--bg-surface-secondary)', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              textAlign: 'left'
            }}>
              <ShieldAlert size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Demo Admin Access:</strong><br />
                Email: <code>admin@laxmi.com</code> | Password: <code>admin123</code>
              </div>
            </div>
          )}

          <div className="auth-footer">
            <span>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            </span>
            <span className="auth-toggle-btn" onClick={handleToggleMode}>
              {isLoginMode ? 'Sign Up Now' : 'Sign In Now'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
