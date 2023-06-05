import React, { forwardRef, useRef, useEffect } from 'react';

const SearchBox = forwardRef(({ map, maps, setMapViewport }, ref) => {
  const searchBoxRef = useRef();
  const searchBox = useRef(null);

  useEffect(() => {
    if (map && maps) {
      searchBox.current = new maps.places.SearchBox(searchBoxRef.current);
      map.controls[maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);

      searchBox.current.addListener('places_changed', () => {
        const places = searchBox.current.getPlaces();
      
        if (places.length === 0) {
          return;
        }
      
        const bounds = new maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;
      
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
      
        setMapViewport(bounds);
      });

      return () => {
        if (searchBox.current && maps) {
          maps.event.clearInstanceListeners(searchBox.current);
        }
      };
    }
  }, [map, maps, setMapViewport]);

  return (
    <input
      ref={searchBoxRef}
      type="text"
      placeholder="Search places..."
      style={{
        boxSizing: `border-box`,
        border: `1px solid transparent`,
        width: `320px`,    // Increased width
        height: `40px`,    // Increased height
        marginTop: `27px`,
        padding: `0 12px`,
        borderRadius: `3px`,
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
        fontSize: `16px`,  // Increased font size
        outline: `none`,
        textOverflow: `ellipses`,
        position: 'absolute',
        left: '55%',       // Moved to the right
        marginLeft: '20px', // Adjusted for new width
      }}
    />
  );
});

SearchBox.displayName = 'SearchBox';  // add this line

export default SearchBox;