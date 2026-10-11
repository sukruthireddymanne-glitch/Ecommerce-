import React, { useState, useEffect } from 'react';
import { analyticsService, feedbackService } from '../services/api';
import StarRating from '../components/StarRating';
import StatCard from '../components/StatCard';
import RatingBar from '../components/RatingBar';
import {
  BarChart3,
  Star,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Calendar,
} from 'lucide-react';

const AnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [categoryAverages, setCategoryAverages] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const [overRes, catRes, distRes, feedRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getCategoryAverages(),
        analyticsService.getRatingsDistribution(),
        feedbackService.getAll().catch(() => ({ data: [] })),
      ]);

      if (overRes?.data) setOverview(overRes.data);
      if (catRes?.data) setCategoryAverages(catRes.data);
      if (distRes?.data) setDistributions(distRes.data);
      if (feedRes?.data) setRecentFeedbacks(feedRes.data.slice(0, 6));
    } catch (err) {
      setError('Unable to load analytics data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ padding: '40px 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div className="hero-pill" style={{ marginBottom: '10px' }}>
              <BarChart3 size={15} />
              <span>Real-Time Academic Intelligence</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#0f172a' }}>
              Institutional Feedback Analytics
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>
              Aggregate ratings, category breakdowns, and sentiment distributions across departments
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* High-Level KPI Cards */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <StatCard
            icon={MessageSquare}
            color="blue"
            label="Total Feedback Records"
            value={overview ? overview.totalSubmissions : '—'}
            subtext="Submitted across all courses"
          />
          <StatCard
            icon={Star}
            color="amber"
            label="Overall Campus Rating"
            value={overview ? `${overview.overallAverageRating} / 5` : '—'}
            subtext="Calculated mean score"
          />
          <StatCard
            icon={BookOpen}
            color="emerald"
            label="Faculty Members"
            value={overview ? overview.totalFaculty : '—'}
            subtext="Active instructors evaluated"
          />
          <StatCard
            icon={GraduationCap}
            color="indigo"
            label="Active Students"
            value={overview ? overview.totalStudents : '—'}
            subtext="Enrolled scholar participants"
          />
        </div>

        <div className="grid-2" style={{ marginBottom: '32px' }}>
          {/* Rating Distribution Histogram */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Rating Distribution</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Star frequency and sentiment breakdown
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={18} fill="#f59e0b" stroke="#f59e0b" />
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
                  {overview?.overallAverageRating || '5.0'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              {distributions && distributions.length > 0 ? (
                distributions.map((item) => (
                  <RatingBar
                    key={item.star}
                    star={item.star}
                    count={item.count}
                    percentage={item.percentage}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No rating data recorded yet.
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#64748b',
              }}
            >
              <span>Student-to-Faculty: <strong>{overview?.studentToFacultyCount || 0}</strong></span>
              <span>Faculty-to-Student: <strong>{overview?.facultyToStudentCount || 0}</strong></span>
            </div>
          </div>

          {/* Category-Wise Criteria Scores */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Category-Wise Performance</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Averages across pedagogical and behavioral criteria
                </p>
              </div>
              <Award size={22} color="#2563eb" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {categoryAverages && categoryAverages.length > 0 ? (
                categoryAverages.map((cat) => (
                  <div
                    key={cat.category}
                    style={{
                      background: '#f8fafc',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                        {cat.category}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {cat.count} evaluations logged
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <StarRating value={cat.averageRating} readOnly size={16} />
                      <span
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: '#2563eb',
                          minWidth: '38px',
                          textAlign: 'right',
                        }}
                      >
                        {cat.averageRating}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No category records yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Recent Academic Feedback</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Latest reviews and performance remarks across the college
              </p>
            </div>
            <Sparkles size={20} color="#7c3aed" />
          </div>

          {recentFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No recent feedback recorded.
            </div>
          ) : (
            <div className="grid-2" style={{ marginTop: '10px' }}>
              {recentFeedbacks.map((f) => (
                <div
                  key={f.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span
                          className={`user-badge role-${f.feedbackType === 'STUDENT_TO_FACULTY' ? 'student' : 'faculty'}`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {f.feedbackType === 'STUDENT_TO_FACULTY'
                            ? 'Student -> Faculty'
                            : 'Faculty -> Student'}
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginTop: '6px' }}>
                          {f.reviewerName} reviewed {f.revieweeName}
                        </div>
                      </div>
                      <StarRating value={f.rating} readOnly size={16} showLabel />
                    </div>

                    {f.comments && (
                      <p style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', margin: '10px 0' }}>
                        "{f.comments}"
                      </p>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <Calendar size={13} />
                    <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
