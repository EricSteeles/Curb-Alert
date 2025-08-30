import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Navigation from './components/Navigation';
import Browse from './pages/Browse';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import MapView from './pages/Map';
import { loadItems, saveItems, loadUserItems, saveUserItems } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('browse');
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Load data on app start
    setItems(loadItems());
    setUserItems(loadUserItems());
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now(),
      posted: new Date().toISOString(),
      status: 'available'
    };
    
    const updatedItems = [...items, itemWithId];
    const updatedUserItems = [...userItems, itemWithId];
    
    setItems(updatedItems);
    setUserItems(updatedUserItems);
    
    saveItems(updatedItems);
    saveUserItems(updatedUserItems);
    
    showNotification('Item posted successfully!');
    setActiveTab('browse');
  };

  const updateItemStatus = (itemId, status) => {
    const updateItems = (itemsList) => 
      itemsList.map(item => 
        item.id === itemId ? { ...item, status } : item
      );

    const updatedItems = updateItems(items);
    const updatedUserItems = updateItems(userItems);
    
    setItems(updatedItems);
    setUserItems(updatedUserItems);
    
    saveItems(updatedItems);
    saveUserItems(updatedUserItems);
    
    showNotification(`Item marked as ${status}!`);
  };

  const deleteItem = (itemId) => {
    const filteredItems = items.filter(item => item.id !== itemId);
    const filteredUserItems = userItems.filter(item => item.id !== itemId);
    
    setItems(filteredItems);
    setUserItems(filteredUserItems);
    
    saveItems(filteredItems);
    saveUserItems(filteredUserItems);
    
    showNotification('Item deleted successfully!');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'browse':
        return <Browse items={items} updateItemStatus={updateItemStatus} />;
      case 'map':
        return <MapView items={items} />;
      case 'post':
        return <PostItem onItemPost={addItem} showNotification={showNotification} />;
      case 'myitems':
        return <MyItems 
          items={userItems} 
          updateItemStatus={updateItemStatus}
          deleteItem={deleteItem}
        />;
      default:
        return <Browse items={items} updateItemStatus={updateItemStatus} />;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1><i className="fas fa-recycle"></i> Curb Alert</h1>
          <p>One Person's Trash, Another's Treasure</p>
        </div>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {renderActiveTab()}

        {/* Floating Add Button */}
        <div className="floating-add" onClick={() => setActiveTab('post')}>
          <i className="fas fa-plus"></i>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;