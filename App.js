import React, { useState, useEffect } from 'react';
import './styles/App.css';

// Components
import Guidelines from './pages/Guidelines';
import Navigation from './components/Navigation';
import Browse from './pages/Browse';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import Map from './pages/Map';

// Firebase Services
import { itemsService } from './services/firebaseService';

function App() {
  const [currentTab, setCurrentTab] = useState('browse');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Load items from Firebase on app start
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      console.log('LOADING ITEMS from Firebase...');
      const fetchedItems = await itemsService.getAllItems();
      console.log('FETCHED ITEMS:', fetchedItems.length, 'items');
      console.log('FIREBASE ITEM IDS:', fetchedItems.map(item => ({title: item.title, id: item.id, idType: typeof item.id})));
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
      // Add item to Firebase
      const itemId = await itemsService.addItem(newItemData);
      
      // Refresh the items list
      await loadItems();
      
      showNotification('Item posted successfully!', 'success');
      setCurrentTab('browse'); // Redirect to browse after posting
      
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
      await loadItems(); // Refresh items
      showNotification('Item updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('Error updating item. Please try again.', 'error');
      throw error;
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      console.log('BEFORE DELETE: Items count =', items.length);
      console.log('ATTEMPTING TO DELETE item with ID:', itemId, 'type:', typeof itemId);
      await itemsService.deleteItem(String(itemId));
      console.log('DELETE SUCCESSFUL, refreshing items...');
      await loadItems(); // Refresh items
      console.log('AFTER REFRESH: Items count =', items.length);
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
      await loadItems(); // Refresh items
      showNotification(`Item marked as ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating item status:', error);
      showNotification('Error updating item status. Please try again.', 'error');
      throw error;
    }
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
            <i className="fas fa-spinner fa-spin"></i>
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
            loading={loading}
          />
        );
      
      case 'map':
  return (
    <Map 
      items={items}
      showNotification={showNotification}
      onItemUpdate={handleItemUpdate}  // ADD THIS LINE
      loading={loading}
    />
  );,
      
      default:
        return null;
    }
  };

case 'guidelines':
      return (
        <Guidelines />
      );
    
    default:
      return null;
  }

  return (
    <div className="app">
      {/* App Header */}
      <header className="header">
        <div className="container">
          <h1>🏠 Curb Alert</h1>
          <p>Find free items in your neighborhood</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="container">
        <Navigation 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
        />

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${
            notification.type === 'success' ? 'fa-check-circle' :
            notification.type === 'error' ? 'fa-exclamation-circle' :
            'fa-info-circle'
          }`}></i>
          {notification.message}
        </div>
      )}

      {/* Floating Add Button - visible on browse/map tabs */}
      {(currentTab === 'browse' || currentTab === 'map') && (
        <button 
          className="floating-add"
          onClick={() => setCurrentTab('post')}
          title="Post new item"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
}

export default App;