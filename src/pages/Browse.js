import React, { useState, useMemo } from 'react';
import SearchFilters from '../components/SearchFilters';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';

const performEnhancedSearch = (items, filters) => {
  let filteredItems = [...items];
  
  // Keyword search - searches through title, description, tags, and custom categories
  if (filters.keyword && filters.keyword.trim()) {
    const searchTerm = filters.keyword.toLowerCase().trim();
    filteredItems = filteredItems.filter(item => {
      // Search in title
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      
      // Search in description
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      
      // Search in tags (if item has tags)
      const tagsMatch = item.tags && item.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      
      // Search in custom category (if item has finalCategory)
      const customCategoryMatch = item.finalCategory && 
        item.finalCategory.toLowerCase().includes(searchTerm);
      
      // Search in standard category
      const categoryMatch = item.category && 
        item.category.toLowerCase().includes(searchTerm);
      
      return titleMatch || descriptionMatch || tagsMatch || customCategoryMatch || categoryMatch;
    });
  }
  
  // Category filtering
  if (filters.category) {
    if (filters.category === 'other' && filters.customCategory) {
      // Search for custom category
      const customSearchTerm = filters.customCategory.toLowerCase().trim();
      filteredItems = filteredItems.filter(item => {
        // Check if item has a custom category that matches
        const customMatch = item.finalCategory && 
          item.finalCategory.toLowerCase().includes(customSearchTerm);
        
        // Also check if it's categorized as "other"
        const otherMatch = item.category === 'other';
        
        // Check tags for custom category
        const tagMatch = item.tags && item.tags.some(tag => 
          tag.toLowerCase().includes(customSearchTerm)
        );
        
        return customMatch || (otherMatch && tagMatch);
      });
    } else if (filters.category !== 'other') {
      // Standard category filtering
      filteredItems = filteredItems.filter(item => 
        item.category === filters.category || item.finalCategory === filters.category
      );
    }
  }
  
  // Location-based filtering (if you have location search implemented)
  if (filters.location && filters.location.trim().length >= 5) {
    // Basic location filtering - you can enhance this with actual distance calculations
    filteredItems = filteredItems.filter(item => 
      item.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  return filteredItems;
};

const Browse = ({ items = [], showNotification, onReportItem }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    customCategory: '',
    radius: 25
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Enhanced filter change handler
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Apply enhanced search
  const filteredItems = useMemo(() => {
    return performEnhancedSearch(items, filters);
  }, [items, filters]);
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  
  // Sort items by date (newest first) and status (available first)
  const sortedItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      // Available items first
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (a.status !== 'available' && b.status === 'available') return 1;
      
      // Then sort by date (newest first)
      return new Date(b.posted) - new Date(a.posted);
    });
  }, [filteredItems]);
  
  const availableItems = sortedItems.filter(item => item.status === 'available');
  const claimedItems = sortedItems.filter(item => item.status === 'claimed');
  
  return (
    <div className="tab-content">
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
        <i className="fas fa-search"></i> Browse Free Items
      </h2>
      
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        isSearching={isSearching}
      />
      
      <div className="search-results">
        <div className="results-header">
          <h3>
            {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
            {availableItems.length !== sortedItems.length && (
              <span style={{ color: '#10b981', marginLeft: '10px' }}>
                ({availableItems.length} available)
              </span>
            )}
          </h3>
          {filters.keyword && (
            <p className="search-query">
              Searching for: <strong>"{filters.keyword}"</strong>
            </p>
          )}
          {filters.customCategory && (
            <p className="search-query">
              Custom category: <strong>"{filters.customCategory}"</strong>
            </p>
          )}
          {filters.category && filters.category !== 'other' && (
            <p className="search-query">
              Category: <strong>{filters.category}</strong>
            </p>
          )}
        </div>
        
        <div className="items-grid">
          {sortedItems.length > 0 ? (
            sortedItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
                showNotification={showNotification}
                onReportItem={onReportItem}
              />
            ))
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h4>No items found</h4>
              <p>Try adjusting your search filters or browse different categories.</p>
              {(filters.keyword || filters.category || filters.customCategory) && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleFilterChange({ 
                    keyword: '', 
                    category: '', 
                    customCategory: '' 
                  })}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Show separate sections if there are both available and claimed items */}
        {availableItems.length > 0 && claimedItems.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ 
              color: '#6b7280', 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '2rem',
              marginBottom: '1.5rem'
            }}>
              Recently Claimed Items
            </h3>
            <div className="items-grid">
              {claimedItems.map(item => (
                <ItemCard
                  key={`claimed-${item.id}`}
                  item={item}
                  onItemClick={handleItemClick}
                  showNotification={showNotification}
                  onReportItem={onReportItem}
                  isClaimedView={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          showNotification={showNotification}
          onReportItem={onReportItem}
        />
      )}
    </div>
  );
};

export default Browse;