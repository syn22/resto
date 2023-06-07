import React from 'react';
import styles from './marker.module.css';

const Marker = ({ text, placeId, removePlace, lat, lng, selectedPlaceId, onSelect }) => {
  const handleDirection = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  const handleRemove = () => {
    removePlace(placeId);
  };

  const handleClick = () => {
    onSelect(placeId);
  };

  return (
    <div onClick={handleClick} className={styles.marker}>
      <div className={styles.pin}></div>
      <div className={styles.pulse}></div>
      {selectedPlaceId === placeId && (
        <div className={styles.info}>
          <h2>{text}</h2>
          <button onClick={handleDirection}>Get Directions</button>
          <button onClick={handleRemove}>Remove Place</button>
        </div>
      )}
    </div>
  );
};

export default Marker;
