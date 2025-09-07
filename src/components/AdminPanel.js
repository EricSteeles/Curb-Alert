import React, { useState, useEffect } from 'react';
import { moderationService, itemsService } from '../services/firebaseService';

const AdminPanel = ({ showNotification, onItemDelete }) => {
  const [reports, setReports] = useState([]);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalFlagged: 0,
    totalItems: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [reportsData, flaggedData, allItems] = await Promise.all([
        moderationService.getAllReports(),
        moderationService.getFlaggedItems(),
        itemsService.getAllItems()
      ]);

      setReports(reportsData);
      setFlaggedItems(flaggedData);
      
      setStats({
        totalReports: reportsData.length,
        pendingReports: reportsData.filter(r => r.status === 'pending').length,
        totalFlagged: flaggedData.length,
        totalItems: allItems.length
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      showNotification('Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (reportId, resolution) => {
    try {
      await moderationService.reviewReport(reportId, resolution);
      await loadAdminData();
      showNotification('Report reviewed successfully', 'success');
    } catch (error) {
      console.error('Error reviewing report:', error);
      showNotification('Error reviewing report', 'error');
    }
  };

  const handleDeleteReportedItem = async (itemId, reportId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      await moderationService.deleteReportedItem(itemId, reportId, 'admin');
      await loadAdminData();
      showNotification('Item deleted and report resolved', 'success');
      // Also notify parent component to refresh items
      if (onItemDelete) {
        onItemDelete(itemId);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Error deleting item', 'error');
    }
  };

  const handleUnflagItem = async (itemId) => {
    try {
      await moderationService.flagItem(itemId, false);
      await loadAdminData();
      showNotification('Item unflagged successfully', 'success');
    } catch (error) {
      console.error('Error unflagging item:', error);
      showNotification('Error unflagging item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading">
          <h3>Loading admin panel...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <div className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            Reports ({stats.pendingReports})
          </button>
          <button 
            className={activeTab === 'flagged' ? 'active' : ''}
            onClick={() => setActiveTab('flagged')}
          >
            Flagged Items ({stats.totalFlagged})
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="admin-dashboard">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{stats.totalItems}</h3>
              <p>Total Items</p>
            </div>
            <div className="stat-card urgent">
              <h3>{stats.pendingReports}</h3>
              <p>Pending Reports</p>
            </div>
            <div className="stat-card warning">
              <h3>{stats.totalFlagged}</h3>
              <p>Flagged Items</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalReports}</h3>
              <p>Total Reports</p>
            </div>
          </div>

          <div className="admin-actions">
            <button 
              className="btn-primary"
              onClick={() => setActiveTab('reports')}
              disabled={stats.pendingReports === 0}
            >
              Review Pending Reports
            </button>
            <button 
              className="btn-secondary"
              onClick={loadAdminData}
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="reports-section">
          <h3>Content Reports</h3>
          {reports.length === 0 ? (
            <div className="no-reports">
              <p>No reports found.</p>
            </div>
          ) : (
            <div className="reports-list">
              {reports.map(report => (
                <div key={report.id} className={`report-card ${report.status}`}>
                  <div className="report-header">
                    <h4>{report.itemId}</h4>
                    <span className="report-status">{report.status}</span>
                    <span className="report-date">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="report-details">
                    <p><strong>Reason:</strong> {report.reason}</p>
                    {report.description && (
                      <p><strong>Details:</strong> {report.description}</p>
                    )}
                    <p><strong>Reported by:</strong> {report.reportedBy}</p>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="report-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => handleReviewReport(report.id, 'No action needed')}
                      >
                        Mark Resolved
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDeleteReportedItem(report.itemId, report.id)}
                      >
                        Delete Item
                      </button>
                    </div>
                  )}
                  
                  {report.resolution && (
                    <div className="report-resolution">
                      <p><strong>Resolution:</strong> {report.resolution}</p>
                      {report.reviewedBy && (
                        <p><strong>Reviewed by:</strong> {report.reviewedBy}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'flagged' && (
        <div className="flagged-section">
          <h3>Flagged Items</h3>
          {flaggedItems.length === 0 ? (
            <div className="no-flagged">
              <p>No flagged items found.</p>
            </div>
          ) : (
            <div className="flagged-list">
              {flaggedItems.map(item => (
                <div key={item.id} className="flagged-item-card">
                  <div className="item-header">
                    <h4>{item.title}</h4>
                    <span className="flagged-date">
                      Flagged: {new Date(item.flaggedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="item-details">
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Description:</strong> {item.description?.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleUnflagItem(item.id)}
                    >
                      Remove Flag
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeleteReportedItem(item.id, null)}
                    >
                      Delete Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;