import React, { useState } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { getCurrentLocation, reverseGeocode } from '../utils/geolocation';
import { imageService } from '../services/firebaseService';

const PostItem = ({ onItemPost, showNotification }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    description: '',
    location: '',
    condition: 'good',
    contact: '',
    tags: []
  });
  
  const [photos, setPhotos] = useState([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [tagSuggestions] = useState([
    'vintage', 'antique', 'handmade', 'wooden', 'metal', 'plastic', 'glass',
    'retro', 'modern', 'classic', 'broken', 'needs repair', 'working',
    'brand new', 'barely used', 'heavy', 'lightweight', 'small', 'large',
    'collectible', 'rare', 'diy project', 'parts only', 'complete set'
  ]);

  const categories = [
    { value: '', label: 'Select a category' },
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

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor/For Parts' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value) => {
    // Clear custom category when switching away from "other"
    if (value !== 'other') {
      setFormData(prev => ({ ...prev, category: value, customCategory: '' }));
    } else {
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleAddTag = (tag = currentTag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleLocationSelect = (locationData) => {
    setDetectedLocation(locationData);
    showNotification('Address selected and coordinates detected!', 'success');
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.lat, location.lng);
      const locationData = { ...location, address };
      
      setDetectedLocation(locationData);
      setFormData(prev => ({ ...prev, location: address }));
      showNotification('Current location detected successfully!', 'success');
    } catch (error) {
      showNotification('Unable to get your location: ' + error.message, 'error');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.location) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (formData.category === 'other' && !formData.customCategory.trim()) {
      showNotification('Please specify the custom category.', 'error');
      return;
    }

    try {
      // Show loading notification
      showNotification('Uploading item...', 'info');
      
      // Upload photos to Cloudinary first (if any)
      let photoUrls = [];
      if (photos.length > 0) {
        showNotification('Uploading photos...', 'info');
        const photoFiles = photos.map(photo => photo.file);
        photoUrls = await imageService.uploadImages(photoFiles);
        showNotification('Photos uploaded successfully!', 'success');
      }

      const newItem = {
        ...formData,
        // Use custom category if "other" was selected
        finalCategory: formData.category === 'other' ? formData.customCategory.trim().toLowerCase() : formData.category,
        photos: photoUrls, // Store Cloudinary URLs instead of base64
        coordinates: detectedLocation || {
          lat: 34.0522 + (Math.random() - 0.5) * 0.1,
          lng: -118.2437 + (Math.random() - 0.5) * 0.1
        },
        posted: new Date().toISOString(),
        status: 'available',
        id: Date.now() // Simple ID generation
      };

      await onItemPost(newItem);
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        customCategory: '',
        description: '',
        location: '',
        condition: 'good',
        contact: '',
        tags: []
      });
      setPhotos([]);
      setDetectedLocation(null);
      setCurrentTag('');
      
    } catch (error) {
      console.error('Error posting item:', error);
      showNotification('Error uploading item. Please try again.', 'error');
    }
  };

  const filteredSuggestions = tagSuggestions.filter(suggestion => 
    !formData.tags.includes(suggestion) && 
    suggestion.toLowerCase().includes(currentTag.toLowerCase()) &&
    currentTag.length > 0
  ).slice(0, 5);

  return (
    <div className="tab-content">
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
        <i className="fas fa-plus-circle"></i> Post a Free Item
      </h2>
      
      <form onSubmit={handleSubmit} className="post-item-form">
        <div className="form-group">
          <label htmlFor="itemTitle">
            Item Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="itemTitle"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Give your item a descriptive name (e.g., 'Vintage Oak Coffee Table')"
            required
          />
          <small className="input-help">
            <i className="fas fa-lightbulb"></i>
            Be specific! Good titles help people find your item.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="itemCategory">
            Category <span className="required">*</span>
          </label>
          <select
            id="itemCategory"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          
          {/* Custom category input when "Other" is selected */}
          {formData.category === 'other' && (
            <div className="custom-category-input">
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) => handleInputChange('customCategory', e.target.value)}
                placeholder="Enter your custom category..."
                className="custom-category-field"
                required
              />
              <small className="input-help">
                <i className="fas fa-info-circle"></i>
                Examples: "musical instruments", "art supplies", "car parts", etc.
              </small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="itemTags">
            Tags <span className="badge">Optional but recommended</span>
          </label>
          <div className="tags-input-container">
            <input
              type="text"
              id="itemTags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add searchable tags (e.g., 'vintage', 'wooden', 'needs repair')..."
              className="tags-input"
            />
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => handleAddTag()}
              disabled={!currentTag.trim() || formData.tags.length >= 10}
            >
              <i className="fas fa-plus"></i> Add Tag
            </button>
          </div>
          
          {/* Tag suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="tag-suggestions">
              <small>Suggestions:</small>
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-tag"
                  onClick={() => handleAddTag(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Display current tags */}
          {formData.tags.length > 0 && (
            <div className="current-tags">
              <small>Current tags ({formData.tags.length}/10):</small>
              <div className="tags-display">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <small className="input-help">
            <i className="fas fa-search"></i>
            Tags help people find your item when searching. Press Enter or comma to add a tag.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="itemDescription">Description</label>
          <textarea
            id="itemDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the item's condition, size, any defects, pickup details, etc..."
            rows={4}
          />
          <small className="input-help">
            <i className="fas fa-info-circle"></i>
            Include details like dimensions, brand, defects, and pickup instructions.
          </small>
        </div>

        <PhotoUpload 
          photos={photos} 
          setPhotos={setPhotos}
          showNotification={showNotification}
        />

        <div className="form-group">
          <label htmlFor="itemLocation">
            Location <span className="required">*</span>
          </label>
          <AddressAutocomplete
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            onLocationSelect={handleLocationSelect}
            placeholder="Start typing your address..."
            required
          />
          
          <button
            type="button"
            className="btn btn-secondary location-btn"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
          >
            <i className={`fas ${isGettingLocation ? 'fa-spinner fa-spin' : 'fa-location-arrow'}`}></i>
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </button>
          
          {detectedLocation && (
            <div className="location-display active">
              <i className="fas fa-map-marker-alt"></i>
              <span>Location detected: {detectedLocation.address}</span>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="itemCondition">Condition</label>
            <select
              id="itemCondition"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information</label>
            <input
              type="text"
              id="contactInfo"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Phone number or email (optional)"
            />
            <small className="input-help">
              <i className="fas fa-shield-alt"></i>
              Contact info is optional - people can message through the app.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-plus-circle"></i> Post Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;