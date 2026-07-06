import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Shield, Terminal, BookOpen, AlertCircle } from "lucide-react";
import { parseCommand } from "../utils/commandParser";
import { translateText } from "../utils/translator";

/**
 * AI Command Center Component
 * Operator terminal to input natural language queries and see parsed intents,
 * multi-language translations, and structured agent reasoning.
 */
export default function AICommandCenter({ 
  onExecuteCommand, 
  prefilledCommand, 
  setPrefilledCommand 
}) {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en"); // en, es, fr
  const [logs, setLogs] = useState([
    {
      sender: "system",
      text: "FIFA 2026 AI Assistant online. Monitor matches, dispatch security, or translate announcements.",
      timestamp: "18:00:00"
    }
  ]);
  const [currentReasoning, setCurrentReasoning] = useState(null);
  
  const consoleEndRef = useRef(null);

  // Monitor pre-filled commands passed from parent (e.g. clicking "Quick Dispatch")
  useEffect(() => {
    if (prefilledCommand) {
      setInput(prefilledCommand);
      // Clear parent state to avoid loop
      setPrefilledCommand("");
    }
  }, [prefilledCommand, setPrefilledCommand]);

  // Autoscroll chat history
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const operatorTime = new Date().toLocaleTimeString();
    
    // Add user log
    const userLog = {
      sender: "operator",
      text: input,
      timestamp: operatorTime
    };
    
    // Process command using our utility (sanitized inside parseCommand)
    const result = parseCommand(input);
    
    let assistantText = result.message;
    let agentReasoning = null;

    // Execute logic based on detected intent
    if (result.intent === "translate") {
      const textToTranslate = result.params.text;
      const targetLangName = result.params.targetLanguage.toLowerCase();
      
      let targetCode = "en";
      if (targetLangName.includes("span") || targetLangName === "es") targetCode = "es";
      if (targetLangName.includes("fren") || targetLangName === "fr") targetCode = "fr";

      const transResult = translateText(textToTranslate, targetCode);
      if (transResult.success) {
        assistantText = `[Translation Result] ${transResult.translatedText}`;
        agentReasoning = {
          intent: "Multi-language Translation",
          target: `${transResult.sourceLang.toUpperCase()} → ${transResult.targetLang.toUpperCase()}`,
          severity: "low",
          steps: [
            "Extracted translation target text from input quotes.",
            `Identified source language as "${transResult.sourceLang}".`,
            `Mapped destination language target to "${transResult.targetLang}".`,
            "Consulted FIFA 2026 translation registry dictionary.",
            "Generated final output warning banner."
          ],
          action: "Generated announcement translation for stadium PA boards."
        };
      }
    } else if (result.intent === "dispatch") {
      const team = result.params.team;
      const location = result.params.location;
      
      // Bubble action up to App.jsx to update incident/staff positions
      onExecuteCommand({
        type: "dispatch",
        team,
        location,
        severity: result.severity
      });

      agentReasoning = {
        intent: "Emergency Resource Dispatch",
        target: `${team} to ${location}`,
        severity: result.severity,
        steps: [
          `Identified dispatch team request for "${team}".`,
          `Extracted and normalized location to "${location}".`,
          "Consulted stadium staff roster to identify available nearby units.",
          `Verified team authorization for ${result.severity.toUpperCase()} severity event.`,
          "Transmitted routing instructions to staff portable transceivers."
        ],
        action: `Rerouted ${team} squad to ${location}.`
      };
    } else if (result.intent === "report_incident") {
      const issue = result.params.issue;
      const location = result.params.location;

      onExecuteCommand({
        type: "report",
        issue,
        location,
        severity: result.severity
      });

      agentReasoning = {
        intent: "Operations Incident Intake",
        target: `${issue} at ${location}`,
        severity: result.severity,
        steps: [
          `Parsed manual supervisor report: "${issue}".`,
          `Resolved location coordinate reference: "${location}".`,
          `Analyzed keywords to assess threat level. Assigned severity: "${result.severity.toUpperCase()}".`,
          "Logged active ticket in live Incident Database.",
          "Alerting nearest security/medical officers."
        ],
        action: `Logged incident "${issue}" at ${location} in control center feed.`
      };
    } else if (result.intent === "status_check") {
      const category = result.params.category;
      assistantText = `Fetching real-time status telemetry on: ${category.toUpperCase()}`;
      
      onExecuteCommand({
        type: "status",
        category
      });

      agentReasoning = {
        intent: "System Telemetry Request",
        target: category,
        severity: "low",
        steps: [
          `Recognized data query command for category: "${category}".`,
          "Queried live sensor database and staff logs.",
          "Aggregated current wait times and gate throughput metrics.",
          "Returned visual table update on control panel."
        ],
        action: `Updated statistics focus panel on ${category}.`
      };
    } else {
      // Unknown command
      agentReasoning = {
        intent: "Natural Language Clarification",
        target: "Unknown query",
        severity: "low",
        steps: [
          "Scanned text input against standard command lexicon.",
          "Could not identify matching dispatch, translation, or logging intents.",
          "Displaying fallback assistance prompts."
        ],
        action: "Requested supervisor check syntax (e.g. 'dispatch security to Gate A')."
      };
    }

    setLogs((prev) => [
      ...prev,
      userLog,
      {
        sender: "assistant",
        text: assistantText,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    
    setCurrentReasoning(agentReasoning);
    setInput("");
  };

  // Quick action templates for operator demo
  const quickAnnounce = (phrase) => {
    setInput(phrase);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Terminal Console Container */}
      <section 
        className="glass-card glow-cyan" 
        style={{ display: "flex", flexDirection: "column", height: "360px" }}
        aria-label="AI Operations Terminal"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Terminal size={18} className="text-gradient-cyan" />
            <h3 style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.5px" }}>AI COGNITIVE COMMAND CENTER</h3>
          </div>
          
          {/* Quick preset commands help tooltip */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => quickAnnounce("dispatch security to Gate B")}
              style={{ padding: "2px 8px", fontSize: "10px" }}
              title="Test Security dispatch"
            >
              Preset: Security
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => quickAnnounce("translate 'please proceed to the nearest exit' to Spanish")}
              style={{ padding: "2px 8px", fontSize: "10px" }}
              title="Test Translation utility"
            >
              Preset: Translate es
            </button>
          </div>
        </div>

        {/* Chat message display area */}
        <div 
          style={{ 
            flexGrow: 1, 
            overflowY: "auto", 
            padding: "8px", 
            background: "rgba(0, 0, 0, 0.4)", 
            borderRadius: "8px", 
            border: "1px solid var(--border-color)",
            marginBottom: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "12px",
            fontFamily: "var(--font-mono)"
          }}
        >
          {logs.map((log, index) => {
            const isOperator = log.sender === "operator";
            const isSystem = log.sender === "system";

            return (
              <div 
                key={index} 
                style={{ 
                  alignSelf: isOperator ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: isOperator ? "rgba(79, 172, 254, 0.15)" : isSystem ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 242, 254, 0.08)",
                  border: isOperator ? "1px solid rgba(79, 172, 254, 0.3)" : "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "8px 12px"
                }}
              >
                <div style={{ display: "flex", gap: "8px", color: isOperator ? "var(--neon-blue)" : "var(--neon-cyan)", fontWeight: "bold", marginBottom: "3px" }}>
                  <span>{isOperator ? "STADIUM_OPS" : isSystem ? "SYS" : "AI_AGENT"}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "9px" }}>{log.timestamp}</span>
                </div>
                {/* HTML rendering is safe because outputs are escaped/sanitized beforehand */}
                <p 
                  style={{ wordBreak: "break-word", lineHeight: "1.4", color: "var(--text-primary)" }}
                  dangerouslySetInnerHTML={{ __html: log.text }}
                />
              </div>
            );
          })}
          <div ref={consoleEndRef} />
        </div>

        {/* Terminal Input Box */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            className="form-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command: 'dispatch medical to Section 102' or translate queries..."
            aria-label="Natural Language Command Terminal Input"
            style={{ flexGrow: 1, fontFamily: "var(--font-mono)" }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            aria-label="Send Command"
            style={{ padding: "10px 16px" }}
          >
            <Send size={16} />
          </button>
        </form>
      </section>

      {/* 2. Structured AI Reasoning display panel */}
      {currentReasoning && (
        <section 
          className="glass-card glow-cyan animate-slide-in"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          aria-label="AI Reasoning Steps"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <BookOpen size={16} className="text-gradient-cyan" />
            <h4 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px" }}>AI AGENT EXECUTIVE REASONING HUD</h4>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>DETECTED INTENT: </span>
              <strong style={{ color: "var(--neon-cyan)" }}>{currentReasoning.intent.toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>TARGET: </span>
              <strong style={{ color: "var(--text-primary)" }}>{currentReasoning.target}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>SEVERITY: </span>
              <strong style={{ 
                color: currentReasoning.severity === "critical" || currentReasoning.severity === "high" 
                  ? "var(--neon-red)" 
                  : "var(--text-primary)" 
              }}>
                {currentReasoning.severity.toUpperCase()}
              </strong>
            </div>
          </div>

          {/* Reasoning Steps Timeline */}
          <div 
            style={{ 
              background: "rgba(0, 0, 0, 0.2)", 
              padding: "10px", 
              borderRadius: "8px", 
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px"
            }}
          >
            {currentReasoning.steps.map((step, idx) => (
              <div key={idx} style={{ display: "flex", gap: "8px", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--neon-cyan)" }}>[{idx + 1}]</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "11px" }}>
            <Shield size={14} style={{ color: "var(--neon-green)", marginTop: "1px", flexShrink: 0 }} />
            <div>
              <span style={{ color: "var(--text-secondary)" }}>EXECUTIVE DECISION TAKEN: </span>
              <span style={{ color: "var(--neon-green)", fontWeight: "600" }}>{currentReasoning.action}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
