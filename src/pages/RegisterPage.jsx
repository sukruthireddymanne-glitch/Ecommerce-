import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'Computer Science',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid academic email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await register(formData);
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
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
              <UserPlus size={28} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Create Your Account</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>
              Join the feedback platform as a student or faculty member
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Picker */}
            <div className="form-group">
              <label className="form-label">I am registering as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('STUDENT')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: formData.role === 'STUDENT' ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                    background: formData.role === 'STUDENT' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  <GraduationCap
                    size={24}
                    color={formData.role === 'STUDENT' ? '#2563eb' : '#64748b'}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: formData.role === 'STUDENT' ? '#1e40af' : '#475569',
                    }}
                  >
                    Student
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('FACULTY')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: formData.role === 'FACULTY' ? '2px solid #7c3aed' : '1.5px solid #cbd5e1',
                    background: formData.role === 'FACULTY' ? '#f5f3ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  <BookOpen
                    size={24}
                    color={formData.role === 'FACULTY' ? '#7c3aed' : '#64748b'}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: formData.role === 'FACULTY' ? '#6d28d9' : '#475569',
                    }}
                  >
                    Faculty Member
                  </span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                placeholder={formData.role === 'STUDENT' ? 'e.g. Alex Johnson' : 'e.g. Dr. Alan Turing'}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="e.g. yourname@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department / Specialization</label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science, Information Technology"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
