'use client'
import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import LocationDot from "./LocationDot";
import styles from './page.module.css';
import { getUserLocation } from './mapUtils';
import { createPlan } from './api';

const PlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewport, setViewport] = useState({lat: 59.955413, lng: 30.337844, zoom: 10});
  const [userLocation, setUserLocation] = useState(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);

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
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/plans?user_id=1`) 
      .then((response) => response.json())
      .then((data) => setPlans(data));
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

  const handleAddPlan = () => {
    createPlan({
      user_id: 1, // Set this according to your requirements
      name: newPlanName,
      is_public: isPublic, // New field for public status
    }).then((newPlan) => {
      setPlans([...plans, newPlan]);
      setIsAddPlanModalOpen(false);
      setNewPlanName(''); // Reset the plan name
      setIsPublic(false); // Reset the public checkbox
    });
  };

  const removePlace = (planId, placeId) => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/plans/${planId}/places/${placeId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response here. For example, remove the place from the state:
      setPlans(plans.map(plan => {
        if (plan.plan_id === planId) {
          return {...plan, places: plan.places.filter(place => place.place_id !== placeId)};
        }
        return plan;
      }));
    });
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

        <button 
          className={styles["add-plan-button"]} 
          onClick={() => setIsAddPlanModalOpen(true)}
        >
          Add New Plan
        </button>

        {isAddPlanModalOpen && (
        <div 
          className={styles["modal"] + ' ' + (isAddPlanModalOpen ? '' : styles['modal-close'])}
          onAnimationEnd={() => {if (!isAddPlanModalOpen) setNewPlanName('')}}
        >
          <h2>Add New Plan</h2>
          <input 
            className={styles["plan-name-input"]} 
            type="text" 
            placeholder="Plan name" 
            value={newPlanName} 
            onChange={e => setNewPlanName(e.target.value)}
          />
            <label>
            Public:
            <input 
                type="checkbox" 
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
            />
            </label>
            <div className={styles.modalButtons}>
            <button onClick={handleAddPlan} className={styles.confirmButton}>Confirm</button>
            <button onClick={() => setIsAddPlanModalOpen(false)} className={styles.cancelButton}>Cancel</button>
            </div>
        </div>
        )}
      </div>

    {selectedPlan && (
        <div className={styles["map-container"]}>
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
                removePlace={() => removePlace(selectedPlan.plan_id, place.place_id)}
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
