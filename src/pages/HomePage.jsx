import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/api';
import {
  GraduationCap,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  BarChart2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Star,
  BookOpen,
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, isStudent, login } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    analyticsService
      .getOverview()
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch((err) => console.log('Analytics preview fetch:', err));
  }, []);

  const handleQuickLogin = async (email, password) => {
    try {
      setDemoLoading(true);
      const user = await login(email, password);
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      alert('Error during demo login: ' + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={16} />
            <span>Academic Quality & Student Engagement Platform</span>
          </div>

          <h1 className="hero-title">
            Empowering <span className="hero-title-highlight">Student Voices</span> and Elevating Faculty Excellence
          </h1>

          <p className="hero-subtitle">
            A comprehensive, transparent feedback platform that bridges the gap between students and educators.
            Collect structured ratings, provide constructive guidance, and track institutional performance.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link
                to={isStudent ? '/student/dashboard' : '/faculty/dashboard'}
                className="btn btn-primary btn-lg"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  <span>Get Started Now</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  <span>Sign In</span>
                </Link>
              </>
            )}
            <Link to="/analytics" className="btn btn-outline-primary btn-lg">
              <BarChart2 size={18} />
              <span>View Public Analytics</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="demo-credentials-box">
            <div className="demo-credentials-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#2563eb" />
                <strong style={{ color: '#1e293b' }}>One-Click Test Accounts (Pre-Seeded)</strong>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>For project evaluation</span>
            </div>

            <div className="demo-card-grid">
              {/* Student demo */}
              <div className="demo-account-card">
                <span className="demo-role-tag" style={{ background: '#dbeafe', color: '#1e40af' }}>
                  STUDENT
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Yashwanth Reddy
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                  yashwanth@college.edu (pwd: student123)
                </div>
                <button
                  type="button"
                  disabled={demoLoading}
                  onClick={() => handleQuickLogin('yashwanth@college.edu', 'student123')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  Log In as Student
                </button>
              </div>

              {/* Faculty demo */}
              <div className="demo-account-card">
                <span className="demo-role-tag" style={{ background: '#ede9fe', color: '#5b21b6' }}>
                  FACULTY
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Bhanu Chander
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                  bhanuchander@college.edu (pwd: faculty123)
                </div>
                <button
                  type="button"
                  disabled={demoLoading}
                  onClick={() => handleQuickLogin('bhanuchander@college.edu', 'faculty123')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', borderColor: '#8b5cf6', color: '#6d28d9' }}
                >
                  Log In as Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Live Stats Bar */}
      <section style={{ padding: '40px 0', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="grid-4">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb' }}>
                {stats ? stats.totalSubmissions : '15+'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Total Reviews Submitted
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span>{stats ? stats.overallAverageRating : '4.8'}</span>
                <Star size={24} fill="#f59e0b" stroke="#f59e0b" />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Institutional Rating
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>
                {stats ? stats.totalFaculty : '4'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Distinguished Faculty
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6366f1' }}>
                {stats ? stats.totalStudents : '12+'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Active Student Voices
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bi-Directional Feedback Features */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <h2 style={{ fontSize: '2.3rem', marginBottom: '14px' }}>
              Two-Way Academic Evaluation
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              Unlike traditional one-sided appraisals, EduFeedback encourages mutual learning between professors and scholars.
            </p>
          </div>

          <div className="grid-2">
            {/* Student Feature Card */}
            <div className="card" style={{ borderLeft: '5px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>For Students</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rate Courses & Faculty</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#2563eb" />
                  <span>Rate teaching quality, communication, and subject knowledge.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#2563eb" />
                  <span>Provide thoughtful written comments and constructive suggestions.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#2563eb" />
                  <span>Receive direct mentoring evaluations from professors on participation.</span>
                </li>
              </ul>
              <div style={{ marginTop: '24px' }}>
                <Link to="/feedback/new" className="btn btn-outline-primary btn-sm">
                  <span>Submit Faculty Review</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Faculty Feature Card */}
            <div className="card" style={{ borderLeft: '5px solid #7c3aed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>For Faculty Members</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Evaluate Students & Track Impact</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#7c3aed" />
                  <span>Evaluate student classroom participation and subject understanding.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#7c3aed" />
                  <span>Access private rating aggregates and detailed feedback trends.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#7c3aed" />
                  <span>Identify areas of curriculum improvement based on student data.</span>
                </li>
              </ul>
              <div style={{ marginTop: '24px' }}>
                <Link to="/feedback/new" className="btn btn-secondary btn-sm" style={{ borderColor: '#8b5cf6', color: '#6d28d9' }}>
                  <span>Evaluate Student</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
