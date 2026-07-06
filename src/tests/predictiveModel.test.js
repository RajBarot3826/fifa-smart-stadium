import { describe, it, expect } from "vitest";
import { predictGateCongestion } from "../utils/predictiveModel";

describe("Predictive AI Model Unit Tests", () => {
  it("should score low risk under standard conditions", () => {
    const prediction = predictGateCongestion("Gate A", 120, 30, 1.0);
    expect(prediction.error).toBeUndefined();
    expect(prediction.probabilityPercent).toBeLessThan(50);
    expect(prediction.riskLevel).toBe("low");
  });

  it("should score critical risk during peak entry windows and high scan rate", () => {
    const prediction = predictGateCongestion("Gate C", 30, 140, 1.2);
    expect(prediction.error).toBeUndefined();
    expect(prediction.probabilityPercent).toBeGreaterThanOrEqual(85);
    expect(prediction.riskLevel).toBe("critical");
    expect(prediction.recommendation).toContain("ALERT");
  });

  it("should handle error edge cases for invalid inputs", () => {
    // Missing gate name
    let prediction = predictGateCongestion("", 30, 100);
    expect(prediction.error).toContain("Missing");

    // Invalid numbers
    prediction = predictGateCongestion("Gate A", "InvalidTime", 100);
    expect(prediction.error).toContain("Invalid");
  });
});
