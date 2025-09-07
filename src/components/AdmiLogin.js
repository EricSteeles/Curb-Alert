import React, { useState } from 'react';

const AdminLogin = ({ onAdminAccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check - replace 'curb-admin-2024' with your secure password
    const ADMIN_PASSWORD = 'Studioc7380!';
    
    if (password === ADMIN_PASSWORD) {
      // Set admin session
      localStorage.setItem('curb-alert-admin', 'true');
      localStorage.setItem('curb-alert-admin-time', Date.now().toString());
      onAdminAccess(true);
      showNotification('Admin access granted', 'success');
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const showNotification = (message, type) => {
    // Simple notification - you can enhance this
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <div className="tab-content admin-login">
      <div className="login-container">
        <h2>Admin Access Required</h2>
        <p>Enter the admin password to access the moderation panel.</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="admin-password">Admin Password:</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary login-button"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-shield-alt"></i>
                Access Admin Panel
              </>
            )}
          </button>
        </form>
        
        <div className="security-note">
          <p><strong>Security Note:</strong> Admin access is logged and monitored.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;