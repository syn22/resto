import React, { useState } from 'react';

const MapComponent = ({ selectedPlace, handleAddPlace, plans, selectedPlan, onSelectPlan }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    // If the selected place has more images, go to the next one. 
    // Otherwise, go back to the first one.
    if (selectedPlace.photos && currentImageIndex < selectedPlace.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePlanChange = (event) => {
    onSelectPlan(event.target.value);
  };

  return (
    selectedPlace && (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          color: 'black',
        }}
      >
        <h2>{selectedPlace.name}</h2>
        <p>{selectedPlace.formatted_address}</p>
        {selectedPlace.photos && 
          <div>
            <img 
              src={selectedPlace.photos[currentImageIndex].getUrl()} 
              alt={selectedPlace.name} 
              width={300}  
              height={200} 
            />
            <button onClick={handleNextImage}>Next Image</button>
          </div>
        }
        <br />
        <select value={selectedPlan} onChange={handlePlanChange}>
          {plans.map(plan => (
            <option value={plan.plan_id} key={plan.plan_id}>{plan.plan_name}</option>
          ))}
        </select>
        <br />
        <button onClick={handleAddPlace}>Add to my plan</button>
        <br />
        <br />
        <button>Placeholder</button>
      </div>
    )
  );
}

export default MapComponent;