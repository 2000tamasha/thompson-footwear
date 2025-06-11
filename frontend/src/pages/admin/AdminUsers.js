// AdminUsers.js – View Registered Users by Sharan Adhikari 24071844

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
    switch(action) {
      case 'toggle_admin':
        console.log(`Toggle admin status for ${user.name}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          console.log(`Delete user ${user.name}`);
        }
        break;
      case 'send_email':
        console.log(`Send email to ${user.email}`);
        break;
      case 'view_activity':
        console.log(`View activity for ${user.name}`);
        break;
      default:
        break;
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
    <div style={{ padding: '30px', fontFamily: 'Poppins' }}>
      <h2>👥 Registered Users</h2>
      <p>Manage and monitor your user base</p>
      <p><strong>Total:</strong> {stats.totalUsers} | <strong>Admins:</strong> {stats.adminUsers} | <strong>Users:</strong> {stats.regularUsers} | <strong>New This Week:</strong> {stats.recentUsers}</p>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentUsers.map((user) => (
          <li key={user.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{user.name}</strong> ({user.email}) - {user.is_admin ? 'Admin' : 'User'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
