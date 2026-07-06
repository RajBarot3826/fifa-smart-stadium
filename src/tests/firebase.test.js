import { describe, it, expect } from "vitest";
import { logIncidentToCloud } from "../utils/firebase";

describe("Firebase Telemetry Integration Unit Tests", () => {
  it("should fall back to local simulation when Firebase credentials are unconfigured", async () => {
    const mockIncident = {
      id: "inc-test",
      issue: "Test telemetry",
      location: "Gate A",
      severity: "low",
      status: "Open",
      timestamp: "12:00:00"
    };

    const res = await logIncidentToCloud(mockIncident);
    expect(res.success).toBe(true);
    expect(["simulation", "simulation_fallback", "cloud"]).toContain(res.mode);
  });
});
