// AdminReviews.js – Updated for Railway Deployment
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Updated API base URL for Railway deployment
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thompson-footwear-production.up.railway.app';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Poppins' }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>📝 All Product Reviews</h2>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
          Loading reviews...
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: 16,
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Product ID</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>User Email</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Rating</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Review</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, index) => (
              <tr key={r.id} style={{ 
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                borderBottom: '1px solid #e9ecef',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#e3f2fd'}
              onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
              >
                <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#495057' }}>{r.id}</td>
                <td style={{ padding: '12px 8px', color: '#6c757d' }}>{r.product_id}</td>
                <td style={{ padding: '12px 8px', color: '#495057' }}>{r.user_email}</td>
                <td style={{ 
                  padding: '12px 8px', 
                  fontSize: '16px',
                  color: '#ffc107'
                }}>
                  {renderStars(r.rating)} ({r.rating}/5)
                </td>
                <td style={{ 
                  padding: '12px 8px', 
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#495057'
                }} title={r.review_text}>
                  {r.review_text}
                </td>
                <td style={{ 
                  padding: '12px 8px', 
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(r.id)} 
                    disabled={loading}
                    style={{ 
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c82333')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#dc3545')}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ 
                  textAlign: 'center', 
                  color: '#6c757d', 
                  padding: 40,
                  fontSize: '16px',
                  fontStyle: 'italic'
                }}>
                  📭 No reviews found. Reviews will appear here once customers start leaving feedback.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reviews.length > 0 && (
        <div style={{ 
          marginTop: 20, 
          padding: 15,
          backgroundColor: '#e9ecef',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#495057'
        }}>
          📊 Total Reviews: <strong>{reviews.length}</strong>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;