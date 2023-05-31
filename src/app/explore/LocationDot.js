import React from 'react';

const LocationDot = ({ lat, lng }) => (
  <div style={{ width: 20, height: 20, backgroundColor: 'blue', borderRadius: '50%', position: 'relative' }}>
    <div style={{ 
        position: 'absolute', 
        top: -40, 
        left: '-50%',
        transform: 'translateX(-50%)',
        color: 'white', 
        fontWeight: 'bold', 
        backgroundColor: 'green', 
        padding: '5px 10px',
        borderRadius: '15px',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
        animation: 'pulse 1.5s infinite',
        textAlign: 'center'
      }}>
      You are here
    </div>
    <style jsx>{`
      @keyframes pulse {
        0% {
          transform: translateX(-50%) scale(1);
        }
        50% {
          transform: translateX(-50%) scale(1.1);
        }
        100% {
          transform: translateX(-50%) scale(1);
        }
      }
    `}</style>
  </div>
);

export default LocationDot;
