// AdminUsers.js – View Registered Users by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, admin, regular
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle view details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // NEW: Handle actions menu
  const handleActionsClick = (userId, event) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  // NEW: Handle user actions
  const handleUserAction = async (action, user) => {
    setShowActionMenu(null);
    
    switch(action) {
      case 'toggle_admin':
        console.log(`Toggle admin status for ${user.name}`);
        // Add your API call here
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          console.log(`Delete user ${user.name}`);
          // Add your delete API call here
        }
        break;
      case 'send_email':
        console.log(`Send email to ${user.email}`);
        // Add your email functionality here
        break;
      case 'view_activity':
        console.log(`View activity for ${user.name}`);
        // Add your activity view functionality here
        break;
      default:
        break;
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'admin' && user.is_admin) ||
                         (filterType === 'regular' && !user.is_admin);
    
    return matchesSearch && matchesFilter;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleSort = (field) => {
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
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>👥 Registered Users</h2>
          <p style={subtitleStyle}>Manage and monitor your user base</p>
        </div>
        <button 
          onClick={fetchUsers}
          style={refreshButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={statsContainerStyle}>
        <div style={{...statCardStyle, borderLeft: '4px solid #007bff'}}>
          <div style={statIconStyle}>👤</div>
          <div>
            <h3 style={statNumberStyle}>{stats.totalUsers}</h3>
            <p style={statLabelStyle}>Total Users</p>
          </div>
        </div>
        <div style={{...statCardStyle, borderLeft: '4px solid #28a745'}}>
          <div style={statIconStyle}>👑</div>
          <div>
            <h3 style={statNumberStyle}>{stats.adminUsers}</h3>
            <p style={statLabelStyle}>Admin Users</p>
          </div>
        </div>
        <div style={{...statCardStyle, borderLeft: '4px solid #ffc107'}}>
          <div style={statIconStyle}>🏠</div>
          <div>
            <h3 style={statNumberStyle}>{stats.regularUsers}</h3>
            <p style={statLabelStyle}>Regular Users</p>
          </div>
        </div>
        <div style={{...statCardStyle, borderLeft: '4px solid #17a2b8'}}>
          <div style={statIconStyle}>✨</div>
          <div>
            <h3 style={statNumberStyle}>{stats.recentUsers}</h3>
            <p style={statLabelStyle}>New This Week</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={controlsStyle}>
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="🔍 Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        
        <div style={filtersStyle}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Users</option>
            <option value="admin">Admin Only</option>
            <option value="regular">Regular Only</option>
          </select>
          
          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            style={selectStyle}
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div style={resultsInfoStyle}>
        <p>
          Showing <strong>{indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)}</strong> of <strong>{sortedUsers.length}</strong> users
          {searchTerm && <span> (filtered from {users.length} total)</span>}
        </p>
      </div>

      {/* Users Grid */}
      {currentUsers.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>😔</div>
          <h3 style={emptyTitleStyle}>No users found</h3>
          <p style={emptyTextStyle}>
            {searchTerm ? 'Try adjusting your search or filters' : 'No users have registered yet'}
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {currentUsers.map(user => (
            <div key={user.id} style={userCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={avatarStyle}>
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={userInfoStyle}>
                  <h4 style={userNameStyle}>{user.name || 'Unknown User'}</h4>
                  <p style={userEmailStyle}>{user.email}</p>
                </div>
                <div style={badgeContainerStyle}>
                  {user.is_admin ? (
                    <span style={adminBadgeStyle}>👑 Admin</span>
                  ) : (
                    <span style={userBadgeStyle}>👤 User</span>
                  )}
                </div>
              </div>
              
              <div style={cardBodyStyle}>
                <div style={userDetailStyle}>
                  <span style={labelStyle}>User ID:</span>
                  <span style={valueStyle}>#{user.id}</span>
                </div>
                <div style={userDetailStyle}>
                  <span style={labelStyle}>Joined:</span>
                  <span style={valueStyle}>
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {user.last_login && (
                  <div style={userDetailStyle}>
                    <span style={labelStyle}>Last Login:</span>
                    <span style={valueStyle}>
                      {new Date(user.last_login).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              <div style={cardFooterStyle}>
                <button 
                  style={viewButtonStyle}
                  onClick={() => handleViewDetails(user)}
                >
                  👁 View Details
                </button>
                <div style={{ position: 'relative' }}>
                  <button 
                    style={actionButtonStyle}
                    onClick={(e) => handleActionsClick(user.id, e)}
                  >
                    ⚙️ Actions
                  </button>
                  
                  {/* Actions Dropdown */}
                  {showActionMenu === user.id && (
                    <div style={dropdownStyle}>
                      <button 
                        style={dropdownItemStyle}
                        onClick={() => handleUserAction('toggle_admin', user)}
                      >
                        {user.is_admin ? '👤 Remove Admin' : '👑 Make Admin'}
                      </button>
                      <button 
                        style={dropdownItemStyle}
                        onClick={() => handleUserAction('send_email', user)}
                      >
                        📧 Send Email
                      </button>
                      <button 
                        style={dropdownItemStyle}
                        onClick={() => handleUserAction('view_activity', user)}
                      >
                        📊 View Activity
                      </button>
                      <button 
                        style={{...dropdownItemStyle, color: '#dc3545'}}
                        onClick={() => handleUserAction('delete', user)}
                      >
                        🗑️ Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...paginationButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          
          <div style={pageNumbersStyle}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  ...pageButtonStyle,
                  ...(currentPage === page ? activePageButtonStyle : {})
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...paginationButtonStyle,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div style={modalOverlayStyle} onClick={() => setShowUserDetails(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>User Details</h3>
              <button 
                style={closeButtonStyle}
                onClick={() => setShowUserDetails(false)}
              >
                ✕
              </button>
            </div>
            <div style={modalBodyStyle}>
              <div style={modalUserInfoStyle}>
                <div style={{...avatarStyle, width: '80px', height: '80px', fontSize: '32px'}}>
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h4 style={modalUserNameStyle}>{selectedUser.name || 'Unknown User'}</h4>
                  <p style={modalUserEmailStyle}>{selectedUser.email}</p>
                  {selectedUser.is_admin ? (
                    <span style={adminBadgeStyle}>👑 Admin</span>
                  ) : (
                    <span style={userBadgeStyle}>👤 User</span>
                  )}
                </div>
              </div>
              
              <div style={modalDetailsStyle}>
                <div style={modalDetailRowStyle}>
                  <strong>User ID:</strong> #{selectedUser.id}
                </div>
                <div style={modalDetailRowStyle}>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div style={modalDetailRowStyle}>
                  <strong>Join Date:</strong> {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {selectedUser.last_login && (
                  <div style={modalDetailRowStyle}>
                    <strong>Last Login:</strong> {new Date(selectedUser.last_login).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                <div style={modalDetailRowStyle}>
                  <strong>Account Type:</strong> {selectedUser.is_admin ? 'Administrator' : 'Regular User'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActionMenu && (
        <div 
          style={overlayStyle} 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
};

// styles
const containerStyle = {
  padding: '30px',
  fontFamily: 'Poppins, sans-serif',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
  position: 'relative'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 5px 0'
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#6c757d',
  margin: '0'
};

const refreshButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #007bff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const statCardStyle = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const statIconStyle = {
  fontSize: '32px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '50%',
  minWidth: '52px',
  textAlign: 'center'
};

const statNumberStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
  color: '#2c3e50'
};

const statLabelStyle = {
  fontSize: '14px',
  color: '#6c757d',
  margin: '0'
};

const controlsStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const searchContainerStyle = {
  flex: '1',
  minWidth: '300px'
};

const searchInputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s ease'
};

const filtersStyle = {
  display: 'flex',
  gap: '10px'
};

const selectStyle = {
  padding: '12px 16px',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: 'white',
  cursor: 'pointer',
  outline: 'none'
};

const resultsInfoStyle = {
  marginBottom: '20px',
  color: '#6c757d',
  fontSize: '14px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const userCardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

const cardHeaderStyle = {
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  borderBottom: '1px solid #f1f3f4'
};

const avatarStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#007bff',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 'bold'
};

const userInfoStyle = {
  flex: '1'
};

const userNameStyle = {
  margin: '0 0 5px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#2c3e50'
};

const userEmailStyle = {
  margin: '0',
  fontSize: '14px',
  color: '#6c757d'
};

const badgeContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const adminBadgeStyle = {
  padding: '6px 12px',
  backgroundColor: '#28a745',
  color: 'white',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600'
};

const userBadgeStyle = {
  padding: '6px 12px',
  backgroundColor: '#6c757d',
  color: 'white',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600'
};

const cardBodyStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const userDetailStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const labelStyle = {
  fontSize: '14px',
  color: '#6c757d',
  fontWeight: '500'
};

const valueStyle = {
  fontSize: '14px',
  color: '#2c3e50',
  fontWeight: '600'
};

const cardFooterStyle = {
  padding: '15px 20px',
  borderTop: '1px solid #f1f3f4',
  display: 'flex',
  gap: '10px'
};

const viewButtonStyle = {
  flex: '1',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600'
};

const actionButtonStyle = {
  flex: '1',
  padding: '10px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const emptyIconStyle = {
  fontSize: '64px',
  marginBottom: '20px'
};

const emptyTitleStyle = {
  fontSize: '24px',
  color: '#2c3e50',
  marginBottom: '10px'
};

const emptyTextStyle = {
  fontSize: '16px',
  color: '#6c757d'
};

const paginationStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '30px'
};

const paginationButtonStyle = {
  padding: '10px 20px',
  border: '2px solid #e9ecef',
  backgroundColor: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50'
};

const pageNumbersStyle = {
  display: 'flex',
  gap: '5px'
};

const pageButtonStyle = {
  padding: '8px 12px',
  border: '2px solid #e9ecef',
  backgroundColor: 'white',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#2c3e50'
};

const activePageButtonStyle = {
  backgroundColor: '#007bff',
  borderColor: '#007bff',
  color: 'white'
};

// NEW STYLES for dropdown and modal
const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  backgroundColor: 'white',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000,
  minWidth: '150px',
  overflow: 'hidden'
};

const dropdownItemStyle = {
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  backgroundColor: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#2c3e50',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#f8f9fa'
  }
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '80vh',
  overflow: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
};

const modalHeaderStyle = {
  padding: '20px',
  borderBottom: '1px solid #e9ecef',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const modalTitleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '600',
  color: '#2c3e50'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#6c757d',
  padding: '5px'
};

const modalBodyStyle = {
  padding: '20px'
};

const modalUserInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '30px'
};

const modalUserNameStyle = {
  margin: '0 0 5px 0',
  fontSize: '24px',
  fontWeight: '600',
  color: '#2c3e50'
};

const modalUserEmailStyle = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  color: '#6c757d'
};

const modalDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const modalDetailRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #f1f3f4'
};

// Add spinner animation CSS
const spinnerCSS = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject CSS if not  present
if (typeof document !== 'undefined' && !document.getElementById('admin-users-styles')) {
  const style = document.createElement('style');
  style.id = 'admin-users-styles';
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

export default AdminUsers;