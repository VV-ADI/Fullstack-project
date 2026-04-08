import { Circle, Polygon, Popup } from 'react-leaflet';

// Severity color mapping - Uber monochrome style with opacity variations
const severityColors = {
  Low: { color: '#05a357', fillOpacity: 0.15 },
  Medium: { color: '#ffc043', fillOpacity: 0.2 },
  High: { color: '#ff6900', fillOpacity: 0.25 },
  Critical: { color: '#e11900', fillOpacity: 0.3 }
};

const ZoneLayer = ({ zones, insideZones = [] }) => {
  const isInside = (zoneId) => {
    return insideZones.some(z => z._id === zoneId);
  };

  return (
    <>
      {zones.map((zone) => {
        const colorConfig = severityColors[zone.severityLevel] || severityColors.Low;
        const inside = isInside(zone._id);
        
        const pathOptions = {
          color: inside ? '#e11900' : colorConfig.color,
          fillColor: colorConfig.color,
          fillOpacity: inside ? 0.4 : colorConfig.fillOpacity,
          weight: inside ? 3 : 2,
          dashArray: inside ? '8, 8' : undefined,
        };

        // Popup content
        const popupContent = (
          <div className="p-3 min-w-[200px]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-sm uppercase tracking-wide">{zone.zoneName}</h3>
              <span className={`badge ${
                zone.severityLevel === 'Critical' ? 'badge-critical' :
                zone.severityLevel === 'High' ? 'badge-high' :
                zone.severityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                {zone.severityLevel}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Radius</span>
                <span className="font-bold">{zone.radius}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Updated</span>
                <span className="font-bold">{new Date(zone.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            {inside && (
              <div className="mt-3 p-2 bg-zone-critical/10 border-l-2 border-zone-critical">
                <p className="text-zone-critical font-bold text-xs uppercase">
                  You are inside this zone
                </p>
              </div>
            )}
          </div>
        );
        
        // Polygon zone
        if (zone.boundary && zone.boundary.length > 2) {
          return (
            <Polygon
              key={zone._id}
              positions={zone.boundary}
              pathOptions={pathOptions}
            >
              <Popup>{popupContent}</Popup>
            </Polygon>
          );
        }
        
        // Circle zone (default)
        return (
          <Circle
            key={zone._id}
            center={[zone.locationCoordinates.lat, zone.locationCoordinates.lng]}
            radius={zone.radius}
            pathOptions={pathOptions}
          >
            <Popup>{popupContent}</Popup>
          </Circle>
        );
      })}
    </>
  );
};

export default ZoneLayer;
