import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import useGeolocation from '../../hooks/useGeolocation';
import useProximityCheck from '../../hooks/useProximityCheck';
import { useZones } from '../../context/ZoneContext';
import ZoneLayer from './ZoneLayer';
import UserMarker from './UserMarker';
import AlertModal from '../Alerts/AlertModal';

// Component to recenter map when location changes
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  if (lat && lng) {
    map.setView([lat, lng], map.getZoom());
  }
  return null;
};

// Map Controls Component
const MapControls = ({ onRecenter, lat, lng }) => {
  const map = useMap();
  
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleRecenter = () => {
    if (lat && lng) {
      map.setView([lat, lng], 16);
    }
  };

  return (
    <div className="absolute top-24 right-6 z-[1000] flex flex-col gap-px">
      <button 
        onClick={handleZoomIn}
        className="uber-panel w-12 h-12 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
        title="Zoom in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button 
        onClick={handleZoomOut}
        className="uber-panel w-12 h-12 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
        title="Zoom out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <button 
        onClick={handleRecenter}
        className="uber-panel w-12 h-12 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
        title="Center on my location"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
};

const MapView = () => {
  const { lat, lng, error: geoError, loading: geoLoading } = useGeolocation();
  const { zones, createAlert } = useZones();
  const [showModal, setShowModal] = useState(false);
  const [activeZone, setActiveZone] = useState(null);

  // Handle proximity alert (toast notification)
  const handleProximityAlert = useCallback((zone) => {
    toast.warning(
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-sm uppercase tracking-wide">Proximity Alert</p>
          <p className="text-xs mt-1 opacity-90">{zone.zoneName}</p>
          <p className="text-[10px] mt-1 opacity-70 uppercase">{zone.severityLevel} Severity</p>
        </div>
      </div>,
      {
        position: 'bottom-right',
        autoClose: 5000,
        icon: false
      }
    );
  }, []);

  // Handle entry alert (modal)
  const handleEntryAlert = useCallback(async (zone) => {
    setActiveZone(zone);
    setShowModal(true);
    
    // Log alert to database
    await createAlert(zone._id);
    
    toast.error(
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-sm uppercase tracking-wide">Zone Entry Warning</p>
          <p className="text-xs mt-1">You have entered {zone.zoneName}</p>
          <p className="text-[10px] mt-1 opacity-70 uppercase">Please evacuate immediately</p>
        </div>
      </div>,
      {
        position: 'bottom-right',
        autoClose: false,
        icon: false
      }
    );
  }, [createAlert]);

  // Use proximity check hook
  const { nearbyZones, insideZones } = useProximityCheck(
    { lat, lng },
    zones,
    handleProximityAlert,
    handleEntryAlert
  );

  // Calculate nearest zone distance
  const getNearestZoneDistance = () => {
    if (!lat || !lng || zones.length === 0) return null;
    
    let minDistance = Infinity;
    zones.forEach(zone => {
      const R = 6371000;
      const toRad = (val) => (val * Math.PI) / 180;
      const dLat = toRad(zone.locationCoordinates.lat - lat);
      const dLng = toRad(zone.locationCoordinates.lng - lng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(zone.locationCoordinates.lat)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c - zone.radius;
      if (distance < minDistance) minDistance = distance;
    });
    
    return Math.max(0, Math.round(minDistance));
  };

  const nearestDistance = getNearestZoneDistance();

  // Loading state
  if (geoLoading) {
    return (
      <div className="h-[calc(100vh-64px)] mt-16 flex items-center justify-center bg-surface-variant">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-2 border-black border-t-transparent animate-spin mx-auto" />
          <p className="mt-6 text-on-surface-variant mono text-xs uppercase tracking-widest">Acquiring Location...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (geoError) {
    return (
      <div className="h-[calc(100vh-64px)] mt-16 flex items-center justify-center bg-surface-variant">
        <div className="text-center uber-panel p-12 max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-zone-critical/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-zone-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">LOCATION REQUIRED</h2>
          <p className="text-on-surface-variant">
            {geoError === 'User denied Geolocation' 
              ? 'Please enable location permissions in your browser to use the containment monitoring system.'
              : geoError
            }
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-secondary mt-8"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const center = lat && lng ? [lat, lng] : [20.5937, 78.9629];

  return (
    <div className="h-[calc(100vh-64px)] mt-16 md:mb-0 mb-16 relative">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={15}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoneLayer zones={zones} insideZones={insideZones} />
        {lat && lng && <UserMarker lat={lat} lng={lng} />}
        {lat && lng && <MapRecenter lat={lat} lng={lng} />}
        <MapControls lat={lat} lng={lng} />
      </MapContainer>

      {/* Distance Banner */}
      {nearestDistance !== null && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] animate-slide-up">
          <div className={`uber-panel px-8 py-4 flex items-center gap-6 ${insideZones.length > 0 ? 'bg-zone-critical text-white border-zone-critical' : ''}`}>
            {insideZones.length > 0 ? (
              <>
                <svg className="w-6 h-6 animate-pulse-subtle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <div className="flex items-baseline gap-3">
                  <span className="font-black uppercase tracking-tight text-xs">INSIDE ZONE</span>
                  <span className="font-black text-2xl">{insideZones[0]?.zoneName}</span>
                </div>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div className="flex items-baseline gap-3">
                  <span className="font-black uppercase tracking-tight text-xs">NEAREST ZONE:</span>
                  <span className="font-black text-2xl">{nearestDistance}m</span>
                </div>
                <div className="h-6 w-[2px] bg-black" />
                <span className="mono text-[10px] uppercase tracking-wider">
                  {lat?.toFixed(4)}° N, {lng?.toFixed(4)}° W
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] animate-slide-up hidden md:block">
        <div className="uber-panel p-6 w-64">
          <h3 className="text-black font-black text-[10px] tracking-[0.2em] uppercase mb-6">SEVERITY LEVELS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline pb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-zone-critical pulse-zone" />
                <span className="text-xs font-bold uppercase">Critical</span>
              </div>
              <span className="mono text-[10px] text-zone-critical">L-04</span>
            </div>
            <div className="flex items-center justify-between border-b border-outline pb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-zone-high" />
                <span className="text-xs font-bold uppercase">High</span>
              </div>
              <span className="mono text-[10px] text-zone-high">L-03</span>
            </div>
            <div className="flex items-center justify-between border-b border-outline pb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-zone-medium" />
                <span className="text-xs font-bold uppercase">Medium</span>
              </div>
              <span className="mono text-[10px] text-zone-medium">L-02</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-zone-low" />
                <span className="text-xs font-bold uppercase text-on-surface-variant">Low</span>
              </div>
              <span className="mono text-[10px] text-zone-low">L-01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div className="absolute bottom-6 right-6 z-[1000] animate-slide-in-right hidden md:block">
        <div className="uber-panel p-6 w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-black font-black text-[10px] tracking-[0.2em] uppercase">STATUS</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success animate-pulse" />
              <span className="mono text-[10px] text-success uppercase">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-outline">
              <span className="text-xs text-on-surface-variant">Active Zones</span>
              <span className="text-sm font-bold">{zones.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline">
              <span className="text-xs text-on-surface-variant">Nearby Zones</span>
              <span className={`text-sm font-bold ${nearbyZones.length > 0 ? 'text-zone-medium' : ''}`}>
                {nearbyZones.length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-on-surface-variant">Inside Zones</span>
              <span className={`text-sm font-bold ${insideZones.length > 0 ? 'text-zone-critical' : ''}`}>
                {insideZones.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Alert Modal */}
      <AlertModal
        isOpen={showModal}
        zone={activeZone}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default MapView;
