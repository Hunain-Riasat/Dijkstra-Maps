import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, CheckCircle, XCircle, AlertTriangle, GitBranch } from 'lucide-react';
import './StatsTab.css';

function StatsTab({ locations, roads }) {
  // Get unique roads for counting
  const uniqueRoads = roads.filter((road, index, self) => 
    index === self.findIndex(r => 
      (r.from === road.from && r.to === road.to) ||
      (r.from === road.to && r.to === road.from && road.from < road.to)
    )
  );

  const availableRoads = uniqueRoads.filter(r => r.isAvailable).length;
  const normalRoads = uniqueRoads.filter(r => r.status === 'Normal').length;
  const trafficRoads = uniqueRoads.filter(r => r.status === 'Heavy Traffic').length;
  const blockedRoads = uniqueRoads.filter(r => r.status === 'Blocked').length;

  const stats = [
    {
      icon: MapPin,
      label: 'Total Locations',
      value: locations.length,
      color: 'var(--accent-primary)',
      bg: 'rgba(0, 240, 255, 0.1)'
    },
    {
      icon: GitBranch,
      label: 'Total Roads',
      value: uniqueRoads.length,
      color: 'var(--accent-secondary)',
      bg: 'rgba(255, 0, 170, 0.1)'
    },
    {
      icon: CheckCircle,
      label: 'Available Roads',
      value: availableRoads,
      color: 'var(--accent-tertiary)',
      bg: 'rgba(0, 255, 136, 0.1)'
    },
    {
      icon: AlertTriangle,
      label: 'Heavy Traffic',
      value: trafficRoads,
      color: 'var(--accent-warning)',
      bg: 'rgba(255, 170, 0, 0.1)'
    }
  ];

  return (
    <motion.div
      className="stats-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <h2 className="tab-title">
          <BarChart3 className="title-icon" />
          System Statistics
        </h2>
        <p className="tab-description">
          Overview of your navigation network performance and status
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-main-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="stat-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-box-icon" style={{ background: stat.bg }}>
                <Icon size={32} style={{ color: stat.color }} />
              </div>
              <div className="stat-box-content">
                <div className="stat-box-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-box-label">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="stats-details-grid">
        {/* Road Status Breakdown */}
        <motion.div 
          className="card details-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="card-title">Road Status Breakdown</h3>
          
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar normal"
                  style={{ width: `${(normalRoads / (uniqueRoads.length || 1)) * 100}%` }}
                />
              </div>
              <div className="breakdown-info">
                <span className="breakdown-label">Normal</span>
                <span className="breakdown-value">{normalRoads}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar traffic"
                  style={{ width: `${(trafficRoads / (uniqueRoads.length || 1)) * 100}%` }}
                />
              </div>
              <div className="breakdown-info">
                <span className="breakdown-label">Heavy Traffic</span>
                <span className="breakdown-value">{trafficRoads}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar blocked"
                  style={{ width: `${(blockedRoads / (uniqueRoads.length || 1)) * 100}%` }}
                />
              </div>
              <div className="breakdown-info">
                <span className="breakdown-label">Blocked</span>
                <span className="breakdown-value">{blockedRoads}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Locations List */}
        <motion.div 
          className="card details-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="card-title">All Locations ({locations.length})</h3>
          
          <div className="locations-grid">
            {locations.map((loc, index) => (
              <motion.div
                key={loc.id}
                className="location-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="badge-id">{loc.id}</span>
                <span className="badge-name">{loc.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Network Health */}
      <motion.div 
        className="card health-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="card-title">Network Health</h3>
        
        <div className="health-metrics">
          <div className="health-metric">
            <div className="metric-circle">
              <svg className="metric-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="metric-bg" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="metric-progress"
                  style={{
                    strokeDashoffset: `${283 - (283 * availableRoads) / (uniqueRoads.length || 1)}`
                  }}
                />
                <text x="50" y="55" className="metric-text">
                  {uniqueRoads.length > 0 ? Math.round((availableRoads / uniqueRoads.length) * 100) : 0}%
                </text>
              </svg>
            </div>
            <div className="metric-label">Road Availability</div>
          </div>

          <div className="health-metric">
            <div className="metric-circle">
              <svg className="metric-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="metric-bg" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="metric-progress success"
                  style={{
                    strokeDashoffset: `${283 - (283 * normalRoads) / (uniqueRoads.length || 1)}`
                  }}
                />
                <text x="50" y="55" className="metric-text">
                  {uniqueRoads.length > 0 ? Math.round((normalRoads / uniqueRoads.length) * 100) : 0}%
                </text>
              </svg>
            </div>
            <div className="metric-label">Normal Traffic</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StatsTab;
