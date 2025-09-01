import React from 'react';
import ContactButtons from './ContactButtons';
import { imageService } from '../services/firebaseService';

const ItemCard = ({ item, onItemClick, showNotification, isClaimedView = false }) => {
  if (!item) return null;

  // Format the posted date
  const formatDate = (date) => {
    if (!date) return 'Recently';
    
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return posted.toLocaleDateString();
  };

  // Get the primary image with optimization
  const getPrimaryImage = () => {
    if (!item.photos || item.photos.length === 0) {
      return null;
    }
    
    // Use Cloudinary optimization if available
    const primaryPhoto = item.photos[0];
    return imageService.getOptimizedUrl(primaryPhoto, {
      width: 400,
      height: 300,
      crop: 'fill'
    });
  };

  // Get display category
  const getDisplayCategory = () => {
    if (item.finalCategory && item.finalCategory !== item.category) {
      return item.finalCategory;
    }
    return item.category;
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Handle item click
 const handleClick = () => {
  console.log('🔍 ITEM CLICKED:', item.title);
  console.log('🔍 onItemClick function:', typeof onItemClick);
  if (typeof onItemClick === 'function') {
    console.log('🔍 Calling onItemClick...');
    onItemClick(item);
  } else {
    console.error('❌ onItemClick is not a function!');
  }
};

  const primaryImage = getPrimaryImage();
  const displayCategory = getDisplayCategory();

  return (
    <div 
      className={`item-card ${isClaimedView ? 'claimed-item' : ''}`}
      onClick={handleClick}
    >
      {/* Status Badge */}
      <div className={`status-badge status-${item.status}`}>
        <i className={`fas ${
          item.status === 'available' ? 'fa-check-circle' :
          item.status === 'claimed' ? 'fa-handshake' :
          'fa-clock'
        }`}></i>
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      </div>

      {/* Image Container */}
      <div className="item-image-container">
        {primaryImage ? (
          <>
            <img 
              src={primaryImage} 
              alt={item.title}
              className="item-image"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="item-no-image" style={{ display: 'none' }}>
              <i className="fas fa-image" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
            </div>
            {item.photos && item.photos.length > 1 && (
              <div className="photo-count-indicator">
                <i className="fas fa-images"></i>
                {item.photos.length}
              </div>
            )}
          </>
        ) : (
          <div className="item-no-image">
            <i className="fas fa-image" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
          </div>
        )}
      </div>

      {/* Item Content */}
      <div className="item-content">
        {/* Category */}
        <div className="item-category">
          <i className="fas fa-tag"></i>
          {displayCategory}
        </div>

        {/* Title */}
        <h3 className="item-title">{item.title}</h3>

        {/* Description */}
        {item.description && (
          <p className="item-description">
            {truncateDescription(item.description)}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="item-tags">
            {item.tags.slice(0, 4).map(tag => (
              <span key={tag} className="item-tag">
                {tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="item-tag more-tags">
                +{item.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Location */}
        <div className="item-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{item.location}</span>
        </div>

        {/* Meta Info */}
        <div className="item-meta">
          <div className="item-time">
            <i className="fas fa-clock"></i>
            {formatDate(item.posted)}
          </div>
          
          <div className={`item-condition condition-${item.condition}`}>
            <i className="fas fa-info-circle"></i>
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </div>
        </div>

        {/* View Count */}
        {item.views > 0 && (
          <div className="item-views">
            <i className="fas fa-eye"></i>
            {item.views} view{item.views !== 1 ? 's' : ''}
          </div>
        )}

        {/* Contact Buttons (only if not claimed and has contact info) */}
        {item.status === 'available' && item.contact && (
          <div className="item-actions" onClick={(e) => e.stopPropagation()}>
            <ContactButtons
              contact={item.contact}
              itemTitle={item.title}
              itemLocation={item.location}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;