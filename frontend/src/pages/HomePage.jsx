import React from 'react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Dealership Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      {user?.isAdmin && <p style={{ color: 'red' }}>You have Admin privileges.</p>}
      <button
        onClick={logout}
        style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Logout
      </button>
      <div style={{ marginTop: '20px' }}>
        <p>Vehicle list will go here.</p>
      </div>
    </div>
  );
};
