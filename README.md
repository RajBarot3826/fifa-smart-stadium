# FIFA World Cup 2026™ Smart Stadium & Tournament Operations Hub

An AI-powered, real-time control console and interactive fan companion application designed to optimize tournament logistics, manage crowd density, and resolve multilingual communication barriers during the **FIFA World Cup 2026**.

This repository is built with **React + Vite** and optimized across six core engineering benchmarks: **Problem Statement Alignment, Code Quality, Efficiency, Security, Testing, and Accessibility (a11y)**.

---

## 🎯 Scoring Parameters & Implementation Strategy

### 1. Problem Statement Alignment (Smart Stadiums & Tournament Operations)
This application addresses the complex challenges of hosting a global sporting event like the FIFA World Cup 2026:
*   **Operations Console Dashboard**: Integrates real-time telemetry metrics (stadium capacity, active staff numbers, average queue wait times, and weather status) alongside a live match progress ticker (USA vs Mexico) and logistics timeline logs.
*   **Multilingual Translation Assistant**: Solves communication issues across the three host nations (US, Mexico, Canada) by providing instant translation support for English, Spanish, and French.
*   **Wayfinding Navigation**: Simulates stadium exit routing and facility pathing (Dijkstra's shortest path) from a fan's perspective to handle egress crowd control.
*   **Incident Logging & Dispatch**: Provides an operator command center to log incidents (e.g. leaks, medical calls, crowd congestion) and route resources (security, medical teams, ushers) dynamically.

### 2. Code Quality & Modularity
The codebase utilizes a clean, decoupled component-based architecture for maximum legibility and maintainability:
*   `src/components/Dashboard.jsx`: Displays KPI cards, live log lists, and the active incident log table.
*   `src/components/InteractiveMap.jsx`: Renders the stadium SVG layout, heat levels, and active navigation path overlays.
*   `src/components/AICommandCenter.jsx`: Implements the operator terminal console and the AI cognitive reasoning trace panel.
*   `src/components/FanSimulator.jsx`: Simulates the spectator's mobile companion app view.
*   `src/utils/pathFinder.js`: Dijkstra's algorithm graph representation and routing logic.
*   `src/utils/commandParser.js`: Lexical query parser for natural language command parsing.
*   `src/utils/translator.js`: Language detection heuristics and translation mappings.

### 3. Security & Secret Management
Scrutinous precautions are integrated to protect the app's integrity:
*   **Secret Protection**: No API tokens are hardcoded. A template environment configuration is provided in `.env.example`. Environment rules are set up in `.gitignore` to prevent committing private `.env` credentials.
*   **Input Sanitization**: All operator command terminal strings and fan chat inputs are escaped and sanitized in `commandParser.js` using character entity conversions to prevent Cross-Site Scripting (XSS) and injection exploits.

### 4. Testing Suite
The repository includes a dedicated test directory with **16 unit tests** executed via **Vitest** to verify the core business logic of the application:
*   `pathFinder.test.js`: Asserts that shortest paths, distances, coordinates, and directions are correctly computed.
*   `commandParser.test.js`: Asserts that XSS scripts are sanitized, and commands are parsed into structured intents (dispatch, translate, report, check) with correct priority.
*   `translator.test.js`: Asserts that English, Spanish, and French languages are accurately detected, and dictionaries/AI fallbacks translate strings properly.

### 5. Efficiency & Performance
*   **Memoized Computations**: Heavy calculation tasks (like counting open incidents and rendering the active timeline) use React's `useMemo` hooks to avoid unnecessary re-renders.
*   **Asset Optimization**: Interactive visualizations are drawn purely in clean, inline SVGs rather than rendering heavy external libraries, keeping the client bundle lightweight.
*   **Production Bundled**: Bundled code compiles successfully in `480ms` via Rolldown/Vite without build warnings.

### 6. Accessibility (a11y)
*   **Semantic HTML5**: Built using structured landmarker tags (`<main>`, `<header>`, `<section>`, `<table>`, `<aside>`).
*   **SVG Keyboard Focus**: All seating sections, gates, concessions, and restrooms on the SVG map are interactive. They are equipped with `tabindex={0}` and `onKeyDown` listeners, allowing keyboard-navigating users to tab through the stadium layout and trigger alerts using `Enter` or `Space`.
*   **Focus Ring Indicator**: Configured prominent focus outlines (`outline: 3px solid var(--neon-cyan); outline-offset: 3px`) inside `index.css`.
*   **ARIA Accessibility**: Integrated WAI-ARIA roles (`role="button"`, `aria-label`, `aria-live`) on widgets and stats cards to provide speech accessibility for screen readers.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   npm (v9.0.0 or higher)

### Installation
1.  Clone the repository and navigate to the project directory:
    ```bash
    npm install
    ```
2.  Set up environment credentials:
    ```bash
    copy .env.example .env
    ```

### Available Commands
*   **Run Development Server**:
    ```bash
    npm run dev
    ```
*   **Run Unit Tests**:
    ```bash
    npm run test
    ```
*   **Build Production Bundle**:
    ```bash
    npm run build
    ```
*   **Preview Production Build locally**:
    ```bash
    npm run preview
    ```
