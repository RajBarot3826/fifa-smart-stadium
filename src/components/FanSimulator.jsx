import React, { useState } from "react";
import { 
  Compass, 
  Utensils, 
  MessageSquare, 
  MapPin, 
  Navigation,
  Globe,
  CheckCircle,
  Clock,
  Phone
} from "lucide-react";
import { findShortestPath, STADIUM_NODES } from "../utils/pathFinder";
import { translateText } from "../utils/translator";

/**
 * Fan Simulator Component
 * Renders a side-by-side mock mobile phone interface containing wayfinding,
 * concession ordering, and a multi-lingual support chatbot.
 */
export default function FanSimulator({ onPathCalculated }) {
  const [activeTab, setActiveTab] = useState("navigation"); // navigation, concessions, chat
  
  // Navigation States
  const [startLoc, setStartLoc] = useState("Gate A");
  const [endLoc, setEndLoc] = useState("Sec 105");
  const [routeInfo, setRouteInfo] = useState(null);

  // Concessions States
  const [cart, setCart] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pickupTimer, setPickupTimer] = useState(null);

  // Chat States
  const [chatLanguage, setChatLanguage] = useState("en"); // en, es, fr
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Welcome! Ask me for directions or stadium details.", lang: "en" }
  ]);

  // Menu items list (Zero placeholders, World Cup themed)
  const menuItems = [
    { id: "hotdog", name: "Grand Hotdog (US)", price: 8.50, time: 5 },
    { id: "tacos", name: "Tacos al Pastor (MX)", price: 9.00, time: 8 },
    { id: "poutine", name: "Maple Poutine (CA)", price: 8.00, time: 6 },
    { id: "drink", name: "Coca-Cola Original", price: 4.50, time: 2 }
  ];

  // 1. Wayfinding route calculation
  const handleCalculateRoute = () => {
    const route = findShortestPath(startLoc, endLoc);
    if (route.success) {
      setRouteInfo(route);
      // Trigger parent handler to draw the polyline overlay on the SVG Map
      onPathCalculated(route.path);
    }
  };

  // 2. Concession food ordering
  const updateCart = (itemId, change) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [itemId]: next };
    });
  };

  const handlePlaceOrder = () => {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) return;

    setOrderPlaced(true);
    // Simulate order ready in 6 seconds
    setPickupTimer(6);
    const interval = setInterval(() => {
      setPickupTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 3. Fan Support Chatbot
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Determine chatbot response based on user input
    setTimeout(() => {
      let responseText = "";
      const lower = userMsg.toLowerCase();

      // Multi-lingual support answers matching translator dictionary and queries
      if (chatLanguage === "es") {
        if (lower.includes("baño") || lower.includes("restroom") || lower.includes("donde")) {
          responseText = "Los baños más cercanos se encuentran detrás de la Sección 101 y la Sección 105.";
        } else if (lower.includes("puerta") || lower.includes("gate")) {
          responseText = "Para llegar a la Puerta A, siga el pasillo norte pasando la Sección 101.";
        } else {
          responseText = translateText(userMsg, "es").translatedText;
        }
      } else if (chatLanguage === "fr") {
        if (lower.includes("toilette") || lower.includes("restroom") || lower.includes("ou")) {
          responseText = "Les toilettes les plus proches se trouvent derrière la section 101 et la section 105.";
        } else if (lower.includes("porte") || lower.includes("gate")) {
          responseText = "Pour vous rendre à la Porte A, suivez le couloir nord après la section 101.";
        } else {
          responseText = translateText(userMsg, "fr").translatedText;
        }
      } else {
        // English
        if (lower.includes("restroom") || lower.includes("toilet")) {
          responseText = "The nearest restrooms are located behind Section 101 and Section 105.";
        } else if (lower.includes("gate")) {
          responseText = "To get to Gate A, follow the north corridor path past Section 101.";
        } else if (lower.includes("ticket")) {
          responseText = "Your mobile ticket is already validated. Have a great match!";
        } else {
          responseText = "I'm here to assist. Ask about restrooms, gates, or concessions.";
        }
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: responseText }]);
    }, 800);
  };

  // Language translation helper for chat header
  const getChatWelcome = () => {
    if (chatLanguage === "es") return "Soporte de IA de la Copa Mundial";
    if (chatLanguage === "fr") return "Support d'IA de la Coupe du Monde";
    return "World Cup Fan AI Support";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* 3D Mobile Phone Frame wrapper (WOW Design) */}
      <section 
        className="phone-wrapper" 
        style={{
          width: "320px",
          height: "640px",
          borderRadius: "36px",
          border: "12px solid #1e293b", // Slate phone bezel
          background: "#0f172a", // Dark background inside app
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), var(--glow-cyan)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }}
        aria-label="Fan Companion App Simulator"
      >
        {/* Smartphone Camera Notch */}
        <div style={{
          width: "110px",
          height: "18px",
          background: "#1e293b",
          borderRadius: "0 0 12px 12px",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50
        }}></div>

        {/* Mobile App Header */}
        <div style={{
          background: "linear-gradient(to right, #1e293b, #0f172a)",
          borderBottom: "1px solid var(--border-color)",
          padding: "24px 16px 10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Phone size={14} className="text-gradient-cyan" />
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "#f8fafc" }}>
              UNITED 2026 APP
            </span>
          </div>
          <span className="logo-badge" style={{ fontSize: "8px", padding: "1px 5px" }}>FAN</span>
        </div>

        {/* Mobile Screen Display Viewport */}
        <div style={{ flexGrow: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column" }}>
          
          {/* TAB 1: WAYFINDING NAVIGATION */}
          {activeTab === "navigation" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>3D WAYFINDING NAVIGATION</h4>
              
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>CURRENT LOCATION</label>
                  <select 
                    value={startLoc} 
                    onChange={(e) => setStartLoc(e.target.value)}
                    style={{ background: "#1e293b", color: "#fff", border: "1px solid var(--border-color)", width: "100%", padding: "6px", borderRadius: "6px", fontSize: "12px" }}
                  >
                    {Object.keys(STADIUM_NODES).map(key => (
                      <option key={key} value={key}>{STADIUM_NODES[key].label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>DESTINATION</label>
                  <select 
                    value={endLoc} 
                    onChange={(e) => setEndLoc(e.target.value)}
                    style={{ background: "#1e293b", color: "#fff", border: "1px solid var(--border-color)", width: "100%", padding: "6px", borderRadius: "6px", fontSize: "12px" }}
                  >
                    {Object.keys(STADIUM_NODES).map(key => (
                      <option key={key} value={key}>{STADIUM_NODES[key].label}</option>
                    ))}
                  </select>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleCalculateRoute}
                  style={{ width: "100%", justifyContent: "center", padding: "8px 0", fontSize: "12px", color: "#000" }}
                >
                  <Navigation size={14} /> Calculate Route
                </button>
              </div>

              {/* Path Routing Output directions */}
              {routeInfo && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0, 242, 254, 0.05)", border: "1px solid rgba(0, 242, 254, 0.2)", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", borderBottom: "1px solid var(--border-color)", paddingBottom: "4px" }}>
                    <span style={{ color: "var(--neon-cyan)" }}>{routeInfo.distance} meters</span>
                    <span style={{ color: "var(--text-secondary)" }}>Est. Walk: {Math.round(routeInfo.distance / 80)} mins</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto", fontSize: "11px", paddingRight: "4px" }}>
                    {routeInfo.directions.map((step, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "6px" }}>
                        <MapPin size={10} style={{ marginTop: "3px", color: "var(--neon-cyan)", flexShrink: 0 }} />
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONCESSIONS ORDERING */}
          {activeTab === "concessions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>EXPRESS CONCESSION CART</h4>
              
              {!orderPlaced ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {menuItems.map(item => (
                      <div 
                        key={item.id} 
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center", 
                          background: "rgba(255,255,255,0.02)", 
                          padding: "8px 10px", 
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                          fontSize: "11px"
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "700" }}>{item.name}</p>
                          <span style={{ color: "var(--text-secondary)" }}>${item.price.toFixed(2)} | Wait: {item.time}m</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => updateCart(item.id, -1)}
                            style={{ padding: "2px 6px", fontSize: "10px" }}
                          >-</button>
                          <span style={{ fontWeight: "bold" }}>{cart[item.id] || 0}</span>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => updateCart(item.id, 1)}
                            style={{ padding: "2px 6px", fontSize: "10px" }}
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={Object.values(cart).reduce((a,b)=>a+b, 0) === 0}
                    style={{ width: "100%", justifyContent: "center", padding: "8px 0", fontSize: "12px", color: "#000", marginTop: "8px" }}
                  >
                    <CheckCircle size={14} /> Place Express Order
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <CheckCircle size={40} style={{ color: "var(--neon-green)" }} />
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700" }}>ORDER PLACED</h5>
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Scan QR at Pickup Concession counter when ready.
                    </p>
                  </div>

                  {pickupTimer > 0 ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 204, 0, 0.1)", border: "1px solid rgba(255, 204, 0, 0.2)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", color: "var(--neon-amber)" }}>
                      <Clock size={12} />
                      <span>Readying order in {pickupTimer}s...</span>
                    </div>
                  ) : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 245, 160, 0.1)", border: "1px solid rgba(0, 245, 160, 0.2)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", color: "var(--neon-green)", animation: "pulse-glow-cyan 2s infinite" }}>
                      <span>🍔 ORDER READY FOR PICKUP</span>
                    </div>
                  )}

                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setCart({});
                      setOrderPlaced(false);
                    }}
                    style={{ padding: "6px 12px", fontSize: "11px", marginTop: "12px" }}
                  >
                    Order Something Else
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAN SUPPORT CHATBOT */}
          {activeTab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "400px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#f1f5f9" }}>{getChatWelcome()}</h4>
                
                {/* Language switcher */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Globe size={11} style={{ color: "var(--neon-cyan)" }} />
                  <select
                    value={chatLanguage}
                    onChange={(e) => setChatLanguage(e.target.value)}
                    style={{ background: "transparent", color: "var(--neon-cyan)", border: "none", fontSize: "10px", outline: "none", fontWeight: "bold" }}
                  >
                    <option value="en" style={{ background: "#0f172a" }}>EN</option>
                    <option value="es" style={{ background: "#0f172a" }}>ES</option>
                    <option value="fr" style={{ background: "#0f172a" }}>FR</option>
                  </select>
                </div>
              </div>

              {/* Chat messages */}
              <div style={{ flexGrow: 1, overflowY: "auto", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "8px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", marginBottom: "8px" }}>
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "rgba(79, 172, 254, 0.2)" : "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-color)",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      maxWidth: "85%",
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    chatLanguage === "es" ? "Preguntar: '¿Dónde está el baño?'" :
                    chatLanguage === "fr" ? "Poser: 'Où se trouvent les toilettes?'" :
                    "Ask: 'Where is the restroom?'..."
                  }
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    color: "#fff",
                    fontSize: "11px",
                    flexGrow: 1
                  }}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: "6px 10px" }}
                >
                  Go
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Smartphone Tab Bar (Navigation Controls) */}
        <div 
          role="tablist"
          style={{
            background: "#1e293b",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0 16px 0",
            zIndex: 40
          }}
        >
          <button 
            role="tab"
            aria-selected={activeTab === "navigation"}
            onClick={() => setActiveTab("navigation")}
            style={{ background: "transparent", border: "none", color: activeTab === "navigation" ? "var(--neon-cyan)" : "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
            aria-label="Open Navigation tab"
          >
            <Compass size={16} />
            <span style={{ fontSize: "9px", fontWeight: "600" }}>Wayfinding</span>
          </button>

          <button 
            role="tab"
            aria-selected={activeTab === "concessions"}
            onClick={() => setActiveTab("concessions")}
            style={{ background: "transparent", border: "none", color: activeTab === "concessions" ? "var(--neon-cyan)" : "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
            aria-label="Open Concessions Ordering tab"
          >
            <Utensils size={16} />
            <span style={{ fontSize: "9px", fontWeight: "600" }}>Express Concessions</span>
          </button>

          <button 
            role="tab"
            aria-selected={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
            style={{ background: "transparent", border: "none", color: activeTab === "chat" ? "var(--neon-cyan)" : "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
            aria-label="Open Fan Support Chat tab"
          >
            <MessageSquare size={16} />
            <span style={{ fontSize: "9px", fontWeight: "600" }}>AI Assistant</span>
          </button>
        </div>

        {/* Smartphone Bottom Home Indicator Line */}
        <div style={{
          width: "90px",
          height: "3px",
          background: "#64748b",
          borderRadius: "99px",
          position: "absolute",
          bottom: "4px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none"
        }}></div>
      </section>
    </div>
  );
}
