"use client";
import React, { useMemo, useState } from "react";
import GoogleMapReact from "google-map-react";
import Image from "next/image";
import grugIcon from "./grug.png";
import thetanIcon from "./thetan.jpg";
import locations from "./locations.json";

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
    <div style={{ width: active ? 100 : 24, aspectRatio: 1, position: "relative" }}>
      <Image src={icon} alt={text} fill />
    </div>
  </div>
);

const handleApiLoaded = (map, maps) => {
  // use map and maps objects
};

export default function SimpleMap() {
  const [selectedMarker, setSelectedMarker] = useState(-1);

  const defaultProps = {
    center: {
      lat: 59.955413,
      lng: 30.337844,
    },
    zoom: 13,
  };

  const renderMarkers = () => {
    return locations.map((location, index) => {
      const icon = location.type === "Resto" ? thetanIcon : grugIcon;
      return (
        <AnyReactComponent
          key={index}
          lat={location.lat}
          lng={location.lng}
          text={location.name}
          icon={icon}
          active={selectedMarker == index}
          onClick={() => setSelectedMarker(index)}
        />
      );
    });
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
