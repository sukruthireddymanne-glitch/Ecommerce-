import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, feedbackService } from '../services/api';
import StarRating from '../components/StarRating';
import StatCard from '../components/StatCard';
import FeedbackModal from '../components/FeedbackModal';
import {
  GraduationCap,
  BookOpen,
  MessageSquareCheck,
  Award,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle2,
  User,
  PlusCircle,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('facultyList');
  const [facultyList, setFacultyList] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected faculty for feedback modal
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [facultyRes, subRes, recRes] = await Promise.all([
        userService.getFaculty(),
        feedbackService.getMySubmissions(),
        feedbackService.getReceived(),
      ]);

      if (facultyRes?.data) setFacultyList(facultyRes.data);
      if (subRes?.data) setMySubmissions(subRes.data);
      if (recRes?.data) setReceivedFeedback(recRes.data);
    } catch (err) {
      setError(err.message || 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReview = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    setSuccessToast('Thank you! Your feedback has been submitted successfully.');
    loadData();
    setTimeout(() => setSuccessToast(''), 5000);
  };

  // Check which faculty members have already been reviewed
  const reviewedFacultyIds = new Set(mySubmissions.map((s) => s.revieweeId));

  return (
    <div style={{ padding: '40px 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          className="card"
          style={{
            marginBottom: '28px',
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            color: '#ffffff',
            border: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <GraduationCap size={36} />
              </div>
              <div>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Student Portal
                </span>
                <h1 style={{ fontSize: '1.9rem', color: '#ffffff', marginTop: '6px' }}>
                  Welcome, {user?.fullName || 'Student'}!
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                  {user?.department} &bull; {user?.email}
                </p>
              </div>
            </div>

            <Link
              to="/feedback/new"
              className="btn btn-secondary btn-md"
              style={{ background: '#ffffff', color: '#1e40af', fontWeight: 700 }}
            >
              <PlusCircle size={18} />
              <span>Submit Faculty Feedback</span>
            </Link>
          </div>
        </div>

        {/* Notifications / Feedback alerts */}
        {successToast && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successToast}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <StatCard
            icon={BookOpen}
            color="blue"
            label="Faculty Members"
            value={facultyList.length}
            subtext="Available for review"
          />
          <StatCard
            icon={MessageSquareCheck}
            color="emerald"
            label="My Submissions"
            value={mySubmissions.length}
            subtext="Reviews submitted by you"
          />
          <StatCard
            icon={Award}
            color="indigo"
            label="Mentoring Reviews"
            value={receivedFeedback.length}
            subtext="Evaluations received from professors"
          />
        </div>

        {/* Dashboard Tabs */}
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'facultyList' ? 'active' : ''}`}
            onClick={() => setActiveTab('facultyList')}
          >
            <BookOpen size={18} />
            <span>Available Faculty ({facultyList.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'mySubmissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('mySubmissions')}
          >
            <MessageSquareCheck size={18} />
            <span>My Submitted Reviews ({mySubmissions.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'receivedFeedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('receivedFeedback')}
          >
            <Award size={18} />
            <span>Feedback Received from Faculty ({receivedFeedback.length})</span>
          </button>
        </div>

        {/* Tab 1: Faculty Members List */}
        {activeTab === 'facultyList' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Select a Faculty Member to Review</h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Your feedback helps instructors refine lecture delivery and coursework.
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Loading faculty directory...
              </div>
            ) : facultyList.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No faculty members registered in the platform yet.
              </div>
            ) : (
              <div className="grid-2">
                {facultyList.map((faculty) => {
                  const isAlreadyReviewed = reviewedFacultyIds.has(faculty.id);
                  return (
                    <div key={faculty.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{faculty.fullName}</h3>
                            <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                              {faculty.department || 'Department of Engineering'}
                            </div>
                          </div>
                          {isAlreadyReviewed ? (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>Submitted</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: '9999px',
                              }}
                            >
                              Pending Review
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                          Email: {faculty.email}
                        </p>
                      </div>

                      <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                        {isAlreadyReviewed ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled
                            style={{ opacity: 0.7 }}
                          >
                            Feedback Submitted
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenReview(faculty)}
                          >
                            <Send size={15} />
                            <span>Rate & Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Submitted Feedback */}
        {activeTab === 'mySubmissions' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px' }}>
              Feedback You Have Submitted
            </h2>

            {mySubmissions.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <MessageSquareCheck size={40} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
                <h3>No Submissions Yet</h3>
                <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                  You haven't submitted feedback for any faculty members yet.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '16px' }}
                  onClick={() => setActiveTab('facultyList')}
                >
                  View Faculty Members
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                          Faculty Member
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{sub.revieweeName}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <StarRating value={sub.rating} readOnly size={18} showLabel />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          <span>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Criteria details */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        background: '#f8fafc',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#475569',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {sub.teachingQualityRating && (
                        <div>
                          <strong>Teaching Quality:</strong> {sub.teachingQualityRating}/5
                        </div>
                      )}
                      {sub.communicationRating && (
                        <div>
                          <strong>Communication:</strong> {sub.communicationRating}/5
                        </div>
                      )}
                      {sub.subjectKnowledgeRating && (
                        <div>
                          <strong>Subject Knowledge:</strong> {sub.subjectKnowledgeRating}/5
                        </div>
                      )}
                    </div>

                    {/* Comments */}
                    {sub.comments && (
                      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, background: '#ffffff', padding: '10px 0' }}>
                        "{sub.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Feedback Received from Faculty */}
        {activeTab === 'receivedFeedback' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px' }}>
              Academic Performance & Mentoring Reviews Received
            </h2>

            {receivedFeedback.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <Award size={40} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
                <h3>No Faculty Evaluations Yet</h3>
                <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                  When instructors assess your participation and lab performance, evaluations will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {receivedFeedback.map((rec) => (
                  <div key={rec.id} className="card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                          Evaluator
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{rec.reviewerName}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StarRating value={rec.rating} readOnly size={18} showLabel />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        background: '#f8fafc',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#475569',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {rec.participationRating && (
                        <div>
                          <strong>Participation:</strong> {rec.participationRating}/5
                        </div>
                      )}
                      {rec.communicationRating && (
                        <div>
                          <strong>Communication:</strong> {rec.communicationRating}/5
                        </div>
                      )}
                      {rec.subjectKnowledgeRating && (
                        <div>
                          <strong>Subject Understanding:</strong> {rec.subjectKnowledgeRating}/5
                        </div>
                      )}
                    </div>

                    {rec.comments && (
                      <p style={{ fontSize: '0.95rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{rec.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Submission Modal */}
      <FeedbackModal
        reviewee={selectedFaculty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
};

export default StudentDashboard;
