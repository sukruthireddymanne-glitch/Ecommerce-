import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Calendar,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setDepartment(user.department || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError('Full name cannot be empty');
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');

      const res = await userService.updateProfile({ fullName, department });
      if (res?.data) {
        updateUser(res.data);
        setProfileSuccess('Profile details updated successfully!');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      await userService.changePassword({ oldPassword, newPassword });
      setPasswordSuccess('Password successfully updated!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password. Check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Account Settings & Profile</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage your personal academic identity and login security credentials
          </p>
        </div>

        <div className="grid-2">
          {/* Profile Overview & Edit */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: user?.role === 'STUDENT' ? '#dbeafe' : '#ede9fe',
                  color: user?.role === 'STUDENT' ? '#1e40af' : '#6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={28} />
              </div>
              <div>
                <span className={`user-badge role-${user?.role?.toLowerCase()}`}>
                  {user?.role}
                </span>
                <h2 style={{ fontSize: '1.35rem', color: '#0f172a', marginTop: '4px' }}>
                  {user?.fullName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.email}</div>
              </div>
            </div>

            {profileSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emailRead">Email Address (Read-only)</label>
                <input
                  id="emailRead"
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#f8fafc', color: '#64748b' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="department">Department / Branch</label>
                <input
                  id="department"
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                <Save size={16} />
                <span>{profileLoading ? 'Saving...' : 'Update Profile Info'}</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KeyRound size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Change Password</h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Ensure your account uses a secure password
                </div>
              </div>
            </div>

            {passwordSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="oldPassword">Current Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                <KeyRound size={16} />
                <span>{passwordLoading ? 'Updating...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
