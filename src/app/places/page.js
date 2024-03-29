'use client'
import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import SearchBox from "./SearchBox";
import { setMapViewport } from './mapUtils';
import MapComponent from './MapComponent'; // Import MapComponent

const AddPlacePage = () => {
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]); // Add a new state for places
  const [plans, setPlans] = useState([]); // Add a new state for plans
  const [selectedPlan, setSelectedPlan] = useState(null); // Add a new state for selected plan

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/plans?user_id=${process.env.NEXT_PUBLIC_TEST_USER_ID}`)
      .then((response) => response.json())
      .then((data) => setPlans(data));
  }, []);

  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMaps(maps);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);

    // If not, proceed to add the place
    const placeData = { 
      place: {
        name: place.name, 
        type: place.types[0],
        types: place.types, // Use all types
        geometry: {
          location: {
            lng: place.geometry.location.lng(),
            lat: place.geometry.location.lat()
          }
        },
        photos: place.photos, // All photos
        current_opening_hours: place.current_opening_hours, // Opening hours
      }
    };

    // POST to /api/places
    const requestOptionsPostgres = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(placeData),
    };
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/places`, requestOptionsPostgres)
        .then(response => {
          if (!response.ok) {
            throw new Error('Place name already exists in the database');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          setPlaces([...places, data]);
        })
        .catch(err => console.error(err.message));  // Log the error message

    // POST to /api/places/mongodb-data
    const requestOptionsMongoDB = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place }),
    };
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/places/mongodb-data`, requestOptionsMongoDB)
        .then(response => {
          if (!response.ok) {
            throw new Error('Place name already exists in the MongoDB');
          }
          return response.json();
        })
        .then(data => console.log(data))
        .catch(err => console.error(err.message));  // Log the error message
  };

  const handleAddPlace = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        place_name: selectedPlace.name, 
        plan_id: selectedPlan // replace this with your actual plan id
      }),
    };
  
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/places/plan`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    console.log('Add place:', selectedPlace);
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ 
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
          libraries: ['places']
        }}
        defaultCenter={{ lat: -6.305968, lng: 106.672272 }}
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
      
      <MapComponent 
        selectedPlace={selectedPlace} 
        handleAddPlace={handleAddPlace} 
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
      />
    </div>
  );
}

export default AddPlacePage;
