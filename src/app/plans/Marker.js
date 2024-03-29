import React from 'react';
import styles from './marker.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faUtensils, faGraduationCap, faLandmark, faPlane, faBasketShopping, faTree, faMugSaucer, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Marker = ({ text, placeId, removePlace, lat, lng, selectedPlaceId, onSelect, type, types, opening_hours }) => {
  const handleDirection = () => {
    const place = encodeURIComponent(text);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place}`, "_blank");
  };

  const handleKakaoDirection = () => {
    const place = encodeURIComponent(text);
    window.open(`https://map.kakao.com/link/to/${place}, ${lat}, ${lng}`, "_blank");
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
        <FontAwesomeIcon icon={icon} bounce className={styles.pin} size="2x" style={{color: color}} />
        <div className={styles.pulse}></div>
      </div>
      <div className={styles.info}>
        <h2>{text}</h2>
        <div className={styles.tagContainer}>
          {types?.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
        {opening_hours && (
          <div className={styles.openingHours}>
            <h3>Opening Hours</h3>
            {opening_hours.map((hour, index) => (
              <p key={index}>{hour}</p>
            ))}
          </div>
        )}
        <div className={styles.directions}>
          <button onClick={handleDirection}><FontAwesomeIcon icon={faChevronRight} /></button>
          <button onClick={handleKakaoDirection}><FontAwesomeIcon icon={faChevronLeft} /></button>
        </div>
      </div>
    </div>
  );
};

export default Marker;
