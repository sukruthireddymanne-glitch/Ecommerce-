import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import FeedbackFormPage from './pages/FeedbackFormPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Smart dashboard redirector
const DashboardRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/faculty/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />

              {/* Dynamic Dashboard Redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Protected Student Dashboard */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Faculty Dashboard */}
              <Route
                path="/faculty/dashboard"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <FacultyDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Feedback Submission */}
              <Route
                path="/feedback/new"
                element={
                  <ProtectedRoute>
                    <FeedbackFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
