import { describe, it, expect } from "vitest";
import { findShortestPath } from "../utils/pathFinder";

describe("Pathfinder Unit Tests (Dijkstra)", () => {
  it("should find the shortest path between Gate A and Sec 101", () => {
    const result = findShortestPath("Gate A", "Sec 101");
    expect(result.success).toBe(true);
    expect(result.path[0]).toBe("Gate A");
    expect(result.path[result.path.length - 1]).toBe("Sec 101");
    expect(result.distance).toBe(180); // Gate A -> Restroom A (100) + Restroom A -> Sec 101 (80)
    expect(result.coordinates.length).toBe(3);
    expect(result.directions.length).toBe(2);
  });

  it("should return correct path when start and destination are the same", () => {
    const result = findShortestPath("Gate A", "Gate A");
    expect(result.success).toBe(true);
    expect(result.distance).toBe(0);
    expect(result.path).toEqual(["Gate A"]);
  });

  it("should handle invalid or non-existent nodes gracefully", () => {
    // Missing inputs
    let result = findShortestPath(null, "Gate A");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Missing");

    // Invalid nodes
    result = findShortestPath("Gate A", "Gate Z");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid");
  });
});
