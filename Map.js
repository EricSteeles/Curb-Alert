
const MapView = ({ items, showNotification, onItemUpdate }) => {
  console.log('🗺️ MAP COMPONENT LOADED!'); // ADD THIS LINE FIRST

import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import ItemModal from '../components/ItemModal';
import { getCurrentLocation } from '../utils/geolocation';

const MapView = ({ items, showNotification, onItemUpdate }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'tools', label: 'Tools' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'garden', label: 'Garden & Outdoor' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'scrap', label: 'Scrap Metal' },
    { value: 'other', label: 'Other' }
  ];

  const filteredItems = items.filter(item => {
    if (!selectedCategory) return item.status === 'available';
    return item.category === selectedCategory && item.status === 'available';
  });

console.log('🗺️ MAP DEBUG - Total items:', items.length);
console.log('🗺️ MAP DEBUG - Filtered items:', filteredItems.length);
console.log('🗺️ MAP DEBUG - Items data:', items.map(item => ({
  title: item.title,
  status: item.status,
  hasCoordinates: !!item.coordinates,
  coordinates: item.coordinates,
  location: item.location
})));

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await onItemUpdate(itemId, { status: newStatus });
      showNotification(`Item marked as ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating item status:', error);
      showNotification('Error updating item status. Please try again.', 'error');
    }
  };

  const findMyLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      showNotification('Unable to get your location: ' + error.message, 'error');
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    findMyLocation();
  }, []);

  return (
    <div className="tab-content">
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
        <i className="fas fa-map-marked-alt"></i> Map View
      </h2>
      
      <GoogleMap 
        items={filteredItems}
        userLocation={userLocation}
        selectedCategory={selectedCategory}
        onItemClick={handleItemClick}
      />

      <div className="map-controls-bottom">
        <div className="map-actions">
          <button 
            className="btn btn-secondary"
            onClick={findMyLocation}
            disabled={isGettingLocation}
          >
            <i className={`fas ${isGettingLocation ? 'fa-spinner fa-spin' : 'fa-location-arrow'}`}></i>
            {isGettingLocation ? 'Getting Location...' : 'Find My Location'}
          </button>
          
          <div className="map-stats">
            <span className="stat-item">
              <i className="fas fa-map-marker-alt"></i>
              {filteredItems.length} items nearby
            </span>
          </div>
        </div>
      </div>

      <div className="map-filters">
        <div className="form-group">
          <label htmlFor="mapCategoryFilter">
            <i className="fas fa-filter"></i> Filter by Category
          </label>
          <select
            id="mapCategoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-map" style={{ fontSize: '3rem', marginBottom: '15px', opacity: '0.5' }}></i>
          <h3>No items to display</h3>
          <p>Try changing the category filter or check back later for new items!</p>
        </div>
      )}

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default MapView;