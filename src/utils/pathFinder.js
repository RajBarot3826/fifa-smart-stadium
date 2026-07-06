/**
 * @fileoverview Dijkstra-based pathfinder for FIFA 2026 Smart Stadium layout.
 * Provides route computation and visual coordinate mapping for wayfinding.
 */

// Define stadium location nodes with coordinates (for rendering) and labels
export const STADIUM_NODES = {
  // Gates
  "Gate A": { id: "Gate A", x: 400, y: 50, type: "gate", label: "Gate A (North)" },
  "Gate B": { id: "Gate B", x: 750, y: 250, type: "gate", label: "Gate B (East)" },
  "Gate C": { id: "Gate C", x: 400, y: 450, type: "gate", label: "Gate C (South)" },
  "Gate D": { id: "Gate D", x: 50, y: 250, type: "gate", label: "Gate D (West)" },

  // Concessions
  "Concession 1": { id: "Concession 1", x: 600, y: 150, type: "concession", label: "Concession 1 (Tacos & Drinks)" },
  "Concession 2": { id: "Concession 2", x: 600, y: 350, type: "concession", label: "Concession 2 (Burgers & Beers)" },
  "Concession 3": { id: "Concession 3", x: 200, y: 350, type: "concession", label: "Concession 3 (Poutine & Hotdogs)" },
  "Concession 4": { id: "Concession 4", x: 200, y: 150, type: "concession", label: "Concession 4 (Halal & Vegan Eats)" },

  // Restrooms
  "Restroom A": { id: "Restroom A", x: 300, y: 100, type: "restroom", label: "Restroom A (North-West)" },
  "Restroom B": { id: "Restroom B", x: 500, y: 100, type: "restroom", label: "Restroom B (North-East)" },
  "Restroom C": { id: "Restroom C", x: 500, y: 400, type: "restroom", label: "Restroom C (South-East)" },
  "Restroom D": { id: "Restroom D", x: 300, y: 400, type: "restroom", label: "Restroom D (South-West)" },

  // Sections
  "Sec 101": { id: "Sec 101", x: 350, y: 150, type: "section", label: "Section 101" },
  "Sec 102": { id: "Sec 102", x: 450, y: 150, type: "section", label: "Section 102" },
  "Sec 103": { id: "Sec 103", x: 550, y: 200, type: "section", label: "Section 103" },
  "Sec 104": { id: "Sec 104", x: 550, y: 300, type: "section", label: "Section 104" },
  "Sec 105": { id: "Sec 105", x: 450, y: 350, type: "section", label: "Section 105" },
  "Sec 106": { id: "Sec 106", x: 350, y: 350, type: "section", label: "Section 106" },
  "Sec 107": { id: "Sec 107", x: 250, y: 300, type: "section", label: "Section 107" },
  "Sec 108": { id: "Sec 108", x: 250, y: 200, type: "section", label: "Section 108" }
};

// Define bi-directional connections (edges) with weights (representing distance/meters)
export const STADIUM_EDGES = [
  // Outer perimeter pathing
  { u: "Gate A", v: "Restroom A", w: 100 },
  { u: "Gate A", v: "Restroom B", w: 100 },
  { u: "Gate B", v: "Concession 1", w: 150 },
  { u: "Gate B", v: "Concession 2", w: 150 },
  { u: "Gate C", v: "Restroom C", w: 100 },
  { u: "Gate C", v: "Restroom D", w: 100 },
  { u: "Gate D", v: "Concession 3", w: 150 },
  { u: "Gate D", v: "Concession 4", w: 150 },

  // Inner rings and section connections
  { u: "Restroom A", v: "Sec 101", w: 80 },
  { u: "Restroom A", v: "Concession 4", w: 110 },
  { u: "Restroom B", v: "Sec 102", w: 80 },
  { u: "Restroom B", v: "Concession 1", w: 110 },
  { u: "Concession 1", v: "Sec 103", w: 90 },
  { u: "Concession 2", v: "Sec 104", w: 90 },
  { u: "Restroom C", v: "Sec 105", w: 80 },
  { u: "Restroom C", v: "Concession 2", w: 110 },
  { u: "Restroom D", v: "Sec 106", w: 80 },
  { u: "Restroom D", v: "Concession 3", w: 110 },
  { u: "Concession 3", v: "Sec 107", w: 90 },
  { u: "Concession 4", v: "Sec 108", w: 90 },

  // Inter-section links
  { u: "Sec 101", v: "Sec 102", w: 100 },
  { u: "Sec 102", v: "Sec 103", w: 100 },
  { u: "Sec 103", v: "Sec 104", w: 100 },
  { u: "Sec 104", v: "Sec 105", w: 100 },
  { u: "Sec 105", v: "Sec 106", w: 100 },
  { u: "Sec 106", v: "Sec 107", w: 100 },
  { u: "Sec 107", v: "Sec 108", w: 100 },
  { u: "Sec 108", v: "Sec 101", w: 100 }
];

