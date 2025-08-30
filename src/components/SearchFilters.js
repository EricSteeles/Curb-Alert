import React from 'react';

const SearchFilters = ({ filters, onFilterChange, isSearching }) => {
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

  const radiusOptions = [
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' }
  ];

  const handleInputChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleCategoryChange = (value) => {
    // Clear custom category when switching away from "other"
    if (value !== 'other') {
      onFilterChange({ 
        category: value,
        customCategory: ''
      });
    } else {
      onFilterChange({ category: value });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      keyword: '',
      location: '',
      category: '',
      customCategory: '',
      radius: 25
    });
  };

  const hasActiveFilters = filters.keyword || filters.location || filters.category || filters.customCategory;

  return (
    <div className="search-filters">
      <div className="filter-row">
        <div className="form-group">
          <label htmlFor="searchKeyword">
            <i className="fas fa-search"></i> Search Items
          </label>
          <input
            type="text"
            id="searchKeyword"
            value={filters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder="Search by item name, description, or tags..."
          />
          <div className="search-hint">
            <i className="fas fa-lightbulb"></i>
            <small>Try searching for specific words like "vintage", "wooden", "retro gaming", etc.</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="searchLocation">
            <i className="fas fa-map-marker-alt"></i> Location
          </label>
          <input
            type="text"
            id="searchLocation"
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter zip code, city, or address..."
            autoComplete="off"
          />
          {filters.location && filters.location.length > 0 && filters.location.length < 5 && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              <i className="fas fa-keyboard"></i> Type full zip code or city name for distance search
            </div>
          )}
          {isSearching && filters.location && filters.location.length >= 5 && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              <i className="fas fa-spinner fa-spin"></i> Searching within {filters.radius} miles...
            </div>
          )}
        </div>
      </div>

      <div className="filter-row">
        <div className="form-group">
          <label htmlFor="searchCategory">
            <i className="fas fa-tag"></i> Category
          </label>
          <select
            id="searchCategory"
            value={filters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          
          {/* Custom category input when "Other" is selected */}
          {filters.category === 'other' && (
            <div className="custom-category-input">
              <input
                type="text"
                value={filters.customCategory || ''}
                onChange={(e) => handleInputChange('customCategory', e.target.value)}
                placeholder="Enter custom category to search for..."
                className="custom-category-field"
              />
              <small className="input-help">
                <i className="fas fa-info-circle"></i>
                Examples: "musical instruments", "art supplies", "car parts", etc.
              </small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="searchRadius">
            <i className="fas fa-circle"></i> Search Radius
          </label>
          <select
            id="searchRadius"
            value={filters.radius || 25}
            onChange={(e) => handleInputChange('radius', parseInt(e.target.value))}
          >
            {radiusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button 
            className="btn btn-secondary btn-small"
            onClick={clearFilters}
          >
            <i className="fas fa-times"></i> Clear Filters
          </button>
          
          {/* Show active filters summary */}
          <div className="active-filters-summary">
            {filters.keyword && (
              <span className="filter-tag">
                <i className="fas fa-search"></i> "{filters.keyword}"
              </span>
            )}
            {filters.category && filters.category !== 'other' && (
              <span className="filter-tag">
                <i className="fas fa-tag"></i> {categories.find(c => c.value === filters.category)?.label}
              </span>
            )}
            {filters.customCategory && (
              <span className="filter-tag">
                <i className="fas fa-tag"></i> {filters.customCategory}
              </span>
            )}
            {filters.location && (
              <span className="filter-tag">
                <i className="fas fa-map-marker-alt"></i> {filters.location} ({filters.radius}mi)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;