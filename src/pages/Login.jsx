import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  // Clean error on mount
  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      // Success triggers user state sync, useEffect handles redirect
    } catch (err) {
      // AuthContext handles error state
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <LogIn size={24} />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to place orders</p>
      </div>

      {(validationError || error) && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
          <AlertCircle size={16} />
          <span>{validationError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem', padding: '0.85rem' }}>
          <span>Sign In</span>
        </button>
      </form>

      {/* Demo Credentials Alert Helper */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', border: '1px solid var(--gray-200)' }}>
        <h5 style={{ fontWeight: 700, color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Demo Accounts:</h5>
        <p><strong>Customer:</strong> user@shopez.com / password123</p>
        <p><strong>Admin Panel:</strong> admin@shopez.com / password123</p>
      </div>

      <div className="auth-footer-link">
        Don't have an account? <Link to={`/register?redirect=${redirect}`}>Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
