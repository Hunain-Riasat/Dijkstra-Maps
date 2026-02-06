import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import './MapTab.css';

function MapTab({ locations, roads }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || locations.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate positions in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const positions = locations.map((loc, index) => {
      const angle = (2 * Math.PI * index) / locations.length - Math.PI / 2;
      return {
        id: loc.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        name: loc.name
      };
    });

    // Draw roads
    const uniqueRoads = roads.filter((road, index, self) => 
      index === self.findIndex(r => 
        (r.from === road.from && r.to === road.to) ||
        (r.from === road.to && r.to === road.from && road.from < road.to)
      )
    );

    uniqueRoads.forEach(road => {
      const fromPos = positions.find(p => p.id === road.from);
      const toPos = positions.find(p => p.id === road.to);

      if (fromPos && toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);

        // Set road color based on status
        if (!road.isAvailable) {
          ctx.strokeStyle = 'rgba(108, 121, 153, 0.3)';
          ctx.setLineDash([5, 5]);
        } else if (road.status === 'Blocked') {
          ctx.strokeStyle = '#ff00aa';
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
        } else if (road.status === 'Heavy Traffic') {
          ctx.strokeStyle = '#ffaa00';
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Draw distance label
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(midX - 20, midY - 10, 40, 20);
        
        ctx.fillStyle = '#e8ecff';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${road.distance}km`, midX, midY);
      }
    });

    // Draw location nodes
    positions.forEach((pos, index) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 30);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Node circle
      const nodeGradient = ctx.createLinearGradient(
        pos.x - 20, pos.y - 20, 
        pos.x + 20, pos.y + 20
      );
      nodeGradient.addColorStop(0, '#00f0ff');
      nodeGradient.addColorStop(1, '#ff00aa');
      
      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      // ID text
      ctx.fillStyle = '#0a0e27';
      ctx.font = 'bold 14px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.id.toString(), pos.x, pos.y);

      // Location name
      ctx.fillStyle = '#e8ecff';
      ctx.font = '14px Urbanist';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(pos.name, pos.x, pos.y + 30);
    });

  }, [locations, roads]);

  return (
    <motion.div
      className="map-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <h2 className="tab-title">
          <Map className="title-icon" />
          Network Visualization
        </h2>
        <p className="tab-description">
          Interactive map showing all locations and road connections
        </p>
      </div>

      <motion.div 
        className="card map-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color normal"></div>
            <span>Normal Road</span>
          </div>
          <div className="legend-item">
            <div className="legend-color traffic"></div>
            <span>Heavy Traffic</span>
          </div>
          <div className="legend-item">
            <div className="legend-color blocked"></div>
            <span>Blocked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>

        <div className="map-container">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="map-canvas"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MapTab;
