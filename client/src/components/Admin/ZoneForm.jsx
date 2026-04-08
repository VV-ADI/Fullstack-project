import { useState, useEffect } from 'react';
import { useZones } from '../../context/ZoneContext';

const ZoneForm = ({ zone, onClose }) => {
  const { createZone, updateZone } = useZones();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    zoneName: '',
    lat: '',
    lng: '',
    radius: '',
    severityLevel: 'Low'
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        zoneName: zone.zoneName,
        lat: zone.locationCoordinates.lat,
        lng: zone.locationCoordinates.lng,
        radius: zone.radius,
        severityLevel: zone.severityLevel
      });
    }
  }, [zone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const zoneData = {
      zoneName: formData.zoneName,
      locationCoordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      radius: parseFloat(formData.radius),
      severityLevel: formData.severityLevel
    };

    let result;
    if (zone) {
      result = await updateZone(zone._id, zoneData);
    } else {
      result = await createZone(zoneData);
    }

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="border-b border-outline px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-black uppercase tracking-tight">
            {zone ? 'Edit Zone' : 'Add New Zone'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-zone-critical/10 border-l-4 border-zone-critical text-zone-critical px-4 py-3 animate-slide-up">
              {error}
            </div>
          )}
          
          {/* Zone Name */}
          <div className="space-y-1">
            <label className="label" htmlFor="zoneName">Zone Designation</label>
            <input
              type="text"
              id="zoneName"
              name="zoneName"
              value={formData.zoneName}
              onChange={handleChange}
              required
              className="uber-input"
              placeholder="e.g., Downtown Sector A"
            />
          </div>
          
          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label" htmlFor="lat">Latitude</label>
              <input
                type="number"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                required
                step="any"
                className="uber-input"
                placeholder="28.6139"
              />
            </div>
            <div className="space-y-1">
              <label className="label" htmlFor="lng">Longitude</label>
              <input
                type="number"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                required
                step="any"
                className="uber-input"
                placeholder="77.2090"
              />
            </div>
          </div>
          
          {/* Radius */}
          <div className="space-y-1">
            <label className="label" htmlFor="radius">Containment Radius (meters)</label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              required
              min="1"
              className="uber-input"
              placeholder="500"
            />
          </div>
          
          {/* Severity Level */}
          <div className="space-y-3">
            <label className="label">Severity Level</label>
            <div className="grid grid-cols-4 gap-px border border-black">
              {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severityLevel: level }))}
                  className={`py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    formData.severityLevel === level 
                      ? level === 'Critical' ? 'bg-zone-critical text-white' :
                        level === 'High' ? 'bg-zone-high text-white' :
                        level === 'Medium' ? 'bg-zone-medium text-black' :
                        'bg-zone-low text-white'
                      : 'bg-white text-black hover:bg-surface-variant'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (zone ? 'Update Zone' : 'Create Zone')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZoneForm;
