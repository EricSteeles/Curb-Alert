import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsAPI } from '../utils/geolocation';

const GoogleMap = ({ items, userLocation, onItemClick, selectedCategory }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [items, selectedCategory, isLoaded]);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && userLocation) {
      updateUserLocation();
    }
  }, [userLocation, isLoaded]);

  const initializeMap = async () => {
    try {
      await loadGoogleMapsAPI();
      
      const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Los Angeles
      
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: userLocation || defaultCenter,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
          mapTypeIds: [
            window.google.maps.MapTypeId.ROADMAP,
            window.google.maps.MapTypeId.SATELLITE,
            window.google.maps.MapTypeId.HYBRID
          ]
        },
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        }
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
      updateMarkers();
      
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setError('Failed to load Google Maps. Please check your API key.');
    }
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const filteredItems = items.filter(item => {
      if (item.status !== 'available') return false;
      if (selectedCategory && item.category !== selectedCategory) return false;
      return true;
    });

    // Add markers for items
    filteredItems.forEach(item => {
      if (item.coordinates) {
        const marker = new window.google.maps.Marker({
          position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
          map: mapInstanceRef.current,
          title: item.title,
          icon: {
            url: getCategoryIcon(item.category),
            scaledSize: new window.google.maps.Size(40, 40),
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(item)
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          if (onItemClick) {
            onItemClick(item);
          }
        });

        markersRef.current.push(marker);
      }
    });
  };

  const updateUserLocation = () => {
    if (!mapInstanceRef.current || !userLocation) return;

    const userMarker = new window.google.maps.Marker({
      position: { lat: userLocation.lat, lng: userLocation.lng },
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
            <circle cx="10" cy="10" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(20, 20),
      }
    });

    markersRef.current.push(userMarker);
    mapInstanceRef.current.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
  };

  const getCategoryIcon = (category) => {
    const colors = {
      furniture: '#8b5cf6',
      electronics: '#3b82f6',
      appliances: '#ef4444',
      tools: '#f59e0b',
      books: '#10b981',
      clothing: '#ec4899',
      sports: '#06b6d4',
      garden: '#84cc16',
      toys: '#f97316',
      scrap: '#6b7280',
      other: '#8b5cf6'
    };
    
    const color = colors[category] || colors.other;
    
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2C13.3726 2 8 7.3726 8 14C8 22.5 20 38 20 38C20 38 32 22.5 32 14C32 7.3726 26.6274 2 20 2Z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="14" r="5" fill="white"/>
      </svg>
    `);
  };

  const createInfoWindowContent = (item) => {
    const photoHtml = item.photos && item.photos[0] 
      ? `<img src="${item.photos[0]}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />`
      : '';
    
    return `
      <div style="max-width: 200px;">
        ${photoHtml}
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${item.title}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #888;"><strong>Location:</strong> ${item.location.split(',')[0]}</p>
        <p style="margin: 0; font-size: 12px; color: #888;"><strong>Condition:</strong> ${item.condition}</p>
      </div>
    `;
  };

  if (error) {
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ef4444' }}></i>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Please check your Google Maps API key in the .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
      {!isLoaded && (
        <div className="map-loading">
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#667eea' }}></i>
          <p>Loading Google Maps...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;