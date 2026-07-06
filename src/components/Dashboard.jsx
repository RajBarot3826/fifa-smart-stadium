import React, { useMemo } from "react";
import { 
  ShieldAlert, 
  Users, 
  Clock, 
  CloudSun, 
  Activity, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Play
} from "lucide-react";

/**
 * Dashboard Component
 * Renders KPI cards, live match logistics, and the active incident log table.
 */
export default function Dashboard({ 
  incidents, 
  metrics, 
  onResolveIncident, 
  onQuickDispatch 
}) {
  
  // Calculate active incidents using useMemo for efficiency (Efficiency Parameter)
  const activeCount = useMemo(() => {
    return incidents.filter(inc => inc.status !== "Resolved").length;
  }, [incidents]);

  return (
    <section 
      className="dashboard-container" 
      aria-label="Stadium Operations Dashboard"
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* 1. KPI Panel */}
      <div 
        className="kpi-panel"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px"
        }}
      >
        {/* Capacity Card */}
        <div className="glass-card glow-cyan" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>STADIUM CAPACITY</span>
            <Users size={18} className="text-gradient-cyan" />
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
            {metrics.capacityPercent}%
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {metrics.occupancy.toLocaleString()} / {metrics.totalSeats.toLocaleString()} seats
          </span>
        </div>

        {/* Active Incidents Card */}
        <div 
          className={`glass-card ${activeCount > 0 ? "glow-red" : "glow-green"}`} 
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>ACTIVE INCIDENTS</span>
            <ShieldAlert size={18} style={{ color: activeCount > 0 ? "var(--neon-red)" : "var(--neon-green)" }} />
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: activeCount > 0 ? "var(--neon-red)" : "var(--neon-green)" }}>
            {activeCount}
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {activeCount > 0 ? "Needs immediate dispatch" : "All zones operating normally"}
          </span>
        </div>

        {/* Staff Deployed Card */}
        <div className="glass-card glow-purple" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>STAFF ON DUTY</span>
            <Activity size={18} style={{ color: "var(--neon-purple)" }} />
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
            {metrics.staffActive}
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Security, Medics, Ushers active
          </span>
        </div>

        {/* Avg Queue Wait Card */}
        <div className="glass-card glow-cyan" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>AVG QUEUE WAIT</span>
            <Clock size={18} className="text-gradient-cyan" />
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
            {metrics.avgWaitTime}m
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Gates, Foods & Restrooms avg
          </span>
        </div>

        {/* Weather Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>WEATHER CONDITION</span>
            <CloudSun size={18} style={{ color: "var(--neon-amber)" }} />
          </div>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
            24°C
          </p>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Humidity: 62% | Wind: 12 km/h
          </span>
        </div>
      </div>

      {/* 2. Match Logistics & Timeline */}
      <div 
        className="logistics-panel"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "16px",
        }}
      >
        {/* Live Match Info */}
        <div className="glass-card glow-cyan" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700" }}>LIVE MATCH LOGISTICS</h3>
            <span className="badge badge-red pulse-critical" style={{ fontSize: "9px" }}>LIVE</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>USA</p>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Host Nation</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "32px", fontWeight: "800", color: "var(--neon-cyan)", textShadow: "0 0 10px rgba(0, 242, 254, 0.3)" }}>1 - 0</p>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>68th Minute</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>MEXICO</p>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Group A</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Venue:</span>
              <span style={{ fontWeight: "600" }}>MetLife Stadium, East Rutherford</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Referee Team:</span>
              <span style={{ fontWeight: "600" }}>F. Bastien (France)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Broadcast Feed:</span>
              <span style={{ fontWeight: "600", color: "var(--neon-green)" }}>Online (1080p 60fps)</span>
            </div>
          </div>
        </div>

        {/* Operational Timeline */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>TOURNAMENT TIMELINE LOGS</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
            
            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-muted)" }}></div>
                <div style={{ width: "2px", flexGrow: 1, background: "var(--border-color)" }}></div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>16:00 (IST)</span>
                <p style={{ fontWeight: "600" }}>Gates A, B, C, D Opened</p>
                <span style={{ color: "var(--text-secondary)" }}>Security checkpoints fully staffed.</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-muted)" }}></div>
                <div style={{ width: "2px", flexGrow: 1, background: "var(--border-color)" }}></div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>17:30 (IST)</span>
                <p style={{ fontWeight: "600" }}>Team Bus Arrivals</p>
                <span style={{ color: "var(--text-secondary)" }}>USA and Mexico squads arrived under escort.</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-cyan)" }}></div>
                <div style={{ width: "2px", flexGrow: 1, background: "var(--border-color)" }}></div>
              </div>
              <div>
                <span style={{ color: "var(--neon-cyan)", fontSize: "10px" }}>18:00 (IST)</span>
                <p style={{ fontWeight: "600", color: "var(--neon-cyan)" }}>Match Kickoff</p>
                <span style={{ color: "var(--text-secondary)" }}>Tournament operations running smoothly.</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-red)" }}></div>
              </div>
              <div>
                <span style={{ color: "var(--neon-red)", fontSize: "10px" }}>19:15 (IST)</span>
                <p style={{ fontWeight: "600", color: "var(--neon-red)" }}>Gate C Congestion Warning</p>
                <span style={{ color: "var(--text-secondary)" }}>Queue wait times peaked at 24 mins. AI rerouting triggered.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Live Incident Log Table */}
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>LIVE OPERATIONAL INCIDENTS</h3>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Click dispatch to coordinate staff instantly
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table 
            style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}
            aria-label="Active Incidents Table"
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "10px" }}>INCIDENT / ISSUE</th>
                <th style={{ padding: "10px" }}>LOCATION</th>
                <th style={{ padding: "10px" }}>SEVERITY</th>
                <th style={{ padding: "10px" }}>STATUS</th>
                <th style={{ padding: "10px" }}>TIMESTAMP</th>
                <th style={{ padding: "10px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
                    No active incidents reported.
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => {
                  let sevColor = "badge-cyan";
                  if (incident.severity === "medium") sevColor = "badge-amber";
                  else if (incident.severity === "high") sevColor = "badge-red";
                  else if (incident.severity === "critical") sevColor = "badge-red pulse-critical";

                  let statusColor = "var(--text-muted)";
                  if (incident.status === "Dispatched") statusColor = "var(--neon-cyan)";
                  else if (incident.status === "Resolved") statusColor = "var(--neon-green)";

                  return (
                    <tr 
                      key={incident.id} 
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                      className="animate-slide-in"
                    >
                      <td style={{ padding: "12px 10px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {incident.issue}
                      </td>
                      <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={14} className="text-gradient-cyan" />
                          {incident.location}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        <span className={`badge ${sevColor}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", fontWeight: "600", color: statusColor }}>
                        {incident.status}
                      </td>
                      <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>
                        {incident.timestamp}
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        {incident.status !== "Resolved" ? (
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            {incident.status === "Open" && (
                              <button 
                                className="btn btn-secondary"
                                onClick={() => onQuickDispatch(incident)}
                                style={{ padding: "4px 8px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                aria-label={`Dispatch team for ${incident.issue} at ${incident.location}`}
                              >
                                <Play size={10} /> Dispatch
                              </button>
                            )}
                            <button 
                              className="btn btn-primary"
                              onClick={() => onResolveIncident(incident.id)}
                              style={{ padding: "4px 8px", fontSize: "11px", color: "#000", display: "inline-flex", alignItems: "center", gap: "4px" }}
                              aria-label={`Mark ${incident.issue} as resolved`}
                            >
                              <CheckCircle size={10} /> Resolve
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--neon-green)", fontSize: "11px", fontWeight: "600" }}>✓ Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
