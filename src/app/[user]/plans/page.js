'use client'
import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import LocationDot from "./LocationDot";
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation'
import { getUserLocation } from './mapUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

const PlanPage = ({ params }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewport, setViewport] = useState({lat: 59.955413, lng: 30.337844, zoom: 10});
  const [userLocation, setUserLocation] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const searchParams = useSearchParams();
  const planName = searchParams.get('plan_name') ? decodeURIComponent(searchParams.get('plan_name')) : null;

  const handleShareClick = async () => {
    const shareUrl = `${window.location.protocol}//${window.location.host}/${params.user}/plans?plan_name=${encodeURIComponent(selectedPlan.plan_name)}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Plan link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy plan link: ', err);
      }
    }
  };

  const handleSelect = (placeId) => {
    setSelectedPlaceId(placeId);
  };

  useEffect(() => {
    getUserLocation(setUserLocation);
  }, []);

  const getZoomForLatLngBounds = (bounds, mapDim) => {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    function latRad(lat) {
      const sin = Math.sin(lat * Math.PI / 180);
      const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    const latFraction = (latRad(bounds.ne.lat) - latRad(bounds.sw.lat)) / Math.PI;

    const lngDiff = bounds.ne.lng - bounds.sw.lng;
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/plans?username=${params.user}`)
      .then((response) => response.json())
      .then((data) => {
        setPlans(data);
        // If a plan name was given in the query parameter, select it
        if(planName) {
          const planToSelect = data.find(plan => plan.plan_name === planName);
          if(planToSelect) {
            handlePlanClick(planToSelect);
          }
        }
      });
  }, []);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);

    const latAvg = plan.places.reduce((sum, place) => sum + place.latitude, 0) / plan.places.length;
    const lngAvg = plan.places.reduce((sum, place) => sum + place.longitude, 0) / plan.places.length;
    const latMax = Math.max(...plan.places.map(place => place.latitude));
    const latMin = Math.min(...plan.places.map(place => place.latitude));
    const lngMax = Math.max(...plan.places.map(place => place.longitude));
    const lngMin = Math.min(...plan.places.map(place => place.longitude));

    const bounds = {
      ne: { lat: latMax, lng: lngMax },
      sw: { lat: latMin, lng: lngMin }
    };
    const mapDim = { height: 500, width: 500 }; // Set this to your map dimension in pixels

    const zoom = getZoomForLatLngBounds(bounds, mapDim);

    setViewport({lat: latAvg, lng: lngAvg, zoom: zoom});
  };

  return (
    <div className={styles.container} style={{ background: 'none', margin: 0, width: '100%', display: 'flex' }}>

    <div className={styles["plan-section"]}>
      <h1>You have {plans.length} plan{plans.length !== 1 && 's'}</h1>

      <div className={styles["plans-list"]}>
        {plans.map((plan, index) => (
          <div key={index} onClick={() => { 
            if (selectedPlan?.plan_id === plan.plan_id) {
              setSelectedPlan(null); 
            } else { 
              handlePlanClick(plan);
            }
          }} className={styles["plan-item"]}>
            <p>{plan.plan_name} ({plan.places.length} place{plan.places.length !== 1 && 's'})</p>
          </div>
        ))}
        </div>
      </div>

    {selectedPlan && (
        <div className={styles["map-container"]}>
              <button 
                className={styles.shareButton}
                onClick={handleShareClick}
              >
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
            <GoogleMapReact
            bootstrapURLKeys={{ 
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
                libraries: ['places']
            }}
            center={viewport}
            zoom={viewport.zoom}
            yesIWantToUseGoogleMapApiInternals
            >
            {selectedPlan.places.map((place, index) => (
              <Marker
                key={index}
                lat={place.latitude}
                lng={place.longitude}
                text={place.place_name}
                placeId={place.place_id}
                type={place.place_type}
                types={place.types}
                photo_url={place.photo_url}
                opening_hours={place.opening_hours}
                selectedPlaceId={selectedPlaceId}
                onSelect={handleSelect}
              />
            ))}
            {userLocation && <LocationDot lat={userLocation.lat} lng={userLocation.lng}/>}
            </GoogleMapReact>
        </div>
        )}
    </div>
  );
}

export default PlanPage;
