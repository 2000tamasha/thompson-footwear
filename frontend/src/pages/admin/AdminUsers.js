// AdminUsers.js – Updated for Railway Deployment with Enhanced Features
import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Updated API base URL for Railway deployment
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thompson-footwear-production.up.railway.app';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      alert('Failed to load users. Check your backend connection.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleActionsClick = (userId, event) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  const handleUserAction = async (action, user) => {
    setShowActionMenu(null);
    try {
      switch(action) {
        case 'toggle_admin':
          const newAdminStatus = !user.is_admin;
          const res = await fetch(`${API_BASE_URL}/api/users/${user.id}/toggle-admin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_admin: newAdminStatus })
          });
          if (res.ok) {
            fetchUsers();
            alert(`${user.name} ${newAdminStatus ? 'promoted to' : 'demoted from'} admin successfully!`);
          } else {
            throw new Error('Failed to update admin status');
          }
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            const deleteRes = await fetch(`${API_BASE_URL}/api/users/${user.id}`, { method: 'DELETE' });
            if (deleteRes.ok) {
              fetchUsers();
              alert(`${user.name} has been deleted successfully!`);
            } else {
              throw new Error('Failed to delete user');
            }
          }
          break;
        case 'send_email':
          window.open(`mailto:${user.email}?subject=Thompson Footwear - Account Update&body=Hello ${user.name},%0A%0A`);
          break;
        case 'view_activity':
          alert(`Activity log for ${user.name} would be displayed here (feature coming soon)`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Action ${action} failed:`, error);
      alert(`Failed to ${action.replace('_', ' ')} user. Please try again.`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'admin' && user.is_admin) ||
                         (filterType === 'regular' && !user.is_admin);
    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    if (sortBy === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    return sortOrder === 'asc' ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.is_admin).length;
    const regularUsers = totalUsers - adminUsers;
    const recentUsers = users.filter(user => {
      const userDate = new Date(user.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return userDate > weekAgo;
    }).length;
    return { totalUsers, adminUsers, regularUsers, recentUsers };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div style={{ padding: '30px', fontFamily: 'Poppins' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: 'auto'
          }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Poppins', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>👥 Registered Users</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Manage and monitor your user base</p>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ backgroundColor: '#007bff', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.totalUsers}</h3>
            <p style={{ margin: '5px 0 0 0' }}>Total Users</p>
          </div>
          <div style={{ backgroundColor: '#28a745', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.adminUsers}</h3>
            <p style={{ margin: '5px 0 0 0' }}>Admins</p>
          </div>
          <div style={{ backgroundColor: '#17a2b8', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.regularUsers}</h3>
            <p style={{ margin: '5px 0 0 0' }}>Regular Users</p>
          </div>
          <div style={{ backgroundColor: '#ffc107', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.recentUsers}</h3>
            <p style={{ margin: '5px 0 0 0' }}>New This Week</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="regular">Regular Users Only</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Sort by</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {currentUsers.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            color: '#666'
          }}>
            <h3>👤 No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          currentUsers.map((user) => (
            <div 
              key={user.id} 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onClick={() => handleViewDetails(user)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>{user.name}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{user.email}</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: user.is_admin ? '#28a745' : '#17a2b8',
                    color: 'white'
                  }}>
                    {user.is_admin ? '👑 Admin' : '👤 User'}
                  </span>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => handleActionsClick(user.id, e)}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ⚙️ Actions
                  </button>
                  
                  {showActionMenu === user.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '150px'
                    }}>
                      <button
                        onClick={() => handleUserAction('toggle_admin', user)}
                        style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {user.is_admin ? '👤 Remove Admin' : '👑 Make Admin'}
                      </button>
                      <button
                        onClick={() => handleUserAction('send_email', user)}
                        style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        ✉️ Send Email
                      </button>
                      <button
                        onClick={() => handleUserAction('view_activity', user)}
                        style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        📊 View Activity
                      </button>
                      <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
                      <button
                        onClick={() => handleUserAction('delete', user)}
                        style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#dc3545' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        🗑️ Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: '#999' }}>
                <p style={{ margin: '5px 0' }}>📅 Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                <p style={{ margin: '5px 0' }}>ID: {user.id}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          marginTop: '30px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
              color: currentPage === 1 ? '#6c757d' : '#007bff',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          
          <span style={{ padding: '8px 16px', color: '#666' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
              color: currentPage === totalPages ? '#6c757d' : '#007bff',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div style={{
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
        }} onClick={() => setShowUserDetails(false)}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>👤 User Details</h3>
            <div style={{ marginBottom: '15px' }}>
              <strong>Name:</strong> {selectedUser.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Role:</strong> {selectedUser.is_admin ? 'Administrator' : 'Regular User'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>User ID:</strong> {selectedUser.id}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleString()}
            </div>
            <button
              onClick={() => setShowUserDetails(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;