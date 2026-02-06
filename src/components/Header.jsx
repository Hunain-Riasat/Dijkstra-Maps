import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Sparkles } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="header-content">
        <div className="header-left">
          <motion.div 
            className="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Navigation className="logo-icon" size={32} />
          </motion.div>
          <div className="title-container">
            <h1 className="title gradient-text">Smart Navigation</h1>
            <p className="subtitle">Advanced Route Planning System</p>
          </div>
        </div>
        
        <div className="header-right">
          <motion.div 
            className="status-badge"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={16} />
            <span>Live</span>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative line */}
      <motion.div 
        className="header-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </motion.header>
  );
}

export default Header;
