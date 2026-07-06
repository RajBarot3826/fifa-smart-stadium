/**
 * @fileoverview Command parser for AI Command Center.
 * Parses natural language commands into structured intents, parameters, and severity.
 */

/**
 * Sanitizes HTML to prevent XSS or command injection.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Parses natural language queries into structured operator commands.
 *
 * @param {string} rawInput - The raw natural language command from the operator
 * @returns {Object} Structured command object
 */
export function parseCommand(rawInput) {
  if (!rawInput || !rawInput.trim()) {
    return {
      intent: "unknown",
      params: {},
      severity: "low",
      message: "Empty command received."
    };
  }

  const cleanRaw = rawInput.trim();
  const lowercase = cleanRaw.toLowerCase();

  // 1. Translation Intent (match first to avoid being intercepted)
  // e.g. translate 'Emergency in progress' to Spanish
  const translateMatch = cleanRaw.match(/(?:translate|traducir|traduire)\s+['"«](.+?)['"»]\s+(?:to|into|al|en|a)\s+(\w+)/i);
  if (translateMatch) {
    return {
      intent: "translate",
      params: {
        text: sanitizeInput(translateMatch[1]),
        targetLanguage: sanitizeInput(translateMatch[2])
      },
      severity: "low",
      message: `Translate request detected for target language: ${sanitizeInput(translateMatch[2])}`
    };
  }

  // 2. Dispatch Intent
  // e.g. "dispatch security to Gate B", "send medical to Section 102"
  const dispatchMatch = lowercase.match(/(?:dispatch|send|enviar|deploy|deployer)\s+(\w+)\s+(?:to|a|en|vers)\s+(gate\s+[a-d]|sec\s+\d+|section\s+\d+|concession\s+\d+|restroom\s+[a-d])/i);
  if (dispatchMatch) {
    const team = dispatchMatch[1];
    let location = dispatchMatch[2];
    
    // Normalize location names
    if (location.startsWith("section")) {
      location = location.replace("section", "Sec");
    } else if (location.startsWith("sec ")) {
      location = location.replace("sec ", "Sec ");
    } else if (location.startsWith("gate ")) {
      const parts = location.split(" ");
      location = `Gate ${parts[1].toUpperCase()}`;
    } else if (location.startsWith("restroom ")) {
      const parts = location.split(" ");
      location = `Restroom ${parts[1].toUpperCase()}`;
    } else if (location.startsWith("concession ")) {
      const parts = location.split(" ");
      location = `Concession ${parts[1]}`;
    }

    let severity = "low";
    if (team.includes("security") || team.includes("police")) severity = "high";
    if (team.includes("medical") || team.includes("doctor") || team.includes("ambulance")) severity = "critical";

    return {
      intent: "dispatch",
      params: {
        team: sanitizeInput(team.charAt(0).toUpperCase() + team.slice(1)),
        location: sanitizeInput(location)
      },
      severity: severity,
      message: `Dispatching ${sanitizeInput(team)} unit to ${sanitizeInput(location)}.`
    };
  }

  // 3. Report Incident Intent (checked BEFORE status check, to avoid catching 'report' keyword)
  // e.g. "report a fire near section 105", "alert: fight in restroom b"
  const reportMatch = lowercase.match(/(?:report|alert|incident|danger)\s+(.+?)\s+(?:at|in|near|on|inside|around)\s+(gate\s+[a-d]|sec\s+\d+|section\s+\d+|concession\s+\d+|restroom\s+[a-d])/i);
  if (reportMatch) {
    let issue = reportMatch[1].trim();
    let location = reportMatch[2];

    // Strip leading articles (a, an, the) to make issue identification clean
    issue = issue.replace(/^(a|an|the)\s+/i, "");

    // Normalize location
    if (location.startsWith("section")) {
      location = location.replace("section", "Sec");
    } else if (location.startsWith("sec ")) {
      location = location.replace("sec ", "Sec ");
    } else if (location.startsWith("gate ")) {
      const parts = location.split(" ");
      location = `Gate ${parts[1].toUpperCase()}`;
    } else if (location.startsWith("restroom ")) {
      const parts = location.split(" ");
      location = `Restroom ${parts[1].toUpperCase()}`;
    } else if (location.startsWith("concession ")) {
      const parts = location.split(" ");
      location = `Concession ${parts[1]}`;
    }

    let severity = "low";
    if (issue.includes("fight") || issue.includes("fire") || issue.includes("weapon") || issue.includes("smoke")) {
      severity = "critical";
    } else if (issue.includes("crowd") || issue.includes("congestion") || issue.includes("accident") || issue.includes("injur")) {
      severity = "high";
    } else if (issue.includes("leak") || issue.includes("spill") || issue.includes("trash") || issue.includes("light")) {
      severity = "medium";
    }

    return {
      intent: "report_incident",
      params: {
        issue: sanitizeInput(issue),
        location: sanitizeInput(location)
      },
      severity: severity,
      message: `Logging incident: "${sanitizeInput(issue)}" at ${sanitizeInput(location)} with ${severity} severity.`
    };
  }

  // 4. Status Inquiry Intent
  if (lowercase.includes("status") || lowercase.includes("check") || lowercase.includes("show") || lowercase.includes("get") || lowercase.includes("view")) {
    let category = "stadium";
    if (lowercase.includes("gate")) category = "gates";
    else if (lowercase.includes("concession") || lowercase.includes("food")) category = "concessions";
    else if (lowercase.includes("restroom") || lowercase.includes("toilet")) category = "restrooms";
    else if (lowercase.includes("incident") || lowercase.includes("alert")) category = "incidents";
    else if (lowercase.includes("security")) category = "security";

    return {
      intent: "status_check",
      params: {
        category
      },
      severity: "low",
      message: `Requesting status update on ${category}.`
    };
  }

  // Fallback / Unknown Command
  return {
    intent: "unknown",
    params: {
      rawQuery: sanitizeInput(cleanRaw)
    },
    severity: "low",
    message: "Command not recognized. Please use standard dispatch, status, translation, or report keywords."
  };
}
