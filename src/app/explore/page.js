"use client";
import React, { useCallback, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Image from "next/image";
import restaurantIcon from "./restaurant.png";
import shoppingIcon from "./shopping.png";
import museumIcon from "./museum.png";
import thetanIcon from "./thetan.jpg";
import SearchBox from "./SearchBox"; // make sure the path is correct

const AnyReactComponent = ({ text, icon, active, onClick }) => (
  <div
    style={{
      backgroundColor: "white",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      position: "relative",
      display: "inline-block",
      padding: active ? 8 : 4,
    }}
    onClick={onClick}
  >
    {active && (
      <p style={{ margin: "10px", fontSize: "18px", color: "black" }}>{text}</p>
    )}
    <div style={{ width: active ? 200 : 50, aspectRatio: 1, position: "relative" }}>
      <Image src={icon} alt={text} layout="fill" />
    </div>
  </div>
);

const LocationDot = ({ lat, lng }) => (
    <div style={{ width: 20, height: 20, backgroundColor: 'blue', borderRadius: '50%', position: 'relative' }}>
      <div style={{ 
          position: 'absolute', 
          top: -40, 
          left: '-50%',
          transform: 'translateX(-50%)',
          color: 'white', 
          fontWeight: 'bold', 
          backgroundColor: 'green', 
          padding: '5px 10px',
          borderRadius: '15px',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
          animation: 'pulse 1.5s infinite',
          textAlign: 'center'
        }}>
        You are here
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translateX(-50%) scale(1);
          }
          50% {
            transform: translateX(-50%) scale(1.1);
          }
          100% {
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>
    </div>
  );

export default function SimpleMap() {
    const [selectedMarker, setSelectedMarker] = useState(-1);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 59.955413, lng: 30.337844 }); // Initial coordinates
    const [mapKey, setMapKey] = useState(0); // Key to force re-render
    const [locations, setLocations] = useState([]);

    const [mapZoom, setMapZoom] = useState(13); // Initial zoom level


    const [map, setMap] = useState(null);
    const [maps, setMaps] = useState(null);

    const handleApiLoaded = (map, maps) => {
      setMap(map);
      setMaps(maps);
    };

    const getUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(location);
                if (!mapCenter.lat && !mapCenter.lng) setMapCenter(location); // set mapCenter only the first time
            });
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    }, [mapCenter]);

    const setMapViewport = (bounds) => {
      if(map && maps){
        map.fitBounds(bounds);
        const newZoom = map.getZoom();
        const newCenter = map.getCenter();
    
        setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
        setMapZoom(newZoom);
        setMapKey(prevKey => prevKey + 1);
      }
    };

    // Create a ref for the SearchBox component
    const searchBoxRef = React.useRef(null);

    useEffect(() => {
        if(searchBoxRef.current) {
            searchBoxRef.current.initialize();
        }
    }, [searchBoxRef]);

    useEffect(() => {
        getUserLocation();

        fetch('http://localhost:5001/api/places')
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(err => console.error(err));

    }, [getUserLocation]);

    const centerToUserLocation = useCallback(() => {
        if (userLocation) {
            setMapCenter(userLocation);
            setMapKey(prevKey => prevKey + 1); // Increment key to force re-render
        }
    }, [userLocation])

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
        <div style={{ height: "100vh", width: "100%" }}>
            <SearchBox
              map={map}
              maps={maps}
              setMapViewport={setMapViewport}
/>
            <GoogleMapReact
                key={mapKey}
                bootstrapURLKeys={{ 
                  key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
                  libraries: ['places']  // Add this line
                }}
                defaultCenter={mapCenter}
                defaultZoom={mapZoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              >
              
                {renderMarkers()}
                {userLocation && <LocationDot lat={userLocation.lat} lng={userLocation.lng}/>}
            </GoogleMapReact>
            <button 
                style={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10,
                    zIndex: 1,
                }}
                onClick={centerToUserLocation}
            >
                Center to my location
            </button>
        </div>
    );
}