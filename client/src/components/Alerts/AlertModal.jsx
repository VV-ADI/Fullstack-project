import { useZones } from '../../context/ZoneContext';

const AlertModal = ({ isOpen, zone, onClose }) => {
  const { dismissAlert, alerts } = useZones();

  if (!isOpen || !zone) return null;

  const handleDismiss = async () => {
    const activeAlert = alerts.find(
      a => a.zoneId?._id === zone._id && a.status === 'Active'
    );
    
    if (activeAlert) {
      await dismissAlert(activeAlert._id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md animate-slide-up shadow-2xl">
        {/* Header - Severity colored */}
        <div className={`p-6 ${
          zone.severityLevel === 'Critical' ? 'bg-zone-critical' :
          zone.severityLevel === 'High' ? 'bg-zone-high' :
          zone.severityLevel === 'Medium' ? 'bg-zone-medium' : 'bg-zone-low'
        } ${zone.severityLevel === 'Medium' ? 'text-black' : 'text-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide">Zone Alert</h2>
                <p className="text-sm opacity-80">{zone.severityLevel} Severity</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-black uppercase tracking-tight">{zone.zoneName}</h3>
          </div>
          
          {/* Warning Message */}
          <div className="bg-zone-critical/5 border-l-4 border-zone-critical p-4 mb-6">
            <p className="text-zone-critical font-bold text-sm">
              You have entered a restricted containment zone.
            </p>
            <p className="text-zone-critical/80 text-sm mt-1">
              Please move to a safe area immediately.
            </p>
          </div>
          
          {/* Zone Details */}
          <div className="space-y-3 border-t border-outline pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-on-surface-variant text-sm">Zone Name</span>
              <span className="font-bold text-sm">{zone.zoneName}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-on-surface-variant text-sm">Severity Level</span>
              <span className={`badge ${
                zone.severityLevel === 'Critical' ? 'badge-critical' :
                zone.severityLevel === 'High' ? 'badge-high' :
                zone.severityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                {zone.severityLevel}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-on-surface-variant text-sm">Last Updated</span>
              <span className="mono text-xs">{new Date(zone.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-outline p-4 flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-3 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-surface-variant transition-colors"
          >
            Dismiss Alert
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
