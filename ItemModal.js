import React, { useState } from 'react';
import ContactButtons from './ContactButtons';
import MessageModal from './MessageModal';

const ItemModal = ({ item, onClose, onStatusUpdate, showNotification }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);

  if (!item) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      furniture: 'fas fa-couch',
      electronics: 'fas fa-tv',
      appliances: 'fas fa-washing-machine',
      tools: 'fas fa-tools',
      books: 'fas fa-book',
      clothing: 'fas fa-tshirt',
      sports: 'fas fa-football-ball',
      garden: 'fas fa-seedling',
      toys: 'fas fa-puzzle-piece',
      scrap: 'fas fa-industry',
      other: 'fas fa-box'
    };
    return icons[category] || icons.other;
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { class: 'status-available', text: 'Available', icon: 'fas fa-check-circle' },
      claimed: { class: 'status-claimed', text: 'Claimed', icon: 'fas fa-handshake' },
      expired: { class: 'status-expired', text: 'Expired', icon: 'fas fa-times-circle' }
    };
    return badges[status] || badges.available;
  };

  const nextPhoto = () => {
    if (item.photos && item.photos.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === item.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (item.photos && item.photos.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? item.photos.length - 1 : prev - 1
      );
    }
  };

  const statusBadge = getStatusBadge(item.status);

  return (
    <>
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>

          <div className="modal-header">
            <div className={`status-badge ${statusBadge.class}`}>
              <i className={statusBadge.icon}></i>
              {statusBadge.text}
            </div>
            <div className="item-category">
              <i className={getCategoryIcon(item.category)}></i>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </div>
          </div>

          {item.photos && item.photos.length > 0 && (
            <div className="modal-photos">
              <div className="photo-container">
                <img 
                  src={item.photos[currentPhotoIndex]} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
                
                {item.photos.length > 1 && (
                  <>
                    <button className="photo-nav photo-prev" onClick={prevPhoto}>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="photo-nav photo-next" onClick={nextPhoto}>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                    <div className="photo-indicators">
                      {item.photos.map((_, index) => (
                        <button
                          key={index}
                          className={`photo-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                          onClick={() => setCurrentPhotoIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="modal-body">
            <h2 className="item-title">{item.title}</h2>
            
            <div className="item-meta-grid">
              <div className="meta-item">
                <i className="fas fa-info-circle"></i>
                <span>Condition: {item.condition}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>Posted: {formatDate(item.posted)}</span>
              </div>
            </div>

            {item.description && (
              <div className="item-description">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            )}

            <div className="item-location-section">
              <h3><i className="fas fa-map-marker-alt"></i> Location</h3>
              <p>{item.location}</p>
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => {
                  const query = encodeURIComponent(item.location);
                  window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
                }}
              >
                <i className="fas fa-external-link-alt"></i> Open in Maps
              </button>
            </div>

            {item.contact && (
              <div className="contact-section">
                <h3>
                  <i className="fas fa-comments"></i> Contact Owner
                </h3>
                
                {/* Message Button */}
                <div className="contact-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <i className="fas fa-envelope"></i> Send Message
                  </button>
                  
                  {/* Direct Contact Buttons */}
                  <ContactButtons 
                    contact={item.contact}
                    itemTitle={item.title}
                    itemLocation={item.location}
                  />
                </div>
              </div>
            )}

            <div className="modal-actions">
              <div className="action-buttons">
                {item.status === 'available' && onStatusUpdate && (
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      onStatusUpdate(item.id, 'claimed');
                      onClose();
                    }}
                  >
                    <i className="fas fa-check"></i> Mark as Claimed
                  </button>
                )}
                
                {!item.contact && (
                  <div className="no-contact-info">
                    <i className="fas fa-info-circle"></i>
                    <span>No contact information provided for this item</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          item={item}
          onClose={() => setShowMessageModal(false)}
          showNotification={showNotification}
        />
      )}
    </>
  );
};

export default ItemModal;