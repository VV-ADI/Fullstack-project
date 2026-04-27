import { useState, useEffect } from 'react';
import { useZones } from '../../context/ZoneContext';
import ZoneForm from './ZoneForm';
import ZoneList from './ZoneList';
import ZoneDrawer from './ZoneDrawer';

const AdminDashboard = () => {
  const { zones, alerts, fetchAlerts, createZone } = useZones();
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [activeTab, setActiveTab] = useState('zones');

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleAddZoneManual = () => {
    setEditingZone(null);
    setShowForm(true);
  };

  const handleDrawZone = () => {
    setShowDrawer(true);
  };

  const handleZoneDrawn = async (zoneData) => {
    const result = await createZone(zoneData);
    if (result.success) {
      setShowDrawer(false);
    } else {
      alert(result.message || 'Failed to create zone');
    }
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingZone(null);
  };

  // Stats calculations
  const criticalZones = zones.filter(z => z.severityLevel === 'Critical').length;
  const activeAlerts = alerts.filter(a => a.status === 'Active').length;

  // Show full-screen drawer if active
  if (showDrawer) {
    return (
      <ZoneDrawer
        onZoneCreated={handleZoneDrawn}
        existingZones={zones}
        onClose={() => setShowDrawer(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b-2 border-black pb-8">
          <div>
            <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Zone Management</h1>
            <p className="text-on-surface-variant mono text-xs uppercase tracking-widest mt-2">
              Operational Status: <span className="text-black font-bold">Active</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDrawZone}
              className="flex items-center gap-2 px-6 py-3 border border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Draw on Map
            </button>
            <button
              onClick={handleAddZoneManual}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Zone
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="border-t-4 border-black pt-6 animate-fade-in">
            <p className="label mb-4">Total Active Zones</p>
            <h3 className="text-5xl font-black text-black">{zones.length}</h3>
            <div className="flex items-center gap-2 mt-2 mono text-xs text-on-surface-variant">
              <span className="w-2 h-2 bg-success" />
              <span>All systems operational</span>
            </div>
          </div>
          <div className="border-t-4 border-zone-critical pt-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="label mb-4">Critical Zones</p>
            <h3 className="text-5xl font-black text-zone-critical">{criticalZones}</h3>
            <div className="flex items-center gap-2 mt-2 mono text-xs text-on-surface-variant">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <span>High priority areas</span>
            </div>
          </div>
          <div className="border-t-4 border-zone-high pt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="label mb-4">Active Alerts</p>
            <h3 className="text-5xl font-black text-zone-high">{activeAlerts}</h3>
            <div className="flex items-center gap-2 mt-2 mono text-xs text-on-surface-variant">
              <span className={`w-2 h-2 ${activeAlerts > 0 ? 'bg-zone-high animate-pulse' : 'bg-success'}`} />
              <span>{activeAlerts > 0 ? 'Requires attention' : 'No active alerts'}</span>
            </div>
          </div>
          <div className="border-t-4 border-outline pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="label mb-4">Total Alerts</p>
            <h3 className="text-5xl font-black text-black">{alerts.length}</h3>
            <div className="flex items-center gap-2 mt-2 mono text-xs text-on-surface-variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Historical total</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-outline mb-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('zones')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'zones'
                  ? 'text-black border-b-2 border-black'
                  : 'text-on-surface-variant hover:text-black'
              }`}
            >
              Containment Zones
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'alerts'
                  ? 'text-black border-b-2 border-black'
                  : 'text-on-surface-variant hover:text-black'
              }`}
            >
              All Alerts
              {activeAlerts > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-zone-critical text-white text-[9px] font-bold">
                  {activeAlerts}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'zones' ? (
            <ZoneList zones={zones} onEdit={handleEditZone} />
          ) : (
            <AdminAlertList alerts={alerts} />
          )}
        </div>

        {/* Zone Form Modal */}
        {showForm && (
          <ZoneForm
            zone={editingZone}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

// Admin Alert List Component
const AdminAlertList = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="uber-panel-subtle p-16 text-center">
        <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-on-surface-variant font-medium">No alerts in the system yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline">
            <th className="px-4 py-4 text-left label">User</th>
            <th className="px-4 py-4 text-left label">Zone</th>
            <th className="px-4 py-4 text-left label">Severity</th>
            <th className="px-4 py-4 text-left label">Alert Time</th>
            <th className="px-4 py-4 text-left label">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline">
          {alerts.map((alert) => (
            <tr key={alert._id} className="hover:bg-surface-variant transition-colors group">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold">
                    {alert.userId?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{alert.userId?.name || 'Unknown'}</p>
                    <p className="mono text-[10px] text-on-surface-variant">{alert.userId?.email || ''}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-bold">{alert.zoneId?.zoneName || 'Unknown Zone'}</span>
              </td>
              <td className="px-4 py-4">
                <span className={`badge ${
                  alert.zoneId?.severityLevel === 'Critical' ? 'badge-critical' :
                  alert.zoneId?.severityLevel === 'High' ? 'badge-high' :
                  alert.zoneId?.severityLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                }`}>
                  {alert.zoneId?.severityLevel || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-medium">{new Date(alert.alertTime).toLocaleDateString()}</p>
                <p className="mono text-[10px] text-on-surface-variant">{new Date(alert.alertTime).toLocaleTimeString()}</p>
              </td>
              <td className="px-4 py-4">
                <span className={`badge ${
                  alert.status === 'Active' ? 'badge-critical' :
                  alert.status === 'Resolved' ? 'badge-success' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {alert.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
