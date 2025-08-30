import React, { useState } from 'react';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';

const MyItems = ({ items, updateItemStatus, deleteItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusCount = (status) => {
    return items.filter(item => item.status === status).length;
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      deleteItem(itemId);
    }
  };

  return (
    <div className="tab-content">
      <div className="my-items-header">
        <h2>
          <i className="fas fa-user"></i> My Posted Items
        </h2>
        <p>Manage your posted items and track their status</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-plus-circle" style={{ fontSize: '4rem', marginBottom: '20px', opacity: '0.5' }}></i>
          <h3>No items posted yet</h3>
          <p>Post your first item to help others in your community!</p>
          <button 
            className="btn"
            onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'post' }))}
          >
            <i className="fas fa-plus"></i> Post Your First Item
          </button>
        </div>
      ) : (
        <>
          <div className="items-filter">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Items ({items.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                onClick={() => setFilter('available')}
              >
                <i className="fas fa-check-circle"></i>
                Available ({getStatusCount('available')})
              </button>
              <button 
                className={`filter-btn ${filter === 'claimed' ? 'active' : ''}`}
                onClick={() => setFilter('claimed')}
              >
                <i className="fas fa-handshake"></i>
                Claimed ({getStatusCount('claimed')})
              </button>
            </div>
          </div>

          <div className="items-stats">
            <div className="stat-card">
              <div className="stat-number">{items.length}</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{getStatusCount('available')}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{getStatusCount('claimed')}</div>
              <div className="stat-label">Claimed</div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-filter" style={{ fontSize: '3rem', marginBottom: '15px', opacity: '0.5' }}></i>
              <h3>No items match this filter</h3>
              <p>Try selecting a different status filter above</p>
            </div>
          ) : (
            <div className="items-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="my-item-wrapper">
                  <ItemCard
                    item={item}
                    onClick={() => handleItemClick(item)}
                    onStatusUpdate={updateItemStatus}
                    showActions={true}
                  />
                  <div className="my-item-actions">
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => handleItemClick(item)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    
                    {item.status === 'available' ? (
                      <button
                        className="btn btn-small"
                        onClick={() => updateItemStatus(item.id, 'claimed')}
                      >
                        <i className="fas fa-check"></i> Mark Claimed
                      </button>
                    ) : (
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={() => updateItemStatus(item.id, 'available')}
                      >
                        <i className="fas fa-undo"></i> Mark Available
                      </button>
                    )}
                    
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={closeModal}
          onStatusUpdate={updateItemStatus}
        />
      )}
    </div>
  );
};

export default MyItems;