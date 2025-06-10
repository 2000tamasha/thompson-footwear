// AdminReviews.js – Shows all reviews in a table

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/reviews').then(res => setReviews(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>All Product Reviews</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>ID</th>
            <th>Product ID</th>
            <th>User Email</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.product_id}</td>
              <td>{r.user_email}</td>
              <td>{r.rating}</td>
              <td>{r.review_text}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(r.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 24 }}>No reviews found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviews;
