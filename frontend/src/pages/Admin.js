import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Error loading orders:', err));
  }, []);

  return (
    <div style={{ padding: '40px',marginTop:'50px',fontFamily:'Poppins' }}>
      <h2>Admin Panel – All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px',fontFamily:'Poppins' }}
          >
            <p><strong>Name:</strong> {order.full_name}</p>
            <p><strong>Email:</strong> {order.user_email}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {(() => {
                try {
                  return JSON.parse(order.items).map((item, i) => (
                    <li key={i}>{item.name} – ${item.price}</li>
                  ));
                } catch {
                  return <li>No item data</li>;
                }
              })()}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Admin;
