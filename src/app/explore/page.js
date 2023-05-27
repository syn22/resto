'use client'
import React from "react";
import GoogleMapReact from 'google-map-react';
import Image from 'next/image'
import grugIcon from './grug.png'
import thetanIcon from './thetan.jpg'
import locations from './locations.json'

const AnyReactComponent = ({ text, icon }) => (
  <div style={{ 
    backgroundColor: 'white', 
    border: '1px solid', 
    textAlign: 'center', 
    borderRadius: '10px',
    display: 'inline-block',
    padding: '10px'
  }}>
    <p style={{ margin: '10px', fontSize: '18px' }}>{text}</p>
    <Image 
      src={icon} 
      alt={text} 
      width={100}
      height={100}
    />
  </div>
);

const handleApiLoaded = (map, maps) => {
  // use map and maps objects
};

export default function SimpleMap() {
  const defaultProps = {
    center: {
      lat: 59.955413,
      lng: 30.337844
    },
    zoom: 13
  };

  const renderMarkers = () => {
    return locations.map((location, index) => {
      const icon = location.type === 'Resto' ? thetanIcon : grugIcon;
      return (
        <AnyReactComponent
          key={index}
          lat={location.lat}
          lng={location.lng}
          text={location.name}
          icon={icon}
        />
      )
    })
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {renderMarkers()}
      </GoogleMapReact>
    </div>
  );
}
