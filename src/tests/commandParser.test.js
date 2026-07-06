import { describe, it, expect } from "vitest";
import { parseCommand, sanitizeInput } from "../utils/commandParser";

describe("Command Parser Unit Tests", () => {
  describe("Input Sanitization", () => {
    it("should sanitize malicious HTML and script tags", () => {
      const dirty = '<script>alert("hack")</script>';
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain("<script>");
      expect(clean).toContain("&lt;script&gt;");
    });
  });

  describe("Natural Language Parser", () => {
    it("should parse translation requests", () => {
      const cmd = "translate 'Emergency in progress' to Spanish";
      const parsed = parseCommand(cmd);
      expect(parsed.intent).toBe("translate");
      expect(parsed.params.text).toBe("Emergency in progress");
      expect(parsed.params.targetLanguage.toLowerCase()).toBe("spanish");
    });

    it("should parse dispatch requests with location normalization", () => {
      const cmd = "dispatch security to gate a";
      const parsed = parseCommand(cmd);
      expect(parsed.intent).toBe("dispatch");
      expect(parsed.params.team).toBe("Security");
      expect(parsed.params.location).toBe("Gate A");
      expect(parsed.severity).toBe("high");
    });

    it("should parse status inquiries", () => {
      const cmd = "check status of restrooms";
      const parsed = parseCommand(cmd);
      expect(parsed.intent).toBe("status_check");
      expect(parsed.params.category).toBe("restrooms");
    });

    it("should parse incident reports with severity classification", () => {
      const cmd = "report a fire near section 105";
      const parsed = parseCommand(cmd);
      expect(parsed.intent).toBe("report_incident");
      expect(parsed.params.issue).toBe("fire");
      expect(parsed.params.location).toBe("Sec 105");
      expect(parsed.severity).toBe("critical");
    });

    it("should fall back gracefully on unknown commands", () => {
      const cmd = "order a cheese pizza";
      const parsed = parseCommand(cmd);
      expect(parsed.intent).toBe("unknown");
      expect(parsed.params.rawQuery).toBe("order a cheese pizza");
    });
  });
});
