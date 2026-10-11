import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { register, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password, isAdmin);
      // Success triggers user state sync, useEffect handles redirect
    } catch (err) {
      // AuthContext handles error state
    }
  };

  return (
    <div className="auth-wrapper" style={{ maxWidth: '480px' }}>
      <div className="auth-header">
        <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <UserPlus size={24} />
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join SHOPEZ and start ordering today</p>
      </div>

      {(validationError || error) && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
          <AlertCircle size={16} />
          <span>{validationError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Development Helper: Admin Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0 1.25rem', padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
          <input
            type="checkbox"
            id="isAdminCheckbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="isAdminCheckbox" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}>
            Register as an Administrator User
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.85rem' }}>
          <span>Register Account</span>
        </button>
      </form>

      <div className="auth-footer-link">
        Already have an account? <Link to={`/login?redirect=${redirect}`}>Sign In</Link>
      </div>
    </div>
  );
};

export default Register;
