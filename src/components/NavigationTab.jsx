import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Fuel, Clock, DollarSign, TrendingUp } from 'lucide-react';
import './NavigationTab.css';

function NavigationTab({ locations, findShortestPath }) {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [result, setResult] = useState(null);

  const handleFindPath = () => {
    if (!startId || !endId) return;
    
    const start = parseInt(startId);
    const end = parseInt(endId);
    
    if (start === end) {
      setResult({ error: 'Start and destination cannot be the same!' });
      return;
    }
    
    const pathResult = findShortestPath(start, end);
    
    if (!pathResult) {
      setResult({ error: 'No path found between selected locations!' });
    } else {
      const fuelRequired = (pathResult.distance * 0.12).toFixed(2);
      const timeEstimate = pathResult.distance / 40;
      const hours = Math.floor(timeEstimate);
      const minutes = Math.round((timeEstimate - hours) * 60);
      const fuelCost = (fuelRequired * 1.5).toFixed(2);
      
      setResult({
        ...pathResult,
        fuelRequired,
        hours,
        minutes,
        fuelCost
      });
    }
  };

  const getLocationName = (id) => {
    const loc = locations.find(l => l.id === id);
    return loc ? loc.name : `ID ${id}`;
  };

  return (
    <motion.div
      className="navigation-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <h2 className="tab-title">
          <Navigation className="title-icon" />
          Route Planning & Navigation
        </h2>
        <p className="tab-description">
          Find the shortest path between locations with detailed cost estimates
        </p>
      </div>

      <div className="navigation-grid">
        {/* Route Selection */}
        <motion.div 
          className="card route-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="card-title">Select Route</h3>
          
          <div className="route-form">
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Start Location
              </label>
              <select
                className="form-select"
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
              >
                <option value="">Choose starting point</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="route-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">→</div>
              <div className="divider-line"></div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Destination
              </label>
              <select
                className="form-select"
                value={endId}
                onChange={(e) => setEndId(e.target.value)}
              >
                <option value="">Choose destination</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            
            <motion.button
              className="btn btn-primary btn-large"
              onClick={handleFindPath}
              disabled={!startId || !endId}
              whileHover={{ scale: startId && endId ? 1.02 : 1 }}
              whileTap={{ scale: startId && endId ? 0.98 : 1 }}
            >
              <Navigation size={20} />
              Find Shortest Path
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result.error ? (
              <div className="card error-card">
                <div className="error-content">
                  <div className="error-icon">⚠️</div>
                  <h3 className="error-title">No Route Found</h3>
                  <p className="error-message">{result.error}</p>
                  <p className="error-hint">
                    Try selecting different locations or check if roads are available
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Route Path */}
                <div className="card path-card">
                  <h3 className="card-title success-title">
                    ✓ Route Found
                  </h3>
                  
                  <div className="path-visualization">
                    {result.path.map((locId, index) => (
                      <React.Fragment key={locId}>
                        <motion.div
                          className="path-node"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="node-number">{index + 1}</div>
                          <div className="node-name">{getLocationName(locId)}</div>
                        </motion.div>
                        {index < result.path.length - 1 && (
                          <motion.div 
                            className="path-arrow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.05 }}
                          >
                            ↓
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                  <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="stat-icon distance-icon">
                      <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Total Distance</div>
                      <div className="stat-value">{result.distance} km</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="stat-icon fuel-icon">
                      <Fuel size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Fuel Required</div>
                      <div className="stat-value">{result.fuelRequired} L</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="stat-icon time-icon">
                      <Clock size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Estimated Time</div>
                      <div className="stat-value">
                        {result.hours}h {result.minutes}m
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="stat-icon cost-icon">
                      <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Fuel Cost</div>
                      <div className="stat-value">${result.fuelCost}</div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default NavigationTab;
