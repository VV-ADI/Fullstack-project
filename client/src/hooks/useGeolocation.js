import { useState, useEffect, useCallback } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSuccess = useCallback((position) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    setLoading(false);
    setError(null);
  }, []);

  const onError = useCallback((error) => {
    setError(error.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    // Watch position for real-time updates
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onSuccess, onError]);

  return { 
    lat: location.lat, 
    lng: location.lng, 
    error, 
    loading 
  };
};

export default useGeolocation;
