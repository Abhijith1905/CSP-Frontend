import React, { useState } from 'react';
import { User, CreditCard as Edit3, Save, X, Camera, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  });

  console.log("Hi User groups:", user?.role);

  const [errors, setErrors] = useState({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMessage('Please fill both fields.');
      return;
    }
    setIsPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordMessage('Failed to update password. ' + error.message);
    }
    setIsPasswordLoading(false);
  };

  if (!user) {
    return (
      <div style={styles.notLoggedIn}>
        <h1 style={styles.notLoggedInTitle}>Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.avatarSection}>
            
            <h2 style={styles.userName}>{user.firstName} {user.lastName}</h2>
            <p style={styles.userEmail}>{user.email}</p>
            <span style={styles.roleBadge}>
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </span>
          </div>

          <nav style={styles.sidebarNav}>
            <button style={{...styles.navItem, ...styles.navItemActive}}>
              <User style={styles.navIcon} />
              Profile Info
            </button>
            
          </nav>
        </aside>

        <main style={styles.mainContent}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Profile Information</h1>
              <p style={styles.pageSubtitle}>Manage your personal details and account settings</p>
            </div>
            {!isEditing && (
              <button type="button" onClick={() => setIsEditing(true)} style={styles.editButton}>
                <Edit3 style={styles.editIcon} />
                Edit Profile
              </button>
            )}
          </div>

          {errors.general && (
            <div style={styles.errorAlert}>
              <p style={styles.errorText}>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Personal Details</h3>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      ...styles.input,
                      ...(isEditing ? styles.inputEditing : styles.inputDisabled),
                      ...(errors.firstName ? styles.inputError : {})
                    }}
                  />
                  {errors.firstName && <p style={styles.fieldError}>{errors.firstName}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      ...styles.input,
                      ...(isEditing ? styles.inputEditing : styles.inputDisabled),
                      ...(errors.lastName ? styles.inputError : {})
                    }}
                  />
                  {errors.lastName && <p style={styles.fieldError}>{errors.lastName}</p>}
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{...styles.input, ...styles.inputDisabled}}
                  />
                  {errors.email && <p style={styles.fieldError}>{errors.email}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    disabled
                    placeholder="(555) 123-4567"
                    style={{...styles.input, ...styles.inputDisabled}}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    ...styles.input,
                    ...(isEditing ? styles.inputEditing : styles.inputDisabled)
                  }}
                />
              </div>
            </div>

            {isEditing && (
              <div style={styles.formActions}>
                <button type="submit" disabled={isLoading} style={styles.saveButton}>
                  <Save style={styles.buttonIcon} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                  <X style={styles.buttonIcon} />
                  Cancel
                </button>
              </div>
            )}
          </form>

          <div style={styles.securitySection}>
            <h3 style={styles.sectionTitle}>Security Settings</h3>

            <form onSubmit={handlePasswordUpdate} style={styles.passwordForm}>
              <div style={styles.passwordHeader}>
                <div>
                  <h4 style={styles.passwordTitle}>Change Password</h4>
                  <p style={styles.passwordSubtitle}>Keep your account secure by updating your password regularly</p>
                </div>
              </div>

              <div style={styles.passwordFields}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" disabled={isPasswordLoading} style={styles.passwordButton}>
                <Lock style={styles.buttonIcon} />
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </button>

              {passwordMessage && (
                <p style={styles.passwordMessage}>{passwordMessage}</p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
  },
  layout: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '30px',
  },
  sidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    height: 'fit-content',
    position: 'sticky',
    top: '40px',
  },
  avatarSection: {
    textAlign: 'center',
    paddingBottom: '24px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '24px',
  },
  avatarWrapper: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px',
  },
  avatarImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #f1f3f5',
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #f1f3f5',
  },
  avatarIcon: {
    width: '48px',
    height: '48px',
    color: '#868e96',
  },
  cameraButton: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '2px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cameraIcon: {
    width: '16px',
    height: '16px',
    color: '#495057',
  },
  userName: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  userEmail: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '0 0 12px 0',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  navItemActive: {
    backgroundColor: '#f8f9fa',
    color: '#212529',
    fontWeight: '600',
  },
  navIcon: {
    width: '20px',
    height: '20px',
  },
  mainContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid #f1f3f5',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#6c757d',
    margin: 0,
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    border: '2px solid #dee2e6',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editIcon: {
    width: '18px',
    height: '18px',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #ffc9c9',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '24px',
  },
  errorText: {
    fontSize: '14px',
    color: '#c92a2a',
    margin: 0,
  },
  formSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 24px 0',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '8px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #dee2e6',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  inputEditing: {
    backgroundColor: '#ffffff',
    borderColor: '#adb5bd',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    color: '#6c757d',
    cursor: 'not-allowed',
  },
  inputError: {
    borderColor: '#fa5252',
  },
  fieldError: {
    fontSize: '13px',
    color: '#fa5252',
    margin: '6px 0 0 0',
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    paddingTop: '24px',
    borderTop: '2px solid #f1f3f5',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    backgroundColor: '#228be6',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    backgroundColor: '#e9ecef',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonIcon: {
    width: '18px',
    height: '18px',
  },
  securitySection: {
    marginTop: '40px',
    paddingTop: '40px',
    borderTop: '2px solid #f1f3f5',
  },
  passwordForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
  },
  passwordHeader: {
    marginBottom: '20px',
  },
  passwordTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 6px 0',
  },
  passwordSubtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0,
  },
  passwordFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  passwordButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    backgroundColor: '#495057',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  passwordMessage: {
    fontSize: '14px',
    color: '#495057',
    margin: '16px 0 0 0',
  },
  notLoggedIn: {
    padding: '64px 16px',
    textAlign: 'center',
  },
  notLoggedInTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 16px 0',
  },
};
