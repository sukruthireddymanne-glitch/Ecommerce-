import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(formData.email, formData.password);
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = async (email, password) => {
    setFormData({ email, password });
    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              <LogIn size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Sign In to EduFeedback</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>
              Access your student or faculty academic dashboard
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="e.g. student@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick 1-click test credentials */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#64748b',
                fontWeight: 600,
                marginBottom: '10px',
              }}
            >
              <ShieldCheck size={16} color="#2563eb" />
              <span>Quick 1-Click Demo Login</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('yashwanth@college.edu', 'student123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', fontWeight: 700 }}
              >
                Yashwanth (Student)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('bhanuchander@college.edu', 'faculty123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', fontWeight: 700 }}
              >
                Bhanu Chander (Faculty)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('deepthi@college.edu', 'student123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Deepthi
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('madhuri@college.edu', 'student123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Madhuri
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sreenija@college.edu', 'student123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Sreenija
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('mahesh@college.edu', 'faculty123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#6d28d9' }}
              >
                Prof. Mahesh
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('asha@college.edu', 'faculty123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#6d28d9' }}
              >
                Prof. Asha
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hariprasad@college.edu', 'faculty123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#6d28d9' }}
              >
                Prof. Hariprasad
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
