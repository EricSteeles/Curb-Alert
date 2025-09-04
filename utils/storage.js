// Storage utilities for managing app data
import sampleData from '../data/sampleData.json';

const STORAGE_KEYS = {
  ITEMS: 'curbAlert_items',
  USER_ITEMS: 'curbAlert_userItems',
  USER_PREFERENCES: 'curbAlert_preferences'
};

// Initialize storage with sample data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(sampleData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.USER_ITEMS, JSON.stringify([]));
  }
};

// Items management
export const loadItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return items ? JSON.parse(items) : sampleData;
  } catch (error) {
    console.error('Error loading items:', error);
    return sampleData;
  }
};

export const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items:', error);
  }
};

// User items management
export const loadUserItems = () => {
  try {
    const userItems = localStorage.getItem(STORAGE_KEYS.USER_ITEMS);
    return userItems ? JSON.parse(userItems) : [];
  } catch (error) {
    console.error('Error loading user items:', error);
    return [];
  }
};

export const saveUserItems = (userItems) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ITEMS, JSON.stringify(userItems));
  } catch (error) {
    console.error('Error saving user items:', error);
  }
};

// User preferences
export const loadUserPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : {
      location: '',
      searchRadius: 25,
      favoriteCategories: []
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {};
  }
};

export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Search and filter utilities with distance-based filtering
export const filterItems = async (items, filters) => {
  let filteredItems = items.filter(item => {
    const matchesKeyword = !filters.keyword || 
      item.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.keyword.toLowerCase());
    
    const matchesCategory = !filters.category || item.category === filters.category;
    
    const matchesStatus = !filters.status || item.status === filters.status;
    
    return matchesKeyword && matchesCategory && matchesStatus;
  });

  // Apply location-based filtering if location is specified
  if (filters.location && filters.radius) {
    try {
      const { geocodeAddress, isWithinRadius } = await import('./geolocation');
      const searchLocation = await geocodeAddress(filters.location);
      
      filteredItems = filteredItems.filter(item => {
        if (!item.coordinates) return false;
        
        return isWithinRadius(
          searchLocation.lat,
          searchLocation.lng,
          item.coordinates.lat,
          item.coordinates.lng,
          filters.radius
        );
      });
    } catch (error) {
      console.error('Error filtering by location:', error);
      // Fall back to text matching if geocoding fails
      filteredItems = filteredItems.filter(item => 
        !filters.location || 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
  }

  return filteredItems;
};

// Distance calculation (simplified)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Clear all data (for testing)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Export data (for backup)
export const exportData = () => {
  const data = {
    items: loadItems(),
    userItems: loadUserItems(),
    preferences: loadUserPreferences(),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `curb-alert-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Initialize storage when module loads
initializeStorage();