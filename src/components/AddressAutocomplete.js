import React, { useEffect, useRef, useState } from 'react';
import { initializeAutocomplete } from '../utils/geolocation';

const AddressAutocomplete = ({ value, onChange, onLocationSelect, placeholder, required }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [autocompleteReady, setAutocompleteReady] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const lastValueRef = useRef('');

  useEffect(() => {
    const setupAutocomplete = async () => {
      if (!inputRef.current || autocompleteRef.current) return;

      setInitializationAttempts(prev => prev + 1);
      
      try {
        // Don't initialize autocomplete until user has typed at least 3 characters
        if (value.length < 3) {
          if (initializationAttempts === 1) {
            setTimeout(setupAutocomplete, 1000);
          }
          return;
        }

        autocompleteRef.current = await initializeAutocomplete(
          inputRef.current,
          (place) => {
            // Only update if it's a real selection, not just typing
            if (place.address && place.address !== lastValueRef.current) {
              onChange(place.address);
              lastValueRef.current = place.address;
              if (onLocationSelect) {
                onLocationSelect(place);
              }
            }
          }
        );
        setAutocompleteReady(true);
        console.log('Address autocomplete ready');
      } catch (error) {
        console.error('Failed to initialize autocomplete:', error);
        if (initializationAttempts < 3) {
          setTimeout(setupAutocomplete, 3000);
        }
      }
    };

    // Only start trying to setup after user has typed something
    if (value.length >= 3) {
      const timeoutId = setTimeout(setupAutocomplete, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [value, initializationAttempts]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    lastValueRef.current = newValue;
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    // Prevent autocomplete from interfering with normal typing
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.stopPropagation();
    }
  };

  return (
    <div className="address-autocomplete">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Enter zip code or address..."}
        required={required}
        autoComplete="off"
      />
      {value.length > 0 && value.length < 3 && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
          <i className="fas fa-keyboard"></i> Keep typing for address suggestions...
        </div>
      )}
      {value.length >= 3 && !autocompleteReady && initializationAttempts > 0 && (
        <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '5px' }}>
          <i className="fas fa-clock"></i> Loading address suggestions...
        </div>
      )}
      {autocompleteReady && (
        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>
          <i className="fas fa-check-circle"></i> Address suggestions available
        </div>
      )}
      {initializationAttempts >= 3 && !autocompleteReady && value.length >= 3 && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
          <i className="fas fa-keyboard"></i> Continue typing manually
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;