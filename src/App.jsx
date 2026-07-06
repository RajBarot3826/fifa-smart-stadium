import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import InteractiveMap from "./components/InteractiveMap";
import AICommandCenter from "./components/AICommandCenter";
import FanSimulator from "./components/FanSimulator";
import { Compass, ShieldAlert, Heart, Calendar } from "lucide-react";

/**
 * FIFA World Cup 2026 Smart Stadiums & Tournament Operations Hub
 * Main Application Component managing shared states: incidents, metrics, wayfinding paths,
 * and operator command interactions.
 */
function App() {
  // Initial active incident log state
  const [incidents, setIncidents] = useState([
    {
      id: "inc-001",
      issue: "Crowd congestion peak",
      location: "Gate C",
      severity: "high",
      status: "Open",
      timestamp: "18:45:02"
    },
    {
      id: "inc-002",
      issue: "Minor plumbing leak",
      location: "Restroom B",
      severity: "medium",
      status: "Open",
      timestamp: "19:02:11"
    },
    {
      id: "inc-003",
      issue: "Ticket verification delay",
      location: "Gate D",
      severity: "low",
      status: "Dispatched",
      timestamp: "19:08:44"
    }
  ]);

  // Initial stadium occupancy metrics
  const [occupancyData, setOccupancyData] = useState({
    "Sec 101": 74,
    "Sec 102": 89,
    "Sec 103": 96, // Near Peak
    "Sec 104": 62,
    "Sec 105": 58,
    "Sec 106": 45,
    "Sec 107": 81,
    "Sec 108": 78
  });

  // Global telemetry statistics
  const [metrics, setMetrics] = useState({
    capacityPercent: 94,
    occupancy: 78540,
    totalSeats: 82500,
    staffActive: 412,
    avgWaitTime: 8
  });

  // Share calculated path overlay between Fan Simulator and SVG Map
  const [wayfindingPath, setWayfindingPath] = useState([]);

  // Comm channel to pre-fill the AI command center text area
  const [prefilledCommand, setPrefilledCommand] = useState("");

  // Resolves an incident from the log feed
  const handleResolveIncident = (incidentId) => {
    setIncidents(prev => 
      prev.map(inc => inc.id === incidentId ? { ...inc, status: "Resolved" } : inc)
    );
    
    // Dynamically adjust stats down
    setMetrics(prev => ({
      ...prev,
      avgWaitTime: Math.max(3, prev.avgWaitTime - 1)
    }));
  };

  // Pre-populates the command console
  const handleQuickDispatch = (incident) => {
    const teamType = incident.severity === "high" || incident.severity === "critical" ? "security" : "medical";
    setPrefilledCommand(`dispatch ${teamType} to ${incident.location}`);
  };

  // Executes operations triggered by the AI assistant parser
  const handleExecuteCommand = (command) => {
    const timestamp = new Date().toLocaleTimeString();

    if (command.type === "dispatch") {
      // Find matching incident at location and mark as dispatched
      setIncidents(prev => {
        const index = prev.findIndex(
          inc => inc.location === command.location && inc.status === "Open"
        );
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: "Dispatched" };
          return updated;
        }
        return prev;
      });

      // Update staff deployment metrics
      setMetrics(prev => ({
        ...prev,
        staffActive: prev.staffActive + 4
      }));
    } else if (command.type === "report") {
      // Add a newly reported incident from NL Command Center
      const newInc = {
        id: `inc-${Date.now()}`,
        issue: command.issue,
        location: command.location,
        severity: command.severity,
        status: "Open",
        timestamp
      };

      setIncidents(prev => [newInc, ...prev]);

      // Dynamically raise average wait time slightly due to disruptions
      setMetrics(prev => ({
        ...prev,
        avgWaitTime: Math.min(30, prev.avgWaitTime + 2)
      }));
    }
  };

  // Handles clicking a node in the interactive SVG Heatmap
  const handleSelectLocation = (locationId) => {
    // Fill AI Assistant with a status query automatically
    setPrefilledCommand(`check status of ${locationId}`);
  };

  return (
    <main className="app-container">
      {/* Accessible Header */}
      <header className="app-header" role="banner">
        <div className="header-logo">
          <Compass size={28} className="text-gradient-cyan animate-pulse" />
          <div>
            <h1>FIFA World Cup 2026</h1>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "600" }}>
              Smart Stadiums & Operations Control Hub
            </span>
          </div>
        </div>

        <div className="header-actions">
          {/* Status ticker */}
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} className="text-gradient-cyan" />
              Match 12: Group A
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldAlert size={14} style={{ color: "var(--neon-green)" }} />
              Telemetry Online
            </span>
          </div>
          <span className="logo-badge">Host City: MetLife</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="app-layout">
        
        {/* Left Column: Operations Dashboard & Live Map */}
        <section 
          className="left-column" 
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          aria-label="Operations Control"
        >
          <Dashboard 
            incidents={incidents}
            metrics={metrics}
            onResolveIncident={handleResolveIncident}
            onQuickDispatch={handleQuickDispatch}
          />
          <InteractiveMap 
            occupancyData={occupancyData}
            activeIncidents={incidents}
            wayfindingPath={wayfindingPath}
            onSelectLocation={handleSelectLocation}
          />
        </section>

        {/* Right Column: AI Terminal Command Center & Fan Simulator */}
        <section 
          className="right-column" 
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          aria-label="Simulation Interfaces"
        >
          <AICommandCenter 
            onExecuteCommand={handleExecuteCommand}
            prefilledCommand={prefilledCommand}
            setPrefilledCommand={setPrefilledCommand}
          />
          
          <div className="glass-card glow-purple" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700" }}>FIFA 2026 FAN EXPERIENCE COMPANION</h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Simulate wayfinding navigation, food ordering, and multilingual AI support chat from a spectator perspective.
              </span>
            </div>
            <FanSimulator 
              onPathCalculated={(path) => setWayfindingPath(path)}
            />
          </div>
        </section>

      </div>
    </main>
  );
}

export default App;
