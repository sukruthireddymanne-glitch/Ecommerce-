import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, feedbackService } from '../services/api';
import StarRating from '../components/StarRating';
import {
  MessageSquarePlus,
  Send,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

const FeedbackFormPage = () => {
  const { user, isStudent, isFaculty } = useAuth();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selectedRevieweeId, setSelectedRevieweeId] = useState('');
  const [rating, setRating] = useState(5);
  const [teachingQualityRating, setTeachingQualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [subjectKnowledgeRating, setSubjectKnowledgeRating] = useState(5);
  const [participationRating, setParticipationRating] = useState(5);
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setFetchingList(true);
        if (isStudent) {
          const res = await userService.getFaculty();
          if (res?.data) {
            setCandidates(res.data);
            if (res.data.length > 0) setSelectedRevieweeId(res.data[0].id);
          }
        } else {
          const res = await userService.getStudents();
          if (res?.data) {
            setCandidates(res.data);
            if (res.data.length > 0) setSelectedRevieweeId(res.data[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load candidate list: ' + err.message);
      } finally {
        setFetchingList(false);
      }
    };

    fetchCandidates();
  }, [isStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRevieweeId) {
      setError('Please select an individual to review');
      return;
    }
    if (!comments.trim()) {
      setError('Please enter written comments describing your feedback');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        revieweeId: Number(selectedRevieweeId),
        rating,
        communicationRating,
        subjectKnowledgeRating,
        comments,
      };

      if (isStudent) {
        payload.teachingQualityRating = teachingQualityRating;
        await feedbackService.submitStudentToFaculty(payload);
      } else {
        payload.participationRating = participationRating;
        await feedbackService.submitFacultyToStudent(payload);
      }

      setSuccess('Feedback submitted successfully! Thank you for contributing to academic growth.');
      setTimeout(() => {
        navigate(isStudent ? '/student/dashboard' : '/faculty/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Submission failed. You may have already reviewed this candidate.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPerson = candidates.find((c) => String(c.id) === String(selectedRevieweeId));

  return (
    <div style={{ padding: '50px 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '20px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: isStudent
                  ? 'linear-gradient(135deg, #2563eb, #1e40af)'
                  : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              {isStudent ? <GraduationCap size={28} /> : <BookOpen size={28} />}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', color: '#0f172a' }}>
                {isStudent ? 'Faculty Performance Feedback' : 'Student Performance Evaluation'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {isStudent
                  ? 'Submit ratings and constructive feedback about your instructor'
                  : 'Evaluate student classroom engagement, labs, and comprehension'}
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Reviewee Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="revieweeSelect">
                Select {isStudent ? 'Faculty Member' : 'Student'} to Review *
              </label>
              {fetchingList ? (
                <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '10px 0' }}>
                  Loading candidates...
                </div>
              ) : candidates.length === 0 ? (
                <div className="alert alert-info">
                  No {isStudent ? 'faculty members' : 'students'} available to review at this time.
                </div>
              ) : (
                <select
                  id="revieweeSelect"
                  className="form-control"
                  value={selectedRevieweeId}
                  onChange={(e) => setSelectedRevieweeId(e.target.value)}
                  required
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.department} ({c.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedPerson && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedPerson.fullName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {selectedPerson.department} &bull; {selectedPerson.email}
                  </div>
                </div>
                <span className={`user-badge role-${selectedPerson.role?.toLowerCase()}`}>
                  {selectedPerson.role}
                </span>
              </div>
            )}

            {/* Overall Rating */}
            <div
              className="form-group"
              style={{
                background: '#f8fafc',
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px',
              }}
            >
              <label className="form-label" style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                Overall Rating (1 to 5 Stars) *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <StarRating value={rating} onChange={setRating} size={32} showLabel />
                <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
                  ({rating} / 5 Stars)
                </span>
              </div>
            </div>

            {/* Category Criteria */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', marginBottom: '14px' }}>
                Detailed Performance Criteria:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {isStudent ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Teaching Quality & Pedagogy:</span>
                      <StarRating value={teachingQualityRating} onChange={setTeachingQualityRating} size={22} showLabel />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Communication & Approachability:</span>
                      <StarRating value={communicationRating} onChange={setCommunicationRating} size={22} showLabel />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Subject Knowledge & Mastery:</span>
                      <StarRating value={subjectKnowledgeRating} onChange={setSubjectKnowledgeRating} size={22} showLabel />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Classroom & Lab Participation:</span>
                      <StarRating value={participationRating} onChange={setParticipationRating} size={22} showLabel />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Communication & Team Collaboration:</span>
                      <StarRating value={communicationRating} onChange={setCommunicationRating} size={22} showLabel />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Subject Understanding & Assignments:</span>
                      <StarRating value={subjectKnowledgeRating} onChange={setSubjectKnowledgeRating} size={22} showLabel />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Comments Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="commentsText">
                Written Comments & Suggestions *
              </label>
              <textarea
                id="commentsText"
                className="form-control"
                placeholder={
                  isStudent
                    ? 'Highlight positive aspects, clarity of syllabus, fairness of grading, and areas of improvement...'
                    : 'Highlight student strengths, areas needing extra attention, project contributions...'
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                style={{ minHeight: '130px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || candidates.length === 0}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Submit Official Feedback'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormPage;
