import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';

const SearchBox = forwardRef(({ map, maps, setMapViewport, onPlaceSelect }, ref) => {
  const searchBoxRef = useRef();
  const [placeData, setPlaceData] = useState(null);

  useEffect(() => {
    if (map && maps) {
      const autocomplete = new maps.places.Autocomplete(searchBoxRef.current, { types: ['establishment'] });
      autocomplete.bindTo('bounds', map);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        // Show the JSON data in the page
        setPlaceData(JSON.stringify(place, null, 2));

        if (!place.geometry || !place.geometry.location) return;
        
        // Call onPlaceSelect with the selected place
        if(onPlaceSelect){
          onPlaceSelect(place);
        }

        const bounds = new maps.LatLngBounds();
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        setMapViewport(bounds);
      });

      return () => {
        maps.event.clearInstanceListeners(searchBoxRef.current);
      };
    }
  }, [map, maps, setMapViewport, onPlaceSelect]);

  return (
    <div style={{ position: 'absolute' }}>
      <input
        ref={searchBoxRef}
        type="text"
        placeholder="Search places..."
        style={{
          boxSizing: 'border-box',
          border: '1px solid transparent',
          width: '320px',
          height: '40px',
          marginTop: '27px',
          padding: '0 12px',
          borderRadius: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '16px',
          outline: 'none',
          textOverflow: 'ellipsis',
          position: 'absolute',
          left: '20px',   // Adjusted left position to 20px
          top: '20px',    // Adjusted top position to 20px
        }}
      />
    </div>
  );  
});

export default SearchBox;
