// AdminMessages.js – View Contact Messages by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';

// API Base URL for both development and production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://thompson-footwear-production-d96f.up.railway.app'
  : 'http://localhost:5000';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contact`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch contact messages:", err);
    }
  };

  return (
    <div>
      <h2>📩 Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No messages received yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', fontFamily: 'Poppins' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id}>
                <td>{msg.full_name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMessages;