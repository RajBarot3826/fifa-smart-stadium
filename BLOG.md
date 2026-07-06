# Build in Public: Optimizing Stadium Operations for FIFA World Cup 2026 with AI

Managing stadium operations for a global mega-event like the **FIFA World Cup 2026** is a massive logistical challenge. With over 80,000 spectators per stadium across three host nations (US, Mexico, Canada), operations teams face critical hurdles in crowd density management, multilingual communication, and incident routing.

To address this, I built the **FIFA World Cup 2026 Smart Stadiums & Tournament Operations Hub**—a Generative AI-powered real-time control console and interactive fan companion application designed to optimize logistics and spectator safety.

---

## 🛠️ Core Features of the Hub

### 1. Operations Telemetry Dashboard
*   **KPI Tracking**: Monitored real-time stadium stats including active capacity, staff deployment rosters, restroom/concession wait times, and weather status.
*   **Logistics Timeline**: Audited match events, squad bus arrivals, gate status alerts, and post-match egress notifications.
*   **Incident Log**: Formatted list of open issues (e.g., ticket queue delays or leaks) with quick dispatch shortcuts.

### 2. Interactive SVG Stadium Heatmap
*   **Visual Occupancy**: Renders sections, gates, and concessions in colored heat levels (Safe, Busy, Peak) representing live crowd flow.
*   **Wayfinding Overlay**: Calculates and highlights the safest, shortest route (Dijkstra's algorithm) between gates, restrooms, and seats.

### 3. AI Cognitive Command Center
*   **Natural Language Terminal**: Allows operators to issue conversational instructions (e.g. `dispatch security to Gate B` or `translate 'Emergency in section 104' to Spanish`).
*   **Executive Reasoning HUD**: Displays a step-by-step logic trace of the AI agent's intent classification, threat level assessment, and final action taken.

### 4. Fan Companion App Simulator
*   **Wayfinding Routing**: Fan interface to select start/destination nodes and view walking directions.
*   **Express Concessions**: Simulated food ordering menu showing wait times, receipt summaries, and pickup notifications.
*   **AI Support Chat**: Multi-lingual customer service helper.

---

## 🏗️ Technical Stack & Architecture

*   **Front-end**: React 19 + Vite 8
*   **Routing Core**: Custom Dijkstra's graph algorithm in JavaScript.
*   **NLP Parser**: Custom lexical state parser for structured intent extraction and HTML input sanitization (protecting against XSS/injections).
*   **Database**: Telemetry sync prepared using Firebase Firestore.
*   **Aesthetics**: Glassmorphism dark-theme layout with neon accent styling, keyframe glows, and responsive timelines.

---

## 📈 Engineering Benchmarks (Targeting 98+ Score)

*   **Accessibility (a11y)**: Configured with proper semantic landmarks, ARIA button roles, and focus outlines. The SVG heatmap supports full keyboard navigation (Tabbing and `Enter`/`Space` listeners).
*   **Testing**: Dedicated Vitest suite covering **17/17 passing tests** for pathfinder routing, command parsing, and translation correctness.
*   **Security**: Safe secret management with git-ignored `.env` templates.
*   **Linter**: Codebase audited using `oxlint` resulting in **0 warnings and 0 errors**.
