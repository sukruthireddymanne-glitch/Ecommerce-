import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  MessageSquarePlus,
  BarChart3,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isFaculty, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand">
            <div className="brand-icon-wrapper">
              <GraduationCap size={24} />
            </div>
            <span>EduFeedback</span>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>

            {isAuthenticated && isStudent && (
              <NavLink
                to="/student/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Student Hub</span>
              </NavLink>
            )}

            {isAuthenticated && isFaculty && (
              <NavLink
                to="/faculty/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Faculty Hub</span>
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/feedback/new"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <MessageSquarePlus size={18} />
                <span>{isStudent ? 'Rate Faculty' : 'Evaluate Student'}</span>
              </NavLink>
            )}

            <NavLink
              to="/analytics"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Profile</span>
              </NavLink>
            )}
          </nav>

          {/* User / Auth Buttons */}
          <div className="nav-auth-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="user-menu">
                  <span className={`user-badge role-${user?.role?.toLowerCase()}`}>
                    {user?.role}
                  </span>
                  <span className="user-name-display">{user?.fullName || user?.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  <LogIn size={16} />
                  <span>Log In</span>
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
