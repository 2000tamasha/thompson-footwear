// AdminOrders.js – All Orders Panel (Styled & Polished)

import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Error loading orders:', err));
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Poppins' }}>
      <h2>📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          let items = [];
          try {
            items = JSON.parse(order.items);
          } catch (err) {
            console.error('Invalid item format:', err);
          }

          return (
            <div key={order.id} style={cardStyle}>
              <h4 style={{ marginBottom: '5px' }}>Order ID: #{order.id}</h4>
              <p><strong>Name:</strong> {order.full_name}</p>
              <p><strong>Email:</strong> {order.user_email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
              <p><strong>Placed At:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <details style={{ marginTop: '10px' }}>
                <summary style={summaryStyle}>View Items ({items.length})</summary>
                <ul style={{ marginTop: '10px' }}>
                  {items.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.name}</strong> — ${parseFloat(item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  marginBottom: '20px'
};

const summaryStyle = {
  cursor: 'pointer',
  color: '#007bff',
  fontWeight: 'bold'
};

export default AdminOrders;
