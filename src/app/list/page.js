'use client'
import React from 'react';
import OutletsList from './list';

function Restaurant() {
  const locations = [
    // Replace with your list of outlets or locations
    {
      id: 1,
      name: 'Outlet 1',
      latitude: 100.1,
      longitude: 50.1,
      address: 'Outlet 1 Address',
      countryId: 123,
    },
    {
      id: 2,
      name: 'Outlet 2',
      latitude: 100.0,
      longitude: 50.0,
      address: 'Outlet 2 Address',
      countryId: 456,
    },
  ];

  return (
    <div>
      <OutletsList locations={locations} />
    </div>
  );
}

export default Restaurant;
