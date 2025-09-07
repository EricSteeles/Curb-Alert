import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Guidelines from './pages/Guidelines';
import Navigation from './components/Navigation';
import Browse from './pages/Browse';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import Map from './pages/Map';
import ReportModal from './components/ReportModal';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { itemsService, moderationService } from './services/firebaseService';

function App() {
  const [currentTab, setCurrentTab] = useState('browse');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Report system state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingItem, setReportingItem] = useState(null); // This will store the full item object, not just id/title
  
  // Admin system state
  const [isAdmin, setIsAdmin] = useState(() => {
    const adminStatus = localStorage.getItem('curb-alert-admin');
    const adminTime = localStorage.getItem('curb-alert-admin-time');
    
    // Check if admin session is still valid (24 hours)
    if (adminStatus === 'true' && adminTime) {
      const timeDiff = Date.now() - parseInt(adminTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return timeDiff < twentyFourHours;
    }
    return false;
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await itemsService.getAllItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
      showNotification('Error loading items. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPost = async (newItemData) => {
    try {
      // Check for auto-moderation flags
      const flags = await moderationService.autoModerateItem(newItemData);
      
      const itemId = await itemsService.addItem(newItemData);
      
      // If auto-moderation found issues, flag the item
      if (flags.length > 0) {
        await moderationService.flagItem(itemId, true);
        showNotification('Item posted but flagged for review due to content concerns.', 'warning');
      } else {
        showNotification('Item posted successfully!', 'success');
      }
      
      await loadItems();
      setCurrentTab('browse');
      return itemId;
    } catch (error) {
      console.error('Error posting item:', error);
      showNotification('Error posting item. Please try again.', 'error');
      throw error;
    }
  };

  const handleItemUpdate = async (itemId, updates) => {
    try {
      await itemsService.updateItem(itemId, updates);
      await loadItems();
      showNotification('Item updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('Error updating item. Please try again.', 'error');
      throw error;
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      await itemsService.deleteItem(String(itemId));
      await loadItems();
      showNotification('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Error deleting item. Please try again.', 'error');
      throw error;
    }
  };

  const handleItemStatusChange = async (itemId, newStatus) => {
    try {
      await itemsService.updateItemStatus(itemId, newStatus);
      await loadItems();
      showNotification(`Item marked as ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating item status:', error);
      showNotification('Error updating item status. Please try again.', 'error');
      throw error;
    }
  };

  // Report system functions
  const handleReportItem = (itemId, itemTitle) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setReportingItem(item);
      setReportModalOpen(true);
    }
  };

  // Admin functions
  const handleAdminAccess = (granted) => {
    setIsAdmin(granted);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('curb-alert-admin');
    localStorage.removeItem('curb-alert-admin-time');
    setIsAdmin(false);
    setCurrentTab('browse');
    showNotification('Logged out of admin panel', 'info');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const renderTabContent = () => {
    if (loading && items.length === 0) {
      return (
        <div className="tab-content">
          <div className="loading">
            <h3>Loading items...</h3>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'browse':
        return (
          <Browse 
            items={items}
            showNotification={showNotification}
            onItemUpdate={handleItemUpdate}
            onReportItem={handleReportItem}
            loading={loading}
          />
        );
      case 'post':
        return (
          <PostItem 
            onItemPost={handleItemPost}
            showNotification={showNotification}
          />
        );
      case 'my-items':
        return (
          <MyItems 
            items={items}
            showNotification={showNotification}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onItemStatusChange={handleItemStatusChange}
            onReportItem={handleReportItem}
            loading={loading}
          />
        );
      case 'map':
        return (
          <Map 
            items={items}
            showNotification={showNotification}
            onItemUpdate={handleItemUpdate}
            onReportItem={handleReportItem}
            loading={loading}
          />
        );
     case 'guidelines':
  return <Guidelines showNotification={showNotification} />;
      case 'admin':
        return isAdmin ? (
          <AdminPanel 
            showNotification={showNotification}
            onItemDelete={handleItemDelete}
          />
        ) : (
          <AdminLogin onAdminAccess={handleAdminAccess} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Curb Alert</h1>
          <p>Find free items in your neighborhood</p>
          {isAdmin && (
            <div className="admin-indicator">
              <i className="fas fa-shield-alt"></i>
              <span>Admin Mode</span>
              <button className="admin-logout" onClick={handleAdminLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="container">
        <Navigation 
          currentTab={currentTab} 
          onTabChange={setCurrentTab}
          isAdmin={isAdmin}
        />
        {renderTabContent()}
      </div>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${
            notification.type === 'success' ? 'fa-check-circle' :
            notification.type === 'error' ? 'fa-exclamation-circle' :
            notification.type === 'warning' ? 'fa-exclamation-triangle' :
            'fa-info-circle'
          }`}></i>
          {notification.message}
        </div>
      )}
      
      {(currentTab === 'browse' || currentTab === 'map') && (
        <button 
          className="floating-add"
          onClick={() => setCurrentTab('post')}
          title="Post new item"
        >
          +
        </button>
      )}
      
      {/* Report Modal */}
      {reportModalOpen && reportingItem && (
        <ReportModal 
          item={reportingItem}
          onClose={() => {
            setReportModalOpen(false);
            setReportingItem(null);
          }}
          showNotification={showNotification}
        />
      )}
    </div>
  );
}

export default App;