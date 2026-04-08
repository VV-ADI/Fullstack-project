import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Uber-style user marker icon
const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="
        position: absolute;
        width: 24px;
        height: 24px;
        background-color: #000000;
        transform: rotate(45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
      <div style="
        position: absolute;
        width: 48px;
        height: 48px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        top: -12px;
        left: -12px;
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.3); opacity: 0.1; }
        100% { transform: scale(1); opacity: 0.4; }
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const UserMarker = ({ lat, lng }) => {
  return (
    <Marker position={[lat, lng]} icon={userIcon}>
      <Popup className="uber-popup">
        <div className="p-2 text-center">
          <p className="font-bold text-sm uppercase tracking-wide">Your Location</p>
          <p className="mono text-[10px] text-on-surface-variant mt-1">
            {lat.toFixed(6)}° N, {lng.toFixed(6)}° W
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default UserMarker;
