// AdminOrders.js – All Orders Panel with Delete Functionality

import React, { useEffect, useState } from 'react';

// API Base URL for both development and production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://thompson-footwear-production-d96f.up.railway.app'
  : 'http://localhost:5000';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(`${API_BASE}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        console.error('Error loading orders:', err);
        alert('Failed to load orders. Please check your backend connection.');
      });
  };

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const showSuccessMessage = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/orders/${orderToDelete.id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || `HTTP ${res.status}: Failed to delete order`);
      }
      
      closeDeleteModal();
      fetchOrders();
      showSuccessMessage();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Failed to delete order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Poppins' }}>
      <h2>📦 All Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No orders found.</p>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Total Orders: <strong>{orders.length}</strong>
          </p>
          
          {orders.map((order) => {
            let items = [];
            try {
              items = JSON.parse(order.items);
            } catch (err) {
              console.error('Invalid item format:', err);
            }

            return (
              <div key={order.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h4 style={{ margin: '0', color: '#333' }}>Order ID: #{order.id}</h4>
                  <button
                    onClick={() => openDeleteModal(order)}
                    style={deleteButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    🗑 Delete Order
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <p style={infoStyle}><strong>Customer:</strong> {order.full_name}</p>
                    <p style={infoStyle}><strong>Email:</strong> {order.user_email}</p>
                    <p style={infoStyle}><strong>Phone:</strong> {order.phone}</p>
                  </div>
                  <div>
                    <p style={infoStyle}><strong>Total:</strong> <span style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bold' }}>${parseFloat(order.total_amount).toFixed(2)}</span></p>
                    <p style={infoStyle}><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p style={infoStyle}><strong>Items:</strong> {items.length} item(s)</p>
                  </div>
                </div>

                <p style={infoStyle}><strong>Delivery Address:</strong> {order.address}</p>

                <details style={{ marginTop: '15px' }}>
                  <summary style={summaryStyle}>📋 View Order Items ({items.length})</summary>
                  <div style={{ marginTop: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                    {items.length === 0 ? (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No items found in this order.</p>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {items.map((item, idx) => (
                          <div key={idx} style={itemStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</span>
                              <span style={{ color: '#28a745', fontWeight: 'bold' }}>${parseFloat(item.price).toFixed(2)}</span>
                            </div>
                            {item.size && <span style={{ fontSize: '14px', color: '#666' }}>Size: {item.size}</span>}
                            {item.quantity && <span style={{ fontSize: '14px', color: '#666' }}>Qty: {item.quantity}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}>
          <div style={{...modalBox, maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>⚠️ Confirm Order Deletion</h3>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                Are you sure you want to delete this order?
              </p>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <p><strong>Order ID:</strong> #{orderToDelete?.id}</p>
                <p><strong>Customer:</strong> {orderToDelete?.full_name}</p>
                <p><strong>Total:</strong> ${parseFloat(orderToDelete?.total_amount || 0).toFixed(2)}</p>
                <p><strong>Date:</strong> {orderToDelete?.created_at ? new Date(orderToDelete.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            <p style={{ marginBottom: '30px', color: '#dc3545', fontSize: '14px', fontWeight: 'bold' }}>
              ⚠️ This action cannot be undone. The order will be permanently removed from the system.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={closeDeleteModal}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {loading ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fancy Success Toast */}
      {showSuccessToast && (
        <div style={successToastStyle}>
          <div style={toastContentStyle}>
            <div style={toastIconStyle}>✅</div>
            <div style={toastTextStyle}>
              <strong>Order Deleted Successfully!</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.9' }}>
                The order has been permanently removed from the system.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)}
              style={toastCloseStyle}
            >
              ×
            </button>
          </div>
          <div style={progressBarStyle}></div>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '25px',
  border: '1px solid #ddd',
  borderRadius: '12px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const infoStyle = {
  margin: '8px 0',
  fontSize: '14px',
  lineHeight: '1.4'
};

const itemStyle = {
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px solid #e9ecef'
};

const deleteButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
};

const summaryStyle = {
  cursor: 'pointer',
  color: '#007bff',
  fontWeight: 'bold',
  padding: '10px',
  backgroundColor: '#e9f4ff',
  borderRadius: '6px',
  border: '1px solid #bee5eb'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  fontFamily: 'Poppins',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
};

const successToastStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: '#d4edda',
  border: '1px solid #c3e6cb',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(40, 167, 69, 0.3)',
  zIndex: 10000,
  minWidth: '350px',
  maxWidth: '450px',
  overflow: 'hidden',
  animation: 'slideInRight 0.5s ease-out'
};

const toastContentStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '16px 20px',
  gap: '12px'
};

const toastIconStyle = {
  fontSize: '24px',
  flexShrink: 0,
  marginTop: '2px'
};

const toastTextStyle = {
  flex: 1,
  color: '#155724',
  fontSize: '16px',
  fontWeight: '500',
  fontFamily: 'Poppins'
};

const toastCloseStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  color: '#155724',
  cursor: 'pointer',
  padding: '0',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'background-color 0.2s',
  flexShrink: 0
};

const progressBarStyle = {
  height: '4px',
  background: 'linear-gradient(90deg, #28a745, #20c997)',
  animation: 'progressBar 4s linear forwards'
};

//  CSS animations global styles 
const styles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.toast-close:hover {
  background-color: rgba(21, 87, 36, 0.1) !important;
}
`;

// Inject styles if not exist
if (typeof document !== 'undefined' && !document.getElementById('toast-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'toast-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AdminOrders;