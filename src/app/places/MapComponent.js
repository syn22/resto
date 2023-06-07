import React from 'react';

const MapComponent = ({ selectedPlace, handleAddPlace, plans, selectedPlan, onSelectPlan }) => {

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
        <img 
          src={selectedPlace.photos[0].getUrl()} 
          alt={selectedPlace.name} 
          width={300}  // You should provide width and height attributes
          height={200} 
        />}
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
