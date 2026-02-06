import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, MapPin } from 'lucide-react';
import './LocationsTab.css';

function LocationsTab({ locations, addLocation, deleteLocation }) {
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = parseInt(newId);
    
    if (isNaN(id) || !newName.trim()) {
      return;
    }
    
    if (addLocation(id, newName.trim())) {
      setNewId('');
      setNewName('');
    }
  };

  return (
    <motion.div
      className="locations-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <h2 className="tab-title">
          <MapPin className="title-icon" />
          Location Management
        </h2>
        <p className="tab-description">
          Manage your network locations - add new destinations or remove existing ones
        </p>
      </div>

      <div className="content-grid">
        {/* Add Location Form */}
        <motion.div 
          className="card add-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="card-title">Add New Location</h3>
          <form onSubmit={handleSubmit} className="add-form">
            <div className="form-group">
              <label className="form-label">Location ID</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 11"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Location Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Liberty Market"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Location
            </motion.button>
          </form>
        </motion.div>

        {/* Locations List */}
        <motion.div 
          className="card locations-list-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="card-title">
            All Locations <span className="count-badge">{locations.length}</span>
          </h3>
          
          <div className="locations-list">
            {locations.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} />
                <p>No locations yet</p>
              </div>
            ) : (
              locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  className="location-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="location-info">
                    <div className="location-id">{location.id}</div>
                    <div className="location-name">{location.name}</div>
                  </div>
                  
                  <motion.button
                    className="btn-icon btn-danger"
                    onClick={() => deleteLocation(location.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LocationsTab;
