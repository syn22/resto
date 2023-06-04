'use client'
import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import SearchBox from "./SearchBox";
import { setMapViewport } from './mapUtils';

const AddPlacePage = () => {
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMaps(maps);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    console.log(place)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        place
      }),
    };
    fetch('http://localhost:5001/api/places/mongodb-data', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ 
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
          libraries: ['places']
        }}
        defaultCenter={{ lat: 59.955413, lng: 30.337844 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        <SearchBox
          map={map}
          maps={maps}
          setMapViewport={setMapViewport(map, maps)}
          onPlaceSelect={handlePlaceSelect}
        />
      </GoogleMapReact>

      {selectedPlace && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            color: 'black',
          }}
        >
        </div>
      )}
    </div>
  );
}

export default AddPlacePage;