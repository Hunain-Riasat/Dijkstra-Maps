import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Map, BarChart3 } from 'lucide-react';

import './TabNavigation.css';

const tabs = [
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'roads', label: 'Roads', icon: MapPin },
  { id: 'navigation', label: 'Navigation', icon: Navigation },
  { id: 'map', label: 'Map View', icon: Map },
  { id: 'stats', label: 'Statistics', icon: BarChart3 }
];

function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="tab-navigation">
      <div className="tabs-container">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="tab-icon" size={20} />
              <span className="tab-label">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default TabNavigation;
