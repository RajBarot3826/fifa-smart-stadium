import React, { useState } from "react";
import { STADIUM_NODES } from "../utils/pathFinder";

/**
 * Interactive Stadium Heatmap
 * Visualizes gates, sections, concessions, restrooms, and active path navigation.
 */
export default function InteractiveMap({ 
  occupancyData, 
  activeIncidents, 
  wayfindingPath, 
  onSelectLocation 
}) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Generate SVG polyline path if wayfinding path coordinates are available
  const polylinePoints = wayfindingPath && wayfindingPath.length > 1
    ? wayfindingPath.map(nodeId => {
        const node = STADIUM_NODES[nodeId];
        return node ? `${node.x},${node.y}` : "";
      }).filter(Boolean).join(" ")
    : "";

  // Get color fill based on occupancy percentage (Efficiency/UX Optimization)
  const getSectionColor = (sectionId, occupancy) => {
    // Check if there is an active high/critical incident in this location
    const hasIncident = activeIncidents.some(
      inc => inc.location === sectionId && inc.status !== "Resolved"
    );
    if (hasIncident) return "rgba(255, 59, 48, 0.7)"; // Pulsing Red for alert

    if (occupancy >= 95) return "rgba(255, 59, 48, 0.5)"; // Red
    if (occupancy >= 80) return "rgba(255, 204, 0, 0.5)";  // Amber
    if (occupancy >= 50) return "rgba(79, 172, 254, 0.4)";  // Blue
    return "rgba(0, 245, 160, 0.35)";                        // Emerald Green
  };

  // Keyboard navigation handler for accessibility (a11y)
  const handleKeyDown = (e, nodeId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectLocation(nodeId);
    }
  };

  return (
    <div className="glass-card glow-cyan" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>STADIUM LIVE HEATMAP</h3>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Select any zone or path to inspect queue and alert conditions.
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "12px", fontSize: "10px", fontWeight: "600" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255, 59, 48, 0.8)" }}></span> Alert / Peak
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255, 204, 0, 0.8)" }}></span> Busy
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(79, 172, 254, 0.8)" }}></span> Normal
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div 
        className="map-wrapper" 
        style={{ 
          position: "relative", 
          width: "100%", 
          background: "rgba(0, 0, 0, 0.3)", 
          borderRadius: "12px", 
          border: "1px solid var(--border-color)",
          overflow: "hidden"
        }}
      >
        <svg 
          viewBox="0 0 800 500" 
          width="100%" 
          height="100%" 
          style={{ display: "block" }}
          aria-label="Interactive Stadium Blueprint Map"
          role="img"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a24" />
              <stop offset="100%" stopColor="#0d2414" />
            </radialGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid markings */}
          <g stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1">
            <line x1="100" y1="0" x2="100" y2="500" />
            <line x1="200" y1="0" x2="200" y2="500" />
            <line x1="300" y1="0" x2="300" y2="500" />
            <line x1="400" y1="0" x2="400" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="600" y1="0" x2="600" y2="500" />
            <line x1="700" y1="0" x2="700" y2="500" />
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="0" y1="400" x2="800" y2="400" />
          </g>

          {/* Pitch Area */}
          <rect 
            x="270" 
            y="150" 
            width="260" 
            height="200" 
            rx="12" 
            fill="url(#pitchGlow)" 
            stroke="rgba(0, 245, 160, 0.4)" 
            strokeWidth="3"
          />
          {/* Pitch markings */}
          <line x1="400" y1="150" x2="400" y2="350" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
          <circle cx="400" cy="250" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
          <circle cx="400" cy="250" r="4" fill="rgba(255, 255, 255, 0.6)" />
          <rect x="270" y="200" width="30" height="100" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
          <rect x="500" y="200" width="30" height="100" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />

          {/* Stadium Seating Ring (Outer Polygon boundaries) */}
          <rect 
            x="120" 
            y="70" 
            width="560" 
            height="360" 
            rx="40" 
            fill="none" 
            stroke="var(--border-color)" 
            strokeWidth="1.5"
          />

          {/* SVG Connections/Edges (Visual Network paths) */}
          <g stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2">
            <line x1="400" y1="50" x2="300" y2="100" />
            <line x1="400" y1="50" x2="500" y2="100" />
            <line x1="750" y1="250" x2="600" y2="150" />
            <line x1="750" y1="250" x2="600" y2="350" />
            <line x1="400" y1="450" x2="500" y2="400" />
            <line x1="400" y1="450" x2="300" y2="400" />
            <line x1="50" y1="250" x2="200" y2="350" />
            <line x1="50" y1="250" x2="200" y2="150" />
            {/* Ring links */}
            <circle cx="400" cy="250" r="180" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="4" />
          </g>

          {/* Seating Sections (Sec 101 - 108) */}
          {Object.keys(STADIUM_NODES)
            .filter(key => STADIUM_NODES[key].type === "section")
            .map(key => {
              const node = STADIUM_NODES[key];
              const occupancy = occupancyData[key] || 0;
              const hasAlert = activeIncidents.some(
                inc => inc.location === key && inc.status !== "Resolved"
              );

              return (
                <g 
                  key={key}
                  onClick={() => onSelectLocation(key)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Seating Block Shape */}
                  <rect
                    x={node.x - 30}
                    y={node.y - 20}
                    width="60"
                    height="40"
                    rx="6"
                    fill={getSectionColor(key, occupancy)}
                    stroke={hoveredNode?.id === key ? "var(--neon-cyan)" : "var(--border-color)"}
                    strokeWidth={hoveredNode?.id === key ? "2.5" : "1"}
                    tabIndex={0}
                    role="button"
                    aria-label={`${node.label}, Occupancy: ${occupancy}%. ${hasAlert ? "Active incident reported." : ""}`}
                    onKeyDown={(e) => handleKeyDown(e, key)}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  {/* Text Label */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="11px"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {key.replace("Sec ", "")}
                  </text>
                  
                  {/* Glowing alert dot for critical incidents */}
                  {hasAlert && (
                    <circle 
                      cx={node.x + 20} 
                      cy={node.y - 12} 
                      r="5" 
                      fill="var(--neon-red)" 
                      className="pulse-critical"
                      style={{ filter: "url(#neonGlow)" }}
                    />
                  )}
                </g>
              );
            })}

          {/* Infrastructure Nodes (Gates, Concessions, Restrooms) */}
          {Object.keys(STADIUM_NODES)
            .filter(key => STADIUM_NODES[key].type !== "section")
            .map(key => {
              const node = STADIUM_NODES[key];
              const hasAlert = activeIncidents.some(
                inc => inc.location === key && inc.status !== "Resolved"
              );

              // Visual styling settings based on node type
              let fillColor = "rgba(18, 20, 32, 0.85)";
              let strokeColor = "var(--border-color)";
              let shapeRadius = 14;

              if (node.type === "gate") {
                fillColor = "rgba(79, 172, 254, 0.15)";
                strokeColor = "var(--neon-blue)";
                shapeRadius = 16;
              } else if (node.type === "concession") {
                fillColor = "rgba(255, 204, 0, 0.1)";
                strokeColor = "var(--neon-amber)";
              } else if (node.type === "restroom") {
                fillColor = "rgba(185, 39, 252, 0.1)";
                strokeColor = "var(--neon-purple)";
              }

              if (hoveredNode?.id === key) {
                strokeColor = "var(--neon-cyan)";
              }
              if (hasAlert) {
                fillColor = "rgba(255, 59, 48, 0.25)";
                strokeColor = "var(--neon-red)";
              }

              return (
                <g
                  key={key}
                  onClick={() => onSelectLocation(key)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Gate uses a Diamond shape, others use circle */}
                  {node.type === "gate" ? (
                    <polygon
                      points={`${node.x},${node.y - 18} ${node.x + 18},${node.y} ${node.x},${node.y + 18} ${node.x - 18},${node.y}`}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={hoveredNode?.id === key ? "3" : "1.5"}
                      style={{ transition: "all 0.2s ease" }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${node.label}. ${hasAlert ? "Incident active." : ""}`}
                      onKeyDown={(e) => handleKeyDown(e, key)}
                    />
                  ) : (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={shapeRadius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={hoveredNode?.id === key ? "3" : "1.5"}
                      style={{ transition: "all 0.2s ease" }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${node.label}. ${hasAlert ? "Incident active." : ""}`}
                      onKeyDown={(e) => handleKeyDown(e, key)}
                    />
                  )}

                  {/* Character label icon */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="10px"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {node.type === "gate" ? node.id.replace("Gate ", "") : node.id.match(/\d+/) ? node.id.match(/\d+/)[0] : node.id.replace("Restroom ", "")}
                  </text>

                  {/* Red flashing warning dot */}
                  {hasAlert && (
                    <circle
                      cx={node.x + 12}
                      cy={node.y - 12}
                      r="5"
                      fill="var(--neon-red)"
                      className="pulse-critical"
                    />
                  )}
                </g>
              );
            })}

          {/* Wayfinding Active Path Overlay */}
          {polylinePoints && (
            <g filter="url(#pathGlow)" style={{ pointerEvents: "none" }}>
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                style={{
                  strokeDashoffset: 100,
                  animation: "dash 4s linear infinite"
                }}
              />
              {/* Glowing anchor dots along path */}
              {wayfindingPath.map((nodeId, idx) => {
                const node = STADIUM_NODES[nodeId];
                if (!node) return null;
                const isStart = idx === 0;
                const isEnd = idx === wayfindingPath.length - 1;
                
                return (
                  <circle
                    key={`${nodeId}-dot`}
                    cx={node.x}
                    cy={node.y}
                    r={isStart || isEnd ? "7" : "4"}
                    fill={isStart ? "var(--neon-green)" : isEnd ? "var(--neon-cyan)" : "#fff"}
                    stroke="#000"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Popup Overlay (Operational HUD tooltip) */}
        {hoveredNode && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              background: "rgba(10, 11, 16, 0.95)",
              border: "1px solid var(--border-color)",
              padding: "10px 14px",
              borderRadius: "8px",
              boxShadow: "var(--shadow-md)",
              fontSize: "12px",
              pointerEvents: "none",
              zIndex: 10,
              width: "250px",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <p style={{ fontWeight: "700", color: "var(--neon-cyan)", marginBottom: "4px" }}>
              {hoveredNode.label}
            </p>
            {hoveredNode.type === "section" && (
              <>
                <p>Occupancy: <strong>{occupancyData[hoveredNode.id] || 0}%</strong></p>
                <p>Status: {
                  (occupancyData[hoveredNode.id] || 0) >= 95 ? (
                    <span style={{ color: "var(--neon-red)", fontWeight: "600" }}>Peak / Egress Danger</span>
                  ) : (occupancyData[hoveredNode.id] || 0) >= 80 ? (
                    <span style={{ color: "var(--neon-amber)", fontWeight: "600" }}>Busy Queue</span>
                  ) : (
                    <span style={{ color: "var(--neon-green)", fontWeight: "600" }}>Nominal Flow</span>
                  )
                }</p>
              </>
            )}
            {hoveredNode.type === "gate" && (
              <>
                <p>Flow State: <strong>Checkpoints Active</strong></p>
                <p>Wait Time: <strong>{hoveredNode.id === "Gate C" ? "24 mins" : "6 mins"}</strong></p>
              </>
            )}
            {hoveredNode.type === "concession" && (
              <>
                <p>Kitchen Status: <strong>Open</strong></p>
                <p>Wait Time: <strong>8 mins</strong></p>
              </>
            )}
            {hoveredNode.type === "restroom" && (
              <>
                <p>Sanitation Level: <strong>Optimal (98%)</strong></p>
                <p>Wait Time: <strong>2 mins</strong></p>
              </>
            )}
            {activeIncidents.some(inc => inc.location === hoveredNode.id && inc.status !== "Resolved") && (
              <p style={{ color: "var(--neon-red)", fontWeight: "700", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                ⚠️ Active Incident logged
              </p>
            )}
          </div>
        )}
      </div>

      {/* Embedded CSS animation for polyline dash movement */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