/**
 * Calculates the shortest path between startNode and endNode using Dijkstra's algorithm.
 *
 * @param {string} startNodeId - ID of the starting node
 * @param {string} endNodeId - ID of the destination node
 * @returns {Object} Result object containing coordinates, nodes path, distance, and text directions
 */
export function findShortestPath(startNodeId, endNodeId) {
  // Input validation (Security & Stability)
  if (!startNodeId || !endNodeId) {
    return { success: false, error: "Missing start or destination location." };
  }
  
  // Sanitize input to avoid unexpected reference errors
  const start = String(startNodeId).trim();
  const end = String(endNodeId).trim();

  if (!STADIUM_NODES[start] || !STADIUM_NODES[end]) {
    return { success: false, error: "Invalid start or destination location." };
  }

  if (start === end) {
    return {
      success: true,
      path: [start],
      coordinates: [STADIUM_NODES[start]],
      distance: 0,
      directions: ["You are already at your destination."]
    };
  }

  // Build adjacency list for Dijkstra
  const adjacency = {};
  for (const nodeKey of Object.keys(STADIUM_NODES)) {
    adjacency[nodeKey] = [];
  }

  for (const edge of STADIUM_EDGES) {
    adjacency[edge.u].push({ node: edge.v, weight: edge.w });
    adjacency[edge.v].push({ node: edge.u, weight: edge.w });
  }

  // Initialize Dijkstra data structures
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const nodeKey of Object.keys(STADIUM_NODES)) {
    distances[nodeKey] = Infinity;
    previous[nodeKey] = null;
    unvisited.add(nodeKey);
  }

  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentNode = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null || currentNode === end) {
      break;
    }

    unvisited.delete(currentNode);

    for (const neighbor of adjacency[currentNode]) {
      if (unvisited.has(neighbor.node)) {
        const alt = distances[currentNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = currentNode;
        }
      }
    }
  }

  // If destination is unreachable
  if (distances[end] === Infinity) {
    return { success: false, error: "Destination is currently unreachable." };
  }

  // Reconstruct path
  const path = [];
  let curr = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  const coordinates = path.map(nodeId => ({
    id: nodeId,
    x: STADIUM_NODES[nodeId].x,
    y: STADIUM_NODES[nodeId].y,
    type: STADIUM_NODES[nodeId].type,
    label: STADIUM_NODES[nodeId].label
  }));

  // Generate readable directions
  const directions = [];
  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = STADIUM_NODES[path[i]];
    const toNode = STADIUM_NODES[path[i + 1]];
    const edge = STADIUM_EDGES.find(
      e => (e.u === path[i] && e.v === path[i + 1]) || (e.v === path[i] && e.u === path[i + 1])
    );
    const distance = edge ? edge.w : 100;
    
    let directionWord = "head towards";
    if (toNode.type === "concession") {
      directionWord = "walk to concessions at";
    } else if (toNode.type === "restroom") {
      directionWord = "walk towards restrooms at";
    } else if (toNode.type === "section") {
      directionWord = "proceed to seating at";
    } else if (toNode.type === "gate") {
      directionWord = "exit through";
    }

    directions.push(`From ${fromNode.label}, ${directionWord} ${toNode.label} (approx. ${distance} meters).`);
  }

  return {
    success: true,
    path,
    coordinates,
    distance: distances[end],
    directions
  };
}
