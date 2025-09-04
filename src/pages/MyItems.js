import React, { useState } from 'react';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import EditItemModal from '../components/EditItemModal';

const MyItems = ({ 
  items = [], 
  showNotification, 
  onItemUpdate, 
  onItemDelete, 
  onItemStatusChange, 
  loading 
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filter items - for now showing all items (you could filter by user later)
  const myItems = items; // TODO: Filter by current user when authentication is added

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation(); // Prevent item card click
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteClick = async (item, e) => {
  e.stopPropagation(); // Prevent item card click
  
  if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
    try {
      await onItemDelete(String(item.id)); // ADD String() HERE
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
};

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await onItemStatusChange(itemId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const availableItems = myItems.filter(item => item.status === 'available');
  const claimedItems = myItems.filter(item => item.status === 'claimed');
  const expiredItems = myItems.filter(item => item.status === 'expired');

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <h3>Loading your items...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
        <i className="fas fa-list"></i> My Items
      </h2>

      {/* Stats */}
      <div className="my-items-stats">
        <div className="stat-card available">
          <i className="fas fa-check-circle"></i>
          <div>
            <h3>{availableItems.length}</h3>
            <span>Available</span>
          </div>
        </div>
        <div className="stat-card claimed">
          <i className="fas fa-handshake"></i>
          <div>
            <h3>{claimedItems.length}</h3>
            <span>Claimed</span>
          </div>
        </div>
        <div className="stat-card total">
          <i className="fas fa-list"></i>
          <div>
            <h3>{myItems.length}</h3>
            <span>Total</span>
          </div>
        </div>
      </div>

      {myItems.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-plus-circle" style={{ fontSize: '4rem', marginBottom: '20px', color: '#d1d5db' }}></i>
          <h3>No items posted yet</h3>
          <p>Click the + button to post your first free item!</p>
        </div>
      ) : (
        <>
          {/* Available Items */}
          {availableItems.length > 0 && (
            <div className="items-section">
              <h3 className="section-title">
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                Available Items ({availableItems.length})
              </h3>
              <div className="items-grid">
                {availableItems.map(item => (
                  <div key={item.id} className="my-item-wrapper">
                    <ItemCard
                      item={item}
                      onItemClick={handleItemClick}
                      showNotification={showNotification}
                    />
                    
                    {/* Item Actions */}
                    <div className="my-item-actions">
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={(e) => handleEditClick(item, e)}
                        title="Edit item"
                      >
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      
                      <button
                        className="btn btn-small btn-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, 'claimed');
                        }}
                        title="Mark as claimed"
                      >
                        <i className="fas fa-handshake"></i>
                        Mark Claimed
                      </button>
                      
                      <button
                        className="btn btn-small btn-danger"
                        onClick={(e) => handleDeleteClick(item, e)}
                        title="Delete item"
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claimed Items */}
          {claimedItems.length > 0 && (
            <div className="items-section">
              <h3 className="section-title">
                <i className="fas fa-handshake" style={{ color: '#6b7280' }}></i>
                Claimed Items ({claimedItems.length})
              </h3>
              <div className="items-grid">
                {claimedItems.map(item => (
                  <div key={item.id} className="my-item-wrapper">
                    <ItemCard
                      item={item}
                      onItemClick={handleItemClick}
                      showNotification={showNotification}
                      isClaimedView={true}
                    />
                    
                    {/* Claimed Item Actions */}
                    <div className="my-item-actions">
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={(e) => handleEditClick(item, e)}
                        title="Edit item"
                      >
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      
                      <button
                        className="btn btn-small btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, 'available');
                        }}
                        title="Mark as available again"
                      >
                        <i className="fas fa-undo"></i>
                        Repost
                      </button>
                      
                      <button
                        className="btn btn-small btn-danger"
                        onClick={(e) => handleDeleteClick(item, e)}
                        title="Delete item"
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusChange}
          showNotification={showNotification}
        />
      )}

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={onItemUpdate}
          onClose={handleCloseEditModal}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default MyItems;