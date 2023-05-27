'use client'
import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { getDistance } from 'geolib';
import locationsData from './locations.json'; // Import from JSON file

const AnyReactComponent = ({ text }) => <div>{text}</div>;

AnyReactComponent.defaultProps = {
  lat: 0,
  lng: 0,
  text: 'default',
};

const OutletsList = () => { 
    const calculateDistance = (location) => {
        if (!location || !location.lat || !location.lng) {
            console.error("Invalid location data: ", location);
            return 'Location data not available';
        }
        
        const outletLatLong = {
            latitude: location.lat,
            longitude: location.lng,
        };

        const userLatLong = {
            latitude: 100.000, // Replace with user's latitude
            longitude: 50.000, // Replace with user's longitude
        };

        const distanceInMeter = getDistance(outletLatLong, userLatLong);
        
        if (distanceInMeter < 1000) {
            return `${(distanceInMeter / 1000).toFixed(2)} KM`;
        } else {
            return `${(distanceInMeter / 1000).toFixed()} KM`;
        }
    };

    const center = {
        lat: 100.000, // Replace with user's latitude
        lng: 50.000, // Replace with user's longitude
    };

    return (
        <div>
            <div>
                {/* Search input field */}
                <input type="text" placeholder="Search" />

                {/* User location button */}
                <button>
                    <FontAwesomeIcon icon={faLocation} />
                    Use Current Location
                </button>
            </div>

            <div>
                {locationsData.map((location, index) => {
                    if (!location || !location.lat || !location.lng) {
                        console.error("Invalid location data: ", location);
                        return null;
                    }
                    return (
                        <div key={index}>
                            <div>
                                {/* Outlet name */}
                                {location.name} - {location.type}
                            </div>
                            <div>
                                {/* Outlet distance */}
                                {calculateDistance(location)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Google Map */}
            <div style={{ height: '500px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
                    defaultCenter={center}
                    defaultZoom={8}
                >
                    {locationsData.map((location, index) => {
                        if (!location || !location.lat || !location.lng) {
                            console.error("Invalid location data: ", location);
                            return null;
                        }
                        return (
                            <AnyReactComponent
                                key={index}
                                lat={location.lat}
                                lng={location.lng}
                                text={location.name}
                            />
                        );
                    })}
                </GoogleMapReact>
            </div>
        </div>
    );
};

OutletsList.propTypes = {
    locationsData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default OutletsList;