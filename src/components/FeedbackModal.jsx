import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { feedbackService } from '../services/api';
import StarRating from './StarRating';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const FeedbackModal = ({ reviewee, isOpen, onClose, onSuccess }) => {
  const { isStudent } = useAuth();

  const [rating, setRating] = useState(5);
  const [teachingQualityRating, setTeachingQualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [subjectKnowledgeRating, setSubjectKnowledgeRating] = useState(5);
  const [participationRating, setParticipationRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !reviewee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      setError('Please provide written comments for constructive feedback');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        revieweeId: reviewee.id,
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

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. You may have already reviewed this person.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ marginBottom: '20px' }}>
          <span
            className={`user-badge role-${reviewee.role?.toLowerCase()}`}
            style={{ marginBottom: '8px' }}
          >
            Reviewing {reviewee.role}
          </span>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>{reviewee.fullName}</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {reviewee.department} &bull; {reviewee.email}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Overall Rating */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ fontSize: '1rem', color: '#0f172a' }}>
              Overall Rating *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <StarRating value={rating} onChange={setRating} size={28} showLabel />
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                ({rating} out of 5 stars)
              </span>
            </div>
          </div>

          {/* Criteria Ratings */}
          <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isStudent ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Teaching Quality:</span>
                  <StarRating value={teachingQualityRating} onChange={setTeachingQualityRating} size={20} showLabel />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Communication Clarity:</span>
                  <StarRating value={communicationRating} onChange={setCommunicationRating} size={20} showLabel />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Subject Knowledge:</span>
                  <StarRating value={subjectKnowledgeRating} onChange={setSubjectKnowledgeRating} size={20} showLabel />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Classroom Participation:</span>
                  <StarRating value={participationRating} onChange={setParticipationRating} size={20} showLabel />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Communication & Teamwork:</span>
                  <StarRating value={communicationRating} onChange={setCommunicationRating} size={20} showLabel />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Subject Understanding:</span>
                  <StarRating value={subjectKnowledgeRating} onChange={setSubjectKnowledgeRating} size={20} showLabel />
                </div>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="form-group">
            <label className="form-label" htmlFor="comments">
              Written Comments & Constructive Remarks *
            </label>
            <textarea
              id="comments"
              className="form-control"
              placeholder={
                isStudent
                  ? 'Describe lecture delivery, assignments fairness, accessibility outside class...'
                  : 'Describe student attitude, attentiveness, laboratory performance...'
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
