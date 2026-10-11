import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, feedbackService } from '../services/api';
import StarRating from '../components/StarRating';
import StatCard from '../components/StatCard';
import FeedbackModal from '../components/FeedbackModal';
import {
  BookOpen,
  GraduationCap,
  Star,
  Users,
  MessageSquare,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  PlusCircle,
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('receivedReviews');
  const [studentsList, setStudentsList] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentsRes, recRes, subRes] = await Promise.all([
        userService.getStudents(),
        feedbackService.getReceived(),
        feedbackService.getMySubmissions(),
      ]);

      if (studentsRes?.data) setStudentsList(studentsRes.data);
      if (recRes?.data) setReceivedReviews(recRes.data);
      if (subRes?.data) setMySubmissions(subRes.data);
    } catch (err) {
      setError(err.message || 'Error loading faculty dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEvaluate = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    setSuccessToast('Student performance review recorded successfully!');
    loadData();
    setTimeout(() => setSuccessToast(''), 5000);
  };

  // Compute average rating from received reviews
  const avgRating =
    receivedReviews.length > 0
      ? (
          receivedReviews.reduce((sum, item) => sum + item.rating, 0) /
          receivedReviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <div style={{ padding: '40px 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          className="card"
          style={{
            marginBottom: '28px',
            background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
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
                <BookOpen size={36} />
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
                  Faculty Hub
                </span>
                <h1 style={{ fontSize: '1.9rem', color: '#ffffff', marginTop: '6px' }}>
                  Welcome, {user?.fullName || 'Professor'}!
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                  {user?.department} &bull; {user?.email}
                </p>
              </div>
            </div>

            <Link
              to="/feedback/new"
              className="btn btn-secondary btn-md"
              style={{ background: '#ffffff', color: '#5b21b6', fontWeight: 700 }}
            >
              <PlusCircle size={18} />
              <span>Evaluate a Student</span>
            </Link>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Metric Cards */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <StatCard
            icon={Star}
            color="amber"
            label="My Overall Rating"
            value={`${avgRating} / 5`}
            subtext={`Across ${receivedReviews.length} student ratings`}
          />
          <StatCard
            icon={MessageSquare}
            color="blue"
            label="Student Feedback Received"
            value={receivedReviews.length}
            subtext="Course & lecture reviews"
          />
          <StatCard
            icon={Award}
            color="emerald"
            label="Students Evaluated"
            value={mySubmissions.length}
            subtext="Performance evaluations submitted"
          />
        </div>

        {/* Dashboard Tabs */}
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'receivedReviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('receivedReviews')}
          >
            <Star size={18} />
            <span>Student Reviews on My Courses ({receivedReviews.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'studentsList' ? 'active' : ''}`}
            onClick={() => setActiveTab('studentsList')}
          >
            <Users size={18} />
            <span>Evaluate Students ({studentsList.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'mySubmissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('mySubmissions')}
          >
            <Award size={18} />
            <span>My Submitted Evaluations ({mySubmissions.length})</span>
          </button>
        </div>

        {/* Tab 1: Student Reviews on My Courses */}
        {activeTab === 'receivedReviews' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px' }}>
              Student Reviews & Course Evaluations
            </h2>

            {receivedReviews.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <Star size={40} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
                <h3>No Student Feedback Yet</h3>
                <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                  When students complete course feedback forms for your classes, comments and ratings will display here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {receivedReviews.map((rev) => (
                  <div key={rev.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                          Student Reviewer
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{rev.reviewerName}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StarRating value={rev.rating} readOnly size={18} showLabel />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
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
                      {rev.teachingQualityRating && (
                        <div>
                          <strong>Teaching Quality:</strong> {rev.teachingQualityRating}/5
                        </div>
                      )}
                      {rev.communicationRating && (
                        <div>
                          <strong>Communication:</strong> {rev.communicationRating}/5
                        </div>
                      )}
                      {rev.subjectKnowledgeRating && (
                        <div>
                          <strong>Subject Knowledge:</strong> {rev.subjectKnowledgeRating}/5
                        </div>
                      )}
                    </div>

                    {rev.comments && (
                      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                        "{rev.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Evaluate Students */}
        {activeTab === 'studentsList' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Enrolled Students Directory</h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Provide feedback on lab participation, project work, and comprehension.
              </span>
            </div>

            {studentsList.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No students registered in the platform yet.
              </div>
            ) : (
              <div className="grid-2">
                {studentsList.map((student) => (
                  <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <GraduationCap size={22} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{student.fullName}</h3>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {student.department || 'Computer Science'}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                        Email: {student.email}
                      </p>
                    </div>

                    <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenEvaluate(student)}
                      >
                        <Send size={15} />
                        <span>Evaluate Student</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Submitted Evaluations */}
        {activeTab === 'mySubmissions' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px' }}>
              Student Evaluations You Have Submitted
            </h2>

            {mySubmissions.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <Award size={40} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
                <h3>No Student Evaluations Yet</h3>
                <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                  Click on the "Evaluate Students" tab above to review students in your department.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="card" style={{ borderLeft: '4px solid #6d28d9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>
                          Evaluated Student
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{sub.revieweeName}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StarRating value={sub.rating} readOnly size={18} showLabel />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
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
                      {sub.participationRating && (
                        <div>
                          <strong>Participation:</strong> {sub.participationRating}/5
                        </div>
                      )}
                      {sub.communicationRating && (
                        <div>
                          <strong>Communication:</strong> {sub.communicationRating}/5
                        </div>
                      )}
                      {sub.subjectKnowledgeRating && (
                        <div>
                          <strong>Subject Understanding:</strong> {sub.subjectKnowledgeRating}/5
                        </div>
                      )}
                    </div>

                    {sub.comments && (
                      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                        "{sub.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Evaluate Student Modal */}
      <FeedbackModal
        reviewee={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
};

export default FacultyDashboard;
