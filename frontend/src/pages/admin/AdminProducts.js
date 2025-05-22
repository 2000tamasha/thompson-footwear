// AdminProducts.js – Admin Product Table UI by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const openAddModal = () => {
    setForm({});
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/products/${form.id}`
      : 'http://localhost:5000/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setShowModal(false);
    fetchProducts();
  };

  return (
    <div>
      <h2>🛍 Manage Products</h2>
      <button onClick={openAddModal} style={{ margin: '10px 0' }}>➕ Add Product</button>
      <table border="1" cellPadding="10" style={{ width: '100%', fontFamily: 'Poppins' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>${prod.price}</td>
              <td>{prod.category}</td>
              <td>{prod.stock}</td>
              <td>
                <button onClick={() => openEditModal(prod)}>✏️ Edit</button>{' '}
                <button onClick={() => handleDelete(prod.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} required /><br />
              <input name="price" placeholder="Price" value={form.price || ''} onChange={handleChange} required /><br />
              <input name="category" placeholder="Category" value={form.category || ''} onChange={handleChange} /><br />
              <input name="stock" placeholder="Stock" value={form.stock || ''} onChange={handleChange} /><br />
              <input name="image_url" placeholder="Image URL" value={form.image_url || ''} onChange={handleChange} /><br />
              <input name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} /><br />
              <input name="style_code" placeholder="Style Code" value={form.style_code || ''} onChange={handleChange} /><br />
              <input name="color_variants" placeholder="Color Variants" value={form.color_variants || ''} onChange={handleChange} /><br />
              <textarea name="long_description" placeholder="Long Description" value={form.long_description || ''} onChange={handleChange} /><br />
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
              <button onClick={() => setShowModal(false)} type="button">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
  fontFamily: 'Poppins'
};

export default AdminProducts;