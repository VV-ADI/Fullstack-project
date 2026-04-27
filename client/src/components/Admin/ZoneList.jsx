import { useState } from 'react';
import { useZones } from '../../context/ZoneContext';

const ZoneList = ({ zones, onEdit }) => {
  const { deleteZone } = useZones();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (zoneId) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      setDeletingId(zoneId);
      await deleteZone(zoneId);
      setDeletingId(null);
    }
  };

  const getZoneType = (zone) => {
    if (zone.boundary && zone.boundary.length > 2) {
      return { label: 'Polygon', icon: '◆' };
    }
    return { label: 'Circle', icon: '○' };
  };

  if (zones.length === 0) {
    return (
      <div className="uber-panel-subtle p-16 text-center">
        <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-black mb-2">No Zones Created</h2>
        <p className="text-on-surface-variant">
          Click "Draw on Map" or "Add Zone" to create your first containment zone.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline">
            <th className="px-4 py-4 text-left label">Zone ID</th>
            <th className="px-4 py-4 text-left label">Designation</th>
            <th className="px-4 py-4 text-left label">Type</th>
            <th className="px-4 py-4 text-left label">Severity</th>
            <th className="px-4 py-4 text-left label">Coordinates</th>
            <th className="px-4 py-4 text-left label">Size</th>
            <th className="px-4 py-4 text-right label">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline">
          {zones.map((zone) => {
            const zoneType = getZoneType(zone);
            return (
              <tr key={zone._id} className="hover:bg-surface-variant transition-colors group">
                <td className="px-4 py-4">
                  <span className="mono text-xs font-bold text-black">
                    {zone._id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-bold text-sm text-black">
                    {zone.zoneName}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="mono text-xs text-on-surface-variant">
                    {zoneType.icon} {zoneType.label}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`badge ${
                    zone.severityLevel === 'Critical' ? 'badge-critical' :
                    zone.severityLevel === 'High' ? 'badge-high' :
                    zone.severityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {zone.severityLevel}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="mono text-[10px] text-on-surface-variant">
                    {zone.locationCoordinates.lat.toFixed(4)}° N, {zone.locationCoordinates.lng.toFixed(4)}° W
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium">
                    {zoneType.label === 'Circle' 
                      ? `${zone.radius}m` 
                      : `${zone.boundary.length} pts`
                    }
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(zone)}
                      className="p-2 hover:bg-black hover:text-white text-on-surface-variant transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(zone._id)}
                      disabled={deletingId === zone._id}
                      className="p-2 hover:bg-zone-critical hover:text-white text-on-surface-variant transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === zone._id ? (
                        <div className="w-4 h-4 border border-current border-t-transparent animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneList;
