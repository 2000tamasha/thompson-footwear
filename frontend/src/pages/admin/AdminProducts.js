// AdminProducts.js – Fixed Add Product Button
import React, { useEffect, useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Check your backend connection.');
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/products/${productToDelete.id}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) throw new Error('Failed to delete product');
      
      closeDeleteModal();
      fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    console.log("=== ADD PRODUCT BUTTON CLICKED ===");
    console.log("Current showModal state:", showModal);
    
    // Reset form completely
    setForm({
      name: '',
      price: '',
      category: '',
      stock: '',
      image_url: '',
      description: '',
      style_code: '',
      color_variants: '',
      size_us: '',
      size_uk: '',
      size_eu: '',
      long_description: ''
    });
    
    setIsEditing(false);
    setShowModal(true);
    
    console.log("Modal should now be visible");
  };

  const openEditModal = (product) => {
    setForm({ ...product });
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const url = isEditing
      ? `http://localhost:5000/api/products/${form.id}`
      : 'http://localhost:5000/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      console.log("API response:", result);

      closeModal();
      fetchProducts();
      alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error("Add/Edit failed:", err);
      alert(`Error ${isEditing ? 'updating' : 'adding'} product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-products-container" style={{ position: 'relative', zIndex: 1 }}>
      <h2>🛍 Manage Products</h2>
      

      <button
        type="button"
        onClick={() => {
          console.log("Button clicked - about to call openAddModal");
          openAddModal();
        }}
        className="add-product-btn"
        disabled={loading}
        style={{
          margin: '10px 5px',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 99999,
          display: 'inline-block',
          position: 'relative',
          pointerEvents: 'auto'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
      >
        ➕ Add New Product
      </button>

      <table border="1" cellPadding="10" style={{ width: '100%', fontFamily: 'Poppins' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No products found. Click "Add Product" to get started!
              </td>
            </tr>
          ) : (
            products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.category}</td>
                <td>{prod.stock}</td>
                <td>
                  <button 
                    onClick={() => openEditModal(prod)}
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => openDeleteModal(prod)}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white' }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="name" 
                  placeholder="Product Name *" 
                  value={form.name || ''} 
                  onChange={handleChange} 
                  required 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  placeholder="Price *" 
                  value={form.price || ''} 
                  onChange={handleChange} 
                  required 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="category" 
                  placeholder="Category" 
                  value={form.category || ''} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="stock" 
                  type="number"
                  placeholder="Stock Quantity" 
                  value={form.stock || ''} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="image_url" 
                  placeholder="Image URL" 
                  value={form.image_url || ''} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  name="description" 
                  placeholder="Short Description" 
                  value={form.description || ''} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <textarea 
                  name="long_description" 
                  placeholder="Long Description" 
                  value={form.long_description || ''} 
                  onChange={handleChange} 
                  rows="3"
                  style={{...inputStyle, resize: 'vertical'}}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Saving...' : (isEditing ? "Update Product" : "Add Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}>
          <div style={{...modalBox, maxWidth: '400px'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>⚠️ Confirm Delete</h3>
            <p style={{ marginBottom: '20px', fontSize: '16px' }}>
              Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"?
            </p>
            <p style={{ marginBottom: '30px', color: '#666', fontSize: '14px' }}>
              This action cannot be undone.
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
                  cursor: 'pointer'
                }}
              >
                No, Cancel
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
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  fontFamily: 'Poppins'
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
  borderRadius: '8px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  fontFamily: 'Poppins',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
};

export default AdminProducts;