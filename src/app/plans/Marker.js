import React from 'react';
import styles from './marker.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faUtensils, faGraduationCap, faLandmark, faPlane, faBasketShopping, faTree, faMugSaucer } from '@fortawesome/free-solid-svg-icons';

const Marker = ({ text, placeId, removePlace, lat, lng, selectedPlaceId, onSelect, type }) => {
  const handleDirection = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  const handleRemove = () => {
    removePlace(placeId);
  };

  const handleClick = () => {
    onSelect(placeId);
  };

  let icon, color;
  switch (type) {
    case 'restaurant':
      icon = faUtensils;
      color = '#c80000';
      break;
    case 'university':
      icon = faGraduationCap;
      break;
    case 'tourist_attraction' || 'point_of_interest':
      icon = faLandmark;
      break;
    case 'airport':
      icon = faPlane;
      color = '#7586a3';
      break;
    case 'supermarket':
      icon = faBasketShopping;
      break;
    case 'park':
      icon = faTree;
      break;
    case 'cafe' :
      icon = faMugSaucer;
      break;
    default:
      icon = faMapPin;
  }

  return (
    <div 
        onClick={handleClick} 
        className={`${styles.marker} ${selectedPlaceId === placeId ? styles.selected : ""}`}
    >
      <div className={styles.transformed}>
        <FontAwesomeIcon icon={icon} bounce className={styles.pin} size="3x" style={{color: color}} />
        <div className={styles.pulse}></div>
      </div>
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
