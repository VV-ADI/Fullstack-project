import { useState, useEffect, useCallback, useRef } from 'react';
import { haversineDistance } from '../utils/haversine';

const useProximityCheck = (userLocation, zones, onProximityAlert, onEntryAlert) => {
  const [nearbyZones, setNearbyZones] = useState([]);
  const [insideZones, setInsideZones] = useState([]);
  const alertedZonesRef = useRef(new Set());
  const enteredZonesRef = useRef(new Set());

  const checkProximity = useCallback(() => {
    if (!userLocation.lat || !userLocation.lng || !zones.length) {
      return;
    }

    const nearby = [];
    const inside = [];

    zones.forEach((zone) => {
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        zone.locationCoordinates.lat,
        zone.locationCoordinates.lng
      );

      const bufferDistance = zone.radius + 200; // 200m buffer

      // Check if inside zone
      if (distance <= zone.radius) {
        inside.push({ ...zone, distance });
        
        // Trigger entry alert if not already alerted
        if (!enteredZonesRef.current.has(zone._id)) {
          enteredZonesRef.current.add(zone._id);
          if (onEntryAlert) {
            onEntryAlert(zone);
          }
        }
      }
      // Check if within proximity buffer
      else if (distance <= bufferDistance) {
        nearby.push({ ...zone, distance });
        
        // Trigger proximity alert if not already alerted
        if (!alertedZonesRef.current.has(zone._id)) {
          alertedZonesRef.current.add(zone._id);
          if (onProximityAlert) {
            onProximityAlert(zone);
          }
        }
      }
      // User has left the zone area - reset alerts for this zone
      else {
        if (alertedZonesRef.current.has(zone._id)) {
          alertedZonesRef.current.delete(zone._id);
        }
        if (enteredZonesRef.current.has(zone._id)) {
          enteredZonesRef.current.delete(zone._id);
        }
      }
    });

    setNearbyZones(nearby);
    setInsideZones(inside);
  }, [userLocation, zones, onProximityAlert, onEntryAlert]);

  useEffect(() => {
    checkProximity();
  }, [checkProximity]);

  return { nearbyZones, insideZones };
};

export default useProximityCheck;
