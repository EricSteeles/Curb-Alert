import React from 'react';

const Navigation = ({ currentTab, onTabChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentTab === 'browse' ? 'active' : ''}`}
        onClick={() => onTabChange('browse')}
      >
        <i className="fas fa-search"></i>
        <span>Browse</span>
      </button>
      
      <button
        className={`nav-button ${currentTab === 'post' ? 'active' : ''}`}
        onClick={() => onTabChange('post')}
      >
        <i className="fas fa-plus-circle"></i>
        <span>Post Item</span>
      </button>
      
      <button
        className={`nav-button ${currentTab === 'my-items' ? 'active' : ''}`}
        onClick={() => onTabChange('my-items')}
      >
        <i className="fas fa-user"></i>
        <span>My Items</span>
      </button>
      
      <button
        className={`nav-button ${currentTab === 'map' ? 'active' : ''}`}
        onClick={() => onTabChange('map')}
      >
        <i className="fas fa-map-marker-alt"></i>
        <span>Map</span>
      </button>

      <button
        className={`nav-button ${currentTab === 'guidelines' ? 'active' : ''}`}
        onClick={() => onTabChange('guidelines')}
      >
        <i className="fas fa-book-open"></i>
        <span>Guidelines</span>
      </button>
    </nav>
  );
};

export default Navigation;