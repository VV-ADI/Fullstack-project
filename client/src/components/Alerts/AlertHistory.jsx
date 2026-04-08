import { useEffect, useState } from 'react';
import { useZones } from '../../context/ZoneContext';

const AlertHistory = () => {
  const { alerts, fetchAlerts, dismissAlert } = useZones();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDismiss = async (alertId) => {
    await dismissAlert(alertId);
  };

  const handleDismissAll = async () => {
    const activeAlerts = alerts.filter(a => a.status === 'Active');
    for (const alert of activeAlerts) {
      await dismissAlert(alert._id);
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.status === 'Active';
    if (filter === 'resolved') return alert.status === 'Dismissed' || alert.status === 'Resolved';
    return true;
  });

  // Group alerts by date
  const groupedAlerts = filteredAlerts.reduce((groups, alert) => {
    const date = new Date(alert.alertTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(alert);
    return groups;
  }, {});

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'Critical': return { border: 'border-l-zone-critical', icon: 'bg-zone-critical/10 text-zone-critical border-zone-critical', badge: 'badge-critical' };
      case 'High': return { border: 'border-l-zone-high', icon: 'bg-zone-high/10 text-zone-high border-zone-high', badge: 'badge-high' };
      case 'Medium': return { border: 'border-l-zone-medium', icon: 'bg-zone-medium/10 text-black border-zone-medium', badge: 'badge-medium' };
      default: return { border: 'border-l-zone-low', icon: 'bg-zone-low/10 text-zone-low border-zone-low', badge: 'badge-low' };
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 md:pb-6">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-black pb-8">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight uppercase">Alert History</h1>
            <p className="text-on-surface-variant text-sm mt-2">Your containment zone breach records</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex border border-black">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === 'all' ? 'bg-black text-white' : 'text-black hover:bg-surface-variant'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === 'active' ? 'bg-black text-white' : 'text-black hover:bg-surface-variant'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === 'resolved' ? 'bg-black text-white' : 'text-black hover:bg-surface-variant'
                }`}
              >
                Resolved
              </button>
            </div>
            
            {alerts.some(a => a.status === 'Active') && (
              <button
                onClick={handleDismissAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dismiss All
              </button>
            )}
          </div>
        </div>

        {/* Alert List */}
        {filteredAlerts.length === 0 ? (
          <div className="uber-panel-subtle p-16 text-center animate-fade-in">
            <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">No Alerts</h2>
            <p className="text-on-surface-variant">
              {filter === 'all' 
                ? "You haven't triggered any containment zone alerts yet."
                : `No ${filter} alerts found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] font-bold text-black uppercase tracking-widest whitespace-nowrap">
                    {date}
                  </span>
                  <div className="flex-grow border-t border-outline" />
                </div>
                
                {/* Alerts for this date */}
                <div className="space-y-4">
                  {dateAlerts.map((alert) => {
                    const severity = alert.zoneId?.severityLevel || 'Low';
                    const config = getSeverityConfig(severity);
                    const isResolved = alert.status !== 'Active';
                    
                    return (
                      <div 
                        key={alert._id} 
                        className={`group uber-panel-subtle border-l-4 ${config.border} p-6 hover:border-black transition-all ${
                          isResolved ? 'opacity-60 hover:opacity-100' : ''
                        }`}
                      >
                        <div className="flex gap-6">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 flex items-center justify-center border ${config.icon}`}>
                              {isResolved ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                                </svg>
                              )}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-lg font-bold text-black">
                                    {alert.zoneId?.zoneName || 'Unknown Zone'}
                                  </h3>
                                  <span className={`badge ${config.badge}`}>
                                    {severity}
                                  </span>
                                  {isResolved && (
                                    <span className="badge badge-success">Resolved</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-on-surface-variant text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(alert.alertTime).toLocaleTimeString()}
                                  </div>
                                  {alert.zoneId?.locationCoordinates && (
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      </svg>
                                      <span className="mono">
                                        {alert.zoneId.locationCoordinates.lat.toFixed(4)}° N, {alert.zoneId.locationCoordinates.lng.toFixed(4)}° W
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!isResolved && (
                                  <button 
                                    onClick={() => handleDismiss(alert._id)}
                                    className="p-2 hover:bg-surface-variant text-black transition-colors"
                                    title="Dismiss"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Alert Description */}
                            <div className="mt-4 p-4 bg-surface-variant text-sm text-on-surface-variant">
                              Zone breach detected. {isResolved ? 'This alert has been resolved.' : 'Please ensure you have evacuated the restricted area.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertHistory;
