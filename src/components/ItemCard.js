import React from 'react';

const ItemCard = ({ item, onClick, onStatusUpdate, showActions = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just posted';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { class: 'status-available', text: 'Available' },
      claimed: { class: 'status-claimed', text: 'Claimed' },
      expired: { class: 'status-expired', text: 'Expired' }
    };
    return badges[status] || badges.available;
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

  const statusBadge = getStatusBadge(item.status);

  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-image-container">
        {item.photos && item.photos.length > 0 ? (
          <img 
            src={item.photos[0]} 
            alt={item.title}
            className="item-image"
            onError={(e) => {
              e.target.src = e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="item-image item-no-image">
            <i className={getCategoryIcon(item.category)} style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
          </div>
        )}
        <div className={`status-badge ${statusBadge.class}`}>
          {statusBadge.text}
        </div>
      </div>
      
      <div className="item-content">
        <div className="item-category">
          <i className={getCategoryIcon(item.category)}></i>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>
        
        <h3 className="item-title">{item.title}</h3>
        
        <p className="item-description">
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...`
            : item.description
          }
        </p>
        
        <div className="item-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{item.location.split(',')[0]}</span>
        </div>
        
        <div className="item-meta">
          <span className="item-condition">
            <i className="fas fa-info-circle"></i>
            Condition: {item.condition}
          </span>
          <span className="item-time">
            <i className="fas fa-clock"></i>
            {formatDate(item.posted)}
          </span>
        </div>

        {showActions && (
          <div className="item-actions">
            {item.status === 'available' && (
              <button 
                className="btn btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(item.id, 'claimed');
                }}
              >
                <i className="fas fa-check"></i> Mark as Claimed
              </button>
            )}
            {item.status === 'claimed' && (
              <button 
                className="btn btn-small btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(item.id, 'available');
                }}
              >
                <i className="fas fa-undo"></i> Mark Available
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;