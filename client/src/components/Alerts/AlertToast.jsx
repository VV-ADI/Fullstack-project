import { toast } from 'react-toastify';

// Severity color mapping
const severityColors = {
  Low: '#00C853',
  Medium: '#FFD600',
  High: '#FF6D00',
  Critical: '#D50000'
};

const severityEmojis = {
  Low: '🟢',
  Medium: '🟡',
  High: '🟠',
  Critical: '🔴'
};

export const showProximityToast = (zone) => {
  toast.warning(
    <div>
      <strong>{severityEmojis[zone.severityLevel]} Approaching Zone</strong>
      <p className="text-sm mt-1">{zone.zoneName}</p>
      <p className="text-xs mt-1">Severity: {zone.severityLevel}</p>
    </div>,
    {
      position: 'bottom-right',
      autoClose: 5000,
      style: {
        borderLeft: `4px solid ${severityColors[zone.severityLevel]}`
      }
    }
  );
};

export const showEntryToast = (zone) => {
  toast.error(
    <div>
      <strong>⚠️ ZONE ENTRY WARNING</strong>
      <p className="text-sm mt-1">You have entered: {zone.zoneName}</p>
      <p className="text-xs mt-1">Please evacuate immediately!</p>
    </div>,
    {
      position: 'bottom-right',
      autoClose: false,
      style: {
        borderLeft: `4px solid ${severityColors.Critical}`
      }
    }
  );
};

// This component isn't rendered - it just exports utility functions
const AlertToast = null;

export default AlertToast;
