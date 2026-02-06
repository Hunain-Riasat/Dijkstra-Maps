import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, MapPin, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import './RoadsTab.css';

function RoadsTab({ roads, locations, addRoad, deleteRoad, updateRoadStatus, toggleRoadAvailability }) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [distance, setDistance] = useState('');
  const [status, setStatus] = useState('Normal');

  // Get unique roads (filter out reverse duplicates for display)
  const uniqueRoads = roads.filter((road, index, self) => 
    index === self.findIndex(r => 
      (r.from === road.from && r.to === road.to) ||
      (r.from === road.to && r.to === road.from && road.from < road.to)
    )
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const from = parseInt(fromId);
    const to = parseInt(toId);
    const dist = parseInt(distance);
    
    if (isNaN(from) || isNaN(to) || isNaN(dist) || dist <= 0) {
      return;
    }
    
    if (addRoad(from, to, dist, status)) {
      setFromId('');
      setToId('');
      setDistance('');
      setStatus('Normal');
    }
  };

  const getLocationName = (id) => {
    const loc = locations.find(l => l.id === id);
    return loc ? loc.name : `ID ${id}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'var(--accent-tertiary)';
      case 'Heavy Traffic': return 'var(--accent-warning)';
      case 'Blocked': return 'var(--accent-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div
      className="roads-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <h2 className="tab-title">
          <MapPin className="title-icon" />
          Road Network Management
        </h2>
        <p className="tab-description">
          Configure road connections, distances, and traffic conditions
        </p>
      </div>

      <div className="content-layout">
        {/* Add Road Form */}
        <motion.div 
          className="card add-road-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="card-title">Add New Road</h3>
          <form onSubmit={handleSubmit} className="add-form">
            <div className="form-group">
              <label className="form-label">From Location</label>
              <select
                className="form-select"
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                required
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (ID: {loc.id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">To Location</label>
              <select
                className="form-select"
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                required
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (ID: {loc.id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Distance (km)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 15"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="Heavy Traffic">Heavy Traffic</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Road
            </motion.button>
          </form>
        </motion.div>

        {/* Roads List */}
        <motion.div 
          className="card roads-list-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="card-title">
            All Roads <span className="count-badge">{uniqueRoads.length}</span>
          </h3>
          
          <div className="roads-list">
            {uniqueRoads.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} />
                <p>No roads yet</p>
              </div>
            ) : (
              uniqueRoads.map((road, index) => (
                <motion.div
                  key={`${road.from}-${road.to}`}
                  className="road-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="road-info">
                    <div className="road-route">
                      <span className="location-tag">{getLocationName(road.from)}</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-icon">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="location-tag">{getLocationName(road.to)}</span>
                    </div>
                    
                    <div className="road-details">
                      <div className="detail-item">
                        <span className="detail-label">Distance:</span>
                        <span className="detail-value">{road.distance} km</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: `${getStatusColor(road.status)}20`,
                            color: getStatusColor(road.status),
                            borderColor: getStatusColor(road.status)
                          }}
                        >
                          {road.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="road-actions">
                    <motion.button
                      className="btn-icon"
                      onClick={() => toggleRoadAvailability(road.from, road.to)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={road.isAvailable ? 'Disable road' : 'Enable road'}
                    >
                      {road.isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </motion.button>
                    
                    <motion.button
                      className="btn-icon"
                      onClick={() => {
                        const newStatus = road.status === 'Normal' 
                          ? 'Heavy Traffic' 
                          : road.status === 'Heavy Traffic' 
                            ? 'Blocked' 
                            : 'Normal';
                        updateRoadStatus(road.from, road.to, newStatus);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Update status"
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                    
                    <motion.button
                      className="btn-icon btn-danger"
                      onClick={() => deleteRoad(road.from, road.to)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete road"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default RoadsTab;
