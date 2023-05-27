import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocation, faLocationArrow, faSearch, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { getDistance } from 'geolib';
import clsx from 'clsx';

const OutletsList = ({
  activeOutletId,
  outlets,
  onClickOutlet,
  onDirectionClicked,
  onChangeSearch,
  mapCenter,
  setMapCenter,
  locationName,
  screenWidth,
  searchValue,
}) => {
  const listRef = useRef(null);

  const handleUserPosition = (position) => {
    const { latitude, longitude } = position.coords;
    setMapCenter({
      lat: latitude,
      lng: longitude,
    });
  };

  const handleLocationPermissionRejected = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.');
        break;
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleUserPosition, handleLocationPermissionRejected);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  const calculateDistance = (outlet) => {
    const outletLatLong = {
      latitude: outlet.latitude,
      longitude: outlet.longitude,
    };
    const userLatLong = {
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
    };
    const distanceInMeter = getDistance(outletLatLong, userLatLong);

    if (distanceInMeter < 1000) return (distanceInMeter / 1000).toFixed(2);
    else return (distanceInMeter / 1000).toFixed();
  };

  useEffect(() => {
    if (activeOutletId) {
      const outletIndex = outlets.findIndex((e) => e.id === activeOutletId);
      let offsetScroll = screenWidth === 'mobile' ? 380 : 144;
      if (locationName?.length) offsetScroll += 16; // Add additional offset due to size changing on GPS button when using user GPS location
      listRef.current.scrollTo(0, listRef.current?.children?.[outletIndex]?.offsetTop - offsetScroll);
    }
  }, [activeOutletId]);

  useEffect(() => {
    // Reset outlet list scroll when mapCenter changed
    listRef.current.scrollTo(0, 0);
  }, [mapCenter]);

  return (
    <div className="OutletsList">
      <div className="OutletsList__TopSection">
        <div className="OutletsList__TopSection__Search">
          <div className="OutletsList__TopSection__Search__IconWrapper">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input
            value={searchValue}
            name="fullName"
            placeholder="Search"
            onChange={(e) => onChangeSearch(e.target.value)}
          />
          {searchValue.length ? (
            <div onClick={() => onChangeSearch('')} className="OutletsList__TopSection__Search__ClearIcon">
              <FontAwesomeIcon icon={faTimes} />
            </div>
          ) : null}
        </div>
        <div onClick={getUserLocation} className="OutletsList__GPSLocationBtn">
          <div className="OutletsList__GPSLocationBtn__IconWrapper">
            <FontAwesomeIcon icon={faLocation} />
          </div>
          <div className="OutletsList__GPSLocationBtn__LocationWrapper">
            <p className="OutletsList__GPSLocationBtn__Title">Use Current Location</p>
            <p className="OutletsList__GPSLocationBtn__Subtitle">{locationName}</p>
          </div>
        </div>
      </div>
      <div className="outlets_lists" ref={listRef}>
        {outlets.length ? (
          outlets.map((outlet, i) => (
            <div
              key={outlet.id}
              className={clsx(
                'outlet_entry_wrapper',
                activeOutletId === outlet.id && 'outlet_entry_wrapper--active'
              )}
            >
              <div className="outlet_entry" onClick={() => onClickOutlet(outlet)}>
                <div className="outlet_entry_detail">
                  <div className="outlet_entry_name">
                    {outlet.name} - {outlet.city}
                  </div>
                  <div className="outlet_entry_address">{outlet.fullAddress}</div>
                  <div
                    className={clsx(
                      'outlet_entry_distance',
                      calculateDistance(outlet) <= 1 && 'outlet_entry_distance--near',
                      calculateDistance(outlet) >= 17 && 'outlet_entry_distance--far'
                    )}
                  >
                    {`${calculateDistance(outlet)} KM`}
                  </div>
                </div>
                <div
                  className="outlet_entry_icon_container"
                  onClick={() => onDirectionClicked(outlet.id)}
                >
                  <FontAwesomeIcon icon={faLocationArrow} className="outlet_entry_icon" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="Outlet__NotFound">
            <div className="Outlet__NotFound__Title">Outlet Not Found</div>
            <div className="Outlet__NotFound__Description">No outlets available</div>
          </div>
        )}
      </div>
    </div>
  );
};

OutletsList.propTypes = {
  activeOutletId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  outlets: PropTypes.array,
  onClickOutlet: PropTypes.func,
  onDirectionClicked: PropTypes.func,
  onChangeSearch: PropTypes.func,
  mapCenter: PropTypes.object,
  setMapCenter: PropTypes.func,
  locationName: PropTypes.string,
  screenWidth: PropTypes.string,
  searchValue: PropTypes.string,
};

export default OutletsList;
