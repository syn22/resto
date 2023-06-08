export const getUserLocation = (setUserLocation, setMapCenter) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(location);
      if (setMapCenter) setMapCenter(location);
    });
  } else {
    console.error("Geolocation is not supported by this browser");
  }
};

export const setMapViewport = (map, maps, setMapCenter, setMapZoom, setMapKey) => (bounds) => {
  if(map && maps){
    map.fitBounds(bounds);
    const newZoom = map.getZoom();
    const newCenter = map.getCenter();

    setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
    setMapZoom(newZoom);
    setMapKey(prevKey => prevKey + 1);
  }
};

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
