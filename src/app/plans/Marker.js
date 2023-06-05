import React, { useState } from 'react';
import styles from './marker.module.css';

const Marker = ({ text, placeId, removePlace, lat, lng }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleDirection = () => {
    // Open the place in Google Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  const handleRemove = () => {
    // Call the removePlace function passed as a prop
    removePlace(placeId);
  };

  return (
    <div onClick={() => setShowInfo(!showInfo)} className={styles.marker}>
      <div className={styles.pin}></div>
      <div className={styles.pulse}></div>
      {/* Show place info when marker is clicked */}
      {showInfo && (
        <div className={styles.info}>
          <h2>{text}</h2>
          <button onClick={handleDirection}>Get Directions</button>
          <button onClick={handleRemove}>Remove Place</button>
        </div>
      )}
      <div className={styles.markerLabel}>{text}</div>
    </div>
  );
};

export default Marker;
