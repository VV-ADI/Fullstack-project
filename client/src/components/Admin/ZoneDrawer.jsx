import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Circle, Polygon, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Severity color mapping - Uber style
const severityColors = {
  Low: '#05a357',
  Medium: '#ffc043',
  High: '#ff6900',
  Critical: '#e11900'
};

const ZoneDrawer = ({ onZoneCreated, existingZones = [], onClose }) => {
  const [drawnZone, setDrawnZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [severityLevel, setSeverityLevel] = useState('Low');

  // Handle shape creation
  const handleCreated = useCallback((e) => {
    const { layerType, layer } = e;
    
    if (layerType === 'circle') {
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      setDrawnZone({
        type: 'circle',
        locationCoordinates: {
          lat: center.lat,
          lng: center.lng
        },
        radius: Math.round(radius),
        boundary: []
      });
    } else if (layerType === 'polygon' || layerType === 'rectangle') {
      const latlngs = layer.getLatLngs()[0];
      const boundary = latlngs.map(ll => [ll.lat, ll.lng]);
      
      const latSum = latlngs.reduce((sum, ll) => sum + ll.lat, 0);
      const lngSum = latlngs.reduce((sum, ll) => sum + ll.lng, 0);
      
      setDrawnZone({
        type: 'polygon',
        locationCoordinates: {
          lat: latSum / latlngs.length,
          lng: lngSum / latlngs.length
        },
        radius: 0,
        boundary: boundary
      });
    }
  }, []);

  // Handle shape deletion
  const handleDeleted = useCallback(() => {
    setDrawnZone(null);
    setZoneName('');
    setSeverityLevel('Low');
  }, []);

  // Save the zone
  const handleSave = () => {
    if (!drawnZone || !zoneName.trim()) {
      alert('Please draw a zone and enter a name');
      return;
    }

    const zoneData = {
      zoneName: zoneName.trim(),
      locationCoordinates: drawnZone.locationCoordinates,
      radius: drawnZone.radius || 100,
      boundary: drawnZone.boundary,
      severityLevel
    };

    onZoneCreated(zoneData);
  };

  const defaultCenter = [20.5937, 78.9629];

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* Map Section */}
      <div className="flex-1 relative">
        <MapContainer
          center={defaultCenter}
          zoom={5}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Existing zones */}
          {existingZones.map((zone) => {
            const color = severityColors[zone.severityLevel] || '#05a357';
            
            if (zone.boundary && zone.boundary.length > 2) {
              return (
                <Polygon
                  key={zone._id}
                  positions={zone.boundary}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                >
                  <Popup>{zone.zoneName}</Popup>
                </Polygon>
              );
            }
            
            return (
              <Circle
                key={zone._id}
                center={[zone.locationCoordinates.lat, zone.locationCoordinates.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup>{zone.zoneName}</Popup>
              </Circle>
            );
          })}
          
          {/* Drawing controls */}
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onDeleted={handleDeleted}
              draw={{
                rectangle: true,
                polygon: true,
                circle: true,
                polyline: false,
                marker: false,
                circlemarker: false
              }}
            />
          </FeatureGroup>
        </MapContainer>
        
        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-[1000] uber-panel px-6 py-3 flex items-center gap-3 hover:bg-black hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-bold text-sm uppercase tracking-wider">Back</span>
        </button>
        
        {/* Instructions */}
        <div className="absolute bottom-6 left-6 z-[1000] uber-panel p-6 max-w-xs">
          <h4 className="font-bold text-black text-xs uppercase tracking-widest mb-4">Instructions</h4>
          <ul className="text-sm text-on-surface-variant space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-surface-variant flex items-center justify-center flex-shrink-0 mt-0.5">○</span>
              <span>Use <strong>circle</strong> for circular zones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-surface-variant flex items-center justify-center flex-shrink-0 mt-0.5">◇</span>
              <span>Use <strong>polygon</strong> for custom shapes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-surface-variant flex items-center justify-center flex-shrink-0 mt-0.5">□</span>
              <span>Use <strong>rectangle</strong> for rectangular areas</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Form Panel */}
      <div className="w-[400px] bg-white border-l border-black flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-outline">
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">Create Zone</h2>
          <p className="text-on-surface-variant text-sm mt-1">Draw on map, then configure</p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!drawnZone ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-surface-variant flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-on-surface-variant font-medium">
                Use the drawing tools on the map to create a zone boundary
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Zone Preview */}
              <div className="border-t-4 border-black pt-4">
                <h4 className="label mb-4">Zone Preview</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-outline">
                    <span className="text-on-surface-variant">Type</span>
                    <span className="font-bold">{drawnZone.type === 'circle' ? 'Circle' : 'Polygon'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-outline">
                    <span className="text-on-surface-variant">Center</span>
                    <span className="mono text-xs">{drawnZone.locationCoordinates.lat.toFixed(4)}°, {drawnZone.locationCoordinates.lng.toFixed(4)}°</span>
                  </div>
                  {drawnZone.type === 'circle' && (
                    <div className="flex justify-between items-center py-2 border-b border-outline">
                      <span className="text-on-surface-variant">Radius</span>
                      <span className="font-bold">{drawnZone.radius}m</span>
                    </div>
                  )}
                  {drawnZone.boundary.length > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-outline">
                      <span className="text-on-surface-variant">Points</span>
                      <span className="font-bold">{drawnZone.boundary.length}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zone Name */}
              <div className="space-y-1">
                <label className="label" htmlFor="zoneName">Zone Designation</label>
                <input
                  type="text"
                  id="zoneName"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="uber-input"
                  placeholder="e.g., Downtown Sector A"
                />
              </div>
              
              {/* Severity Level */}
              <div className="space-y-3">
                <label className="label">Severity Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(severityColors).map(([level, color]) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverityLevel(level)}
                      className={`p-4 border-2 transition-all flex flex-col items-center gap-2 ${
                        severityLevel === level 
                          ? 'border-black' 
                          : 'border-outline hover:border-black/30'
                      }`}
                    >
                      <div 
                        className="w-6 h-6"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Severity Legend */}
              <div className="bg-surface-variant p-4">
                <h4 className="label mb-3">Severity Guide</h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-zone-low flex-shrink-0" />
                    <span><strong>Low:</strong> Minimal risk areas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-zone-medium flex-shrink-0" />
                    <span><strong>Medium:</strong> Moderate caution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-zone-high flex-shrink-0" />
                    <span><strong>High:</strong> Avoid if possible</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-zone-critical flex-shrink-0" />
                    <span><strong>Critical:</strong> Do not enter</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {drawnZone && (
          <div className="p-6 border-t border-outline flex gap-3">
            <button
              onClick={handleDeleted}
              className="flex-1 px-4 py-3 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-surface-variant transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={!zoneName.trim()}
              className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Zone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneDrawer;
