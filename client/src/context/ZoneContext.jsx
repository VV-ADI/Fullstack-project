import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ZoneContext = createContext(null);

export const useZones = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZones must be used within a ZoneProvider');
  }
  return context;
};

export const ZoneProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all zones
  const fetchZones = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await api.get('/zones');
      setZones(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch zones');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch user's alerts
  const fetchAlerts = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/alerts');
      setAlerts(response.data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, [isAuthenticated]);

  // Create a new zone (admin)
  const createZone = async (zoneData) => {
    try {
      const response = await api.post('/zones', zoneData);
      setZones([...zones, response.data.zone]);
      return { success: true, zone: response.data.zone };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create zone'
      };
    }
  };

  // Update a zone (admin)
  const updateZone = async (id, zoneData) => {
    try {
      const response = await api.put(`/zones/${id}`, zoneData);
      setZones(zones.map(z => z._id === id ? response.data.zone : z));
      return { success: true, zone: response.data.zone };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update zone'
      };
    }
  };

  // Delete a zone (admin)
  const deleteZone = async (id) => {
    try {
      await api.delete(`/zones/${id}`);
      setZones(zones.filter(z => z._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete zone'
      };
    }
  };

  // Create an alert
  const createAlert = async (zoneId) => {
    try {
      const response = await api.post('/alerts', { zoneId });
      setAlerts([response.data.alert, ...alerts]);
      return { success: true, alert: response.data.alert };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create alert'
      };
    }
  };

  // Dismiss an alert
  const dismissAlert = async (alertId) => {
    try {
      const response = await api.patch(`/alerts/${alertId}`, { status: 'Dismissed' });
      setAlerts(alerts.map(a => a._id === alertId ? response.data.alert : a));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to dismiss alert'
      };
    }
  };

  // Fetch zones on mount and poll every 60 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchZones();
      fetchAlerts();
      
      const interval = setInterval(() => {
        fetchZones();
      }, 60000); // Poll every 60 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchZones, fetchAlerts]);

  const value = {
    zones,
    alerts,
    loading,
    error,
    fetchZones,
    fetchAlerts,
    createZone,
    updateZone,
    deleteZone,
    createAlert,
    dismissAlert
  };

  return (
    <ZoneContext.Provider value={value}>
      {children}
    </ZoneContext.Provider>
  );
};
