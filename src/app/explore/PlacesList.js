import React from 'react';
import styles from './page.module.css'; 

function PlacesList({ places, onPlaceClick, selectedMarker }) {
    const getDirections = (place) => {
        const destination = encodeURIComponent(place.name); // Make sure to encode the address to be URL safe
        const url = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destination}`;
        window.open(url, "_blank");
    };

    return (
        <div>
            {places.map((place, index) => (
                <div 
                    key={index} 
                    onClick={() => onPlaceClick(index)}
                    className={`${styles.placesListItem} ${index === selectedMarker ? styles.active : ''}`}
                >
                    <h2>{place.name}</h2>
                    <p>{place.type}</p>
                    <p>{place.distance?.toFixed(2)} km away</p>
                    <button onClick={() => getDirections(place)}>Get Directions</button>
                </div>
            ))}
        </div>
    );
}

export default PlacesList;
