import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Guidelines from './pages/Guidelines';
import Navigation from './components/Navigation';
import Browse from './pages/Browse';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import Map from './pages/Map';
import { itemsService } from './services/firebaseService';

function App() {
  const [currentTab, setCurrentTab] = useState('browse');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

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
      const itemId = await itemsService.addItem(newItemData);
      await loadItems();
      showNotification('Item posted successfully!', 'success');
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
            onItemUpdate={handleItemUpdate}
            loading={loading}
          />
        );
      case 'guidelines':
        return <Guidelines />;
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
        </div>
      </header>
      <div className="container">
        <Navigation 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
        />
        {renderTabContent()}
      </div>
      {notification && (
        <div className={`notification ${notification.type}`}>
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
    </div>
  );
}

export default App;