import React, { useState } from 'react';
import styles from './marker.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faUtensils, faGraduationCap, faLandmark, faPlane, faBasketShopping, faTree, faMugSaucer, faG,  faK  } from '@fortawesome/free-solid-svg-icons';

const Marker = ({ text, placeId, removePlace, lat, lng, selectedPlaceId, onSelect, type, types, opening_hours }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  
  const handleDirection = () => {
    const place = encodeURIComponent(text);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place}`, "_blank");
  };

  const handleKakaoDirection = () => {
    const place = encodeURIComponent(text);
    window.open(`https://map.kakao.com/link/to/${place}, ${lat}, ${lng}`, "_blank");
  };

  const handleClick = () => {
    if (selectedPlaceId === placeId) {
      setInfoOpen(!infoOpen);
    } else {
      onSelect(placeId);
      setInfoOpen(true);
    }
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
      <div className={`${styles.transformed} ${infoOpen ? styles.open : ""}`}>
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
          <div className={styles.hoursContainer}>
            <h3>Opening Hours</h3>
            {opening_hours.map((hour, index) => {
              const splitHours = hour.split(': ', 2);
              return (
                <div key={index} className={styles.hoursRow}>
                  <div className={styles.day}>{splitHours[0]}:</div>
                  <div className={styles.hours}>{splitHours[1]}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.directions}>
         <div className={styles.directionText}>Directions</div>
          <button className={`${styles.directionButton} ${styles.googleButton}`} onClick={handleDirection}>
            <div className={styles.iconWrapper}>
              <FontAwesomeIcon icon={faG} alt="Google Maps Logo" />
            </div>
          </button>
          <button className={`${styles.directionButton} ${styles.kakaoButton}`} onClick={handleKakaoDirection}>
            <div className={styles.iconWrapper}>
              <FontAwesomeIcon icon={faK} alt="Kakao Logo" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marker;