'use client'
import React, { useCallback, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import styles from './page.module.css';
import _ from 'lodash';

import AnyReactComponent from "./AnyReactComponent";
import LocationDot from "./LocationDot";
import SearchBox from "./SearchBox";
import PlacesList from './PlacesList';
import { getUserLocation, setMapViewport, getDistanceFromLatLonInKm } from './mapUtils';

import restaurantIcon from "../../../public/icons/restaurant.png"
import shoppingIcon from "../../../public/icons/shopping.png";
import museumIcon from "../../../public/icons/museum.png";
import thetanIcon from "../../../public/icons/thetan.jpg";

export default function SimpleMap() {
    const [selectedMarker, setSelectedMarker] = useState(-1);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -6.305968, lng:	106.672272 }); // Initial coordinates
    const [mapKey, setMapKey] = useState(0); // Key to force re-render
    const [locations, setLocations] = useState([]);
    const [mapZoom, setMapZoom] = useState(13); // Initial zoom level
    const [map, setMap] = useState(null);
    const [maps, setMaps] = useState(null);

    const handleApiLoaded = (map, maps) => {
      setMap(map);
      setMaps(maps);
    };

    // Create a ref for the SearchBox component
    const searchBoxRef = React.useRef(null);

    useEffect(() => {
        if(searchBoxRef.current) {
            searchBoxRef.current.initialize();
        }
    }, [searchBoxRef]);

    useEffect(() => {
      getUserLocation(setUserLocation, setMapCenter);
  }, []);
  const calculateDistances = () => {
    if(userLocation && locations.length > 0){
        let updatedLocations = [...locations]; // create a copy of the locations array
        console.log(updatedLocations)
        updatedLocations.forEach(place => {
            place.distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, place.latitude, place.longitude);
        });
                    
        updatedLocations.sort((a, b) => a.distance - b.distance);

        setLocations(updatedLocations); // update state with new distances
    }
  };
  
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/places`)
      .then(response => response.json())
      .then(data => {
          setLocations(data);
      })
      .catch(err => console.error(err));
}, []);
  
  useEffect(() => {
      calculateDistances();
  }, [userLocation, locations]);

    const centerToUserLocation = useCallback(() => {
        if (userLocation) {
            setMapCenter(userLocation);
            setMapKey(prevKey => prevKey + 1); // Increment key to force re-render
        }
    }, [userLocation, setMapCenter, setMapKey]);

    const renderMarkers = () => {
        return locations.map((location, index) => {
          let icon;
          switch(location.type) {
            case 'Restaurant':
              icon = restaurantIcon;
              break;
            case 'Museum':
              icon = museumIcon;
              break;
            case 'Shopping':
              icon = shoppingIcon;
              break;
            default:
              icon = thetanIcon;
          }
          return (
            <AnyReactComponent
              key={index}
              lat={location.latitude}
              lng={location.longitude}
              text={location.name}
              icon={icon}
              active={selectedMarker === index}
              onClick={() => setSelectedMarker(index)}
            />
          );
        });
      };

      return (
        <div className={styles.container}>
            <div className={styles.placesListContainer}>
                <PlacesList 
                    places={locations} 
                    onPlaceClick={setSelectedMarker} 
                    selectedMarker={selectedMarker} 
                />
            </div>
            <div className={styles.mapContainer}>
            <SearchBox
              map={map}
              maps={maps}
              setMapViewport={setMapViewport(map, maps, setMapCenter, setMapZoom, setMapKey)}
            />
                <GoogleMapReact
                    key={mapKey}
                    bootstrapURLKeys={{ 
                        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
                        libraries: ['places']
                    }}
                    defaultCenter={mapCenter}
                    defaultZoom={mapZoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                >
                    {renderMarkers()}
                    {userLocation && <LocationDot lat={userLocation.lat} lng={userLocation.lng}/>}
                </GoogleMapReact>
            </div>
            <button 
                className={styles.centerButton}
                onClick={centerToUserLocation}
            >
                Center to my location
            </button>
        </div>
    );
}