import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import components
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import LocationsTab from './components/LocationsTab';
import RoadsTab from './components/RoadsTab';
import NavigationTab from './components/NavigationTab';
import MapTab from './components/MapTab';
import StatsTab from './components/StatsTab';

// Initial preloaded data
const INITIAL_LOCATIONS = [
  { id: 1, name: 'DHA' },
  { id: 2, name: 'Sadar Bazaar' },
  { id: 3, name: 'Anarkali' },
  { id: 4, name: 'Model Town' },
  { id: 5, name: 'Gulberg' },
  { id: 6, name: 'Defence Road' },
  { id: 7, name: 'Canal Road' },
  { id: 8, name: 'Mall Road' },
  { id: 9, name: 'Johar Town' },
  { id: 10, name: 'Bahria Town' }
];

const INITIAL_ROADS = [
  { from: 1, to: 2, distance: 8, status: 'Normal', isAvailable: true },
  { from: 2, to: 3, distance: 6, status: 'Normal', isAvailable: true },
  { from: 3, to: 4, distance: 12, status: 'Heavy Traffic', isAvailable: true },
  { from: 4, to: 5, distance: 5, status: 'Normal', isAvailable: true },
  { from: 5, to: 6, distance: 9, status: 'Normal', isAvailable: true },
  { from: 6, to: 7, distance: 7, status: 'Heavy Traffic', isAvailable: true },
  { from: 7, to: 8, distance: 4, status: 'Normal', isAvailable: true },
  { from: 8, to: 9, distance: 10, status: 'Blocked', isAvailable: true },
  { from: 9, to: 10, distance: 14, status: 'Normal', isAvailable: true },
  { from: 10, to: 1, distance: 18, status: 'Heavy Traffic', isAvailable: true },
  { from: 1, to: 3, distance: 14, status: 'Normal', isAvailable: true },
  { from: 2, to: 4, distance: 15, status: 'Normal', isAvailable: true },
  { from: 3, to: 5, distance: 11, status: 'Normal', isAvailable: true },
  { from: 4, to: 6, distance: 8, status: 'Heavy Traffic', isAvailable: true },
  { from: 5, to: 7, distance: 13, status: 'Normal', isAvailable: true },
  { from: 6, to: 8, distance: 9, status: 'Normal', isAvailable: true },
  { from: 7, to: 9, distance: 12, status: 'Normal', isAvailable: true },
  { from: 8, to: 10, distance: 16, status: 'Heavy Traffic', isAvailable: true },
  { from: 2, to: 6, distance: 18, status: 'Normal', isAvailable: true },
  { from: 9, to: 1, distance: 20, status: 'Normal', isAvailable: true }
];

// Create bidirectional roads
const createBidirectionalRoads = (roads) => {
  const bidirectional = [];
  roads.forEach(road => {
    bidirectional.push(road);
    bidirectional.push({
      from: road.to,
      to: road.from,
      distance: road.distance,
      status: road.status,
      isAvailable: road.isAvailable
    });
  });
  return bidirectional;
};

function App() {
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [roads, setRoads] = useState(createBidirectionalRoads(INITIAL_ROADS));
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Location management
  const addLocation = (id, name) => {
    if (locations.find(loc => loc.id === id)) {
      showNotification('Location ID already exists!', 'error');
      return false;
    }
    setLocations([...locations, { id, name }]);
    showNotification('Location added successfully!');
    return true;
  };

  const deleteLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
    setRoads(roads.filter(road => road.from !== id && road.to !== id));
    showNotification('Location deleted successfully!');
  };

  // Road management
  const addRoad = (from, to, distance, status) => {
    if (from === to) {
      showNotification('Cannot create road to the same location!', 'error');
      return false;
    }
    
    const newRoads = [
      { from, to, distance, status, isAvailable: true },
      { from: to, to: from, distance, status, isAvailable: true }
    ];
    
    setRoads([...roads, ...newRoads]);
    showNotification('Road added successfully!');
    return true;
  };

  const deleteRoad = (from, to) => {
    setRoads(roads.filter(road => 
      !(road.from === from && road.to === to) && 
      !(road.from === to && road.to === from)
    ));
    showNotification('Road deleted successfully!');
  };

  const updateRoadStatus = (from, to, status) => {
    setRoads(roads.map(road => 
      (road.from === from && road.to === to) || (road.from === to && road.to === from)
        ? { ...road, status }
        : road
    ));
    showNotification('Road status updated!');
  };

  const toggleRoadAvailability = (from, to) => {
    setRoads(roads.map(road => 
      (road.from === from && road.to === to) || (road.from === to && road.to === from)
        ? { ...road, isAvailable: !road.isAvailable }
        : road
    ));
    showNotification('Road availability toggled!');
  };

  // Dijkstra's shortest path algorithm
  const findShortestPath = (startId, endId) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    locations.forEach(loc => {
      distances[loc.id] = Infinity;
      previous[loc.id] = null;
      unvisited.add(loc.id);
    });
    
    distances[startId] = 0;
    
    while (unvisited.size > 0) {
      let currentId = null;
      let minDistance = Infinity;
      
      unvisited.forEach(id => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          currentId = id;
        }
      });
      
      if (currentId === null || distances[currentId] === Infinity) break;
      if (currentId === endId) break;
      
      unvisited.delete(currentId);
      
      const neighbors = roads.filter(road => 
        road.from === currentId && road.isAvailable && road.status !== 'Blocked'
      );
      
      neighbors.forEach(road => {
        const alt = distances[currentId] + 
                   road.distance * (road.status === 'Heavy Traffic' ? 1.5 : 1);
        
        if (alt < distances[road.to]) {
          distances[road.to] = alt;
          previous[road.to] = currentId;
        }
      });
    }
    
    if (distances[endId] === Infinity) {
      return null;
    }
    
    const path = [];
    let current = endId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return {
      path,
      distance: Math.round(distances[endId])
    };
  };

  return (
    




    <div className="app-container">
      <div className="app">
      <Header />
      
      <main className="main-content">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="tab-content">
          <AnimatePresence mode="wait">
            {activeTab === 'locations' && (
              <LocationsTab
                key="locations"
                locations={locations}
                addLocation={addLocation}
                deleteLocation={deleteLocation}
              />
            )}
            
            {activeTab === 'roads' && (
              <RoadsTab
                key="roads"
                roads={roads}
                locations={locations}
                addRoad={addRoad}
                deleteRoad={deleteRoad}
                updateRoadStatus={updateRoadStatus}
                toggleRoadAvailability={toggleRoadAvailability}
              />
            )}
            
            {activeTab === 'navigation' && (
              <NavigationTab
                key="navigation"
                locations={locations}
                findShortestPath={findShortestPath}
              />
            )}
            
            {activeTab === 'map' && (
              <MapTab
                key="map"
                locations={locations}
                roads={roads}
              />
            )}
            
            {activeTab === 'stats' && (
              <StatsTab
                key="stats"
                locations={locations}
                roads={roads}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`notification ${notification.type}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      <footer className="footer">
        Made with ❤️ by Muhammad Hunain
      </footer>
    </div>
  );
}

export default App;



