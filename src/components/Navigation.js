import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'browse', label: 'Browse Items', icon: 'fas fa-search' },
    { id: 'map', label: 'Map View', icon: 'fas fa-map-marked-alt' },
    { id: 'post', label: 'Post Item', icon: 'fas fa-plus-circle' },
    { id: 'myitems', label: 'My Items', icon: 'fas fa-user' }
  ];

  return (
    <div className="nav-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <i className={tab.icon}></i>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;