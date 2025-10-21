// src/App.jsx

import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [page, setPage] = useState('login');
  // We check localStorage directly to see if a token exists on initial load
  const [token, setToken] = useState(localStorage.getItem('token'));

  // This function will be passed down to the dashboard to handle logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
  };

  // This is our simple, clean router logic.
  const renderPage = () => {
    if (token) {
      // If a token exists, the user is logged in. Always show the dashboard.
      return <DashboardPage token={token} onLogout={handleLogout} />;
    }
    
    // If no token, show the appropriate authentication page.
    switch (page) {
      case 'login':
        return <LoginPage setToken={setToken} setPage={setPage} />;
      case 'register':
        return <RegisterPage setToken={setToken} setPage={setPage} />;
      default:
        return <LoginPage setToken={setToken} setPage={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;