// Account.js – Profile Edit Enabled by Sharan Adhikari

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Account.css';

const Account = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    address: user?.address || '',
    dob: user?.dob || ''
  });

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!user) {
    return (
      <div className="account-container">
        <h2>You are not logged in.</h2>
        <p>Please log in to view your account details.</p>
      </div>
    );
  }

  return (
    <div className="account-container">
      <h1>My Account</h1>

      {/*  User Info */}
      <div className="account-info">
        {editMode ? (
          <>
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} />
            <label>Contact Number:</label>
            <input name="contact" value={formData.contact} onChange={handleChange} />
            <label>Address:</label>
            <input name="address" value={formData.address} onChange={handleChange} />
            <label>Date of Birth:</label>
            <input name="dob" value={formData.dob} onChange={handleChange} />
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact Number:</strong> {user.contact || 'Not provided'}</p>
            <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
            <p><strong>Date of Birth:</strong> {user.dob || 'Not provided'}</p>
          </>
        )}
      </div>

      {editMode ? (
        <button className="edit-btn" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
      )}

      <button className="logout-btn" onClick={() => setShowModal(true)}>
        Logout
      </button>

      {showModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <h2>Do you want to logout?</h2>
            <div className="modal-actions">
              <button onClick={handleLogoutConfirm} className="yes-btn">Yes</button>
              <button onClick={() => setShowModal(false)} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
