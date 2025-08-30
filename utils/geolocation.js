// Enhanced geolocation utilities with Google Maps integration

let googleMapsLoaded = false;
let googleMapsPromise = null;

const loadGoogleMaps = () => {
  if (googleMapsLoaded && window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google);
  }
  
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      googleMapsLoaded = true;
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    window.initGoogleMaps = () => {
      // Wait a bit more for places library to be fully available
      setTimeout(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          googleMapsLoaded = true;
          resolve(window.google);
        } else {
          reject(new Error('Places library failed to load'));
        }
      }, 1000);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps'));
    };
    
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while retrieving location.";
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

export const reverseGeocode = async (lat, lng) => {
  try {
    await loadGoogleMaps();
    
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error('Geocoder failed: ' + status));
        }
      });
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Unable to determine address from coordinates');
  }
};

export const geocodeAddress = async (address) => {
  try {
    await loadGoogleMaps();
    
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          });
        } else {
          reject(new Error('Geocoder failed: ' + status));
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to find coordinates for this address');
  }
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const isWithinRadius = (centerLat, centerLng, pointLat, pointLng, radiusMiles) => {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
  return distance <= radiusMiles;
};

export const initializeAutocomplete = async (inputElement, onPlaceSelect) => {
  try {
    await loadGoogleMaps();
    
    if (!window.google.maps.places || !window.google.maps.places.Autocomplete) {
      throw new Error('Places API not available');
    }
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        onPlaceSelect({
          address: place.formatted_address,
          lat: location.lat(),
          lng: location.lng()
        });
      }
    });

    return autocomplete;
  } catch (error) {
    console.error('Error initializing autocomplete:', error);
    throw error;
  }
};

export const loadGoogleMapsAPI = loadGoogleMaps;