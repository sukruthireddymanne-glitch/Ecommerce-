import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569' }}>
          Loading session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If logged in as student trying to access faculty page or vice-versa
    return <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/faculty/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
