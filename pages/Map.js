import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import { getCurrentLocation } from '../utils/geolocation';

const MapView = ({ items }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

  const findMyLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location: ' + error.message);
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
    </div>
  );
};

export default MapView;