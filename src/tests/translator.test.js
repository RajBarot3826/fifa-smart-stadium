import { describe, it, expect } from "vitest";
import { detectLanguage, translateText } from "../utils/translator";

describe("Translator Unit Tests", () => {
  describe("Language Detection", () => {
    it("should detect English by default", () => {
      expect(detectLanguage("Hello, welcome to the stadium")).toBe("en");
    });

    it("should detect Spanish for Spanish queries", () => {
      expect(detectLanguage("¿Dónde está el baño más cercano?")).toBe("es");
      expect(detectLanguage("por favor ayuda en puerta b")).toBe("es");
    });

    it("should detect French for French queries", () => {
      expect(detectLanguage("Où se trouvent les toilettes les plus proches?")).toBe("fr");
      expect(detectLanguage("Veuillez vous diriger vers la sortie")).toBe("fr");
    });
  });

  describe("Text Translation", () => {
    it("should translate from dictionary matching cases", () => {
      const res = translateText("where is the nearest restroom?", "es");
      expect(res.success).toBe(true);
      expect(res.sourceLang).toBe("en");
      expect(res.targetLang).toBe("es");
      expect(res.translatedText).toBe("¿Dónde está el baño más cercano?");
    });

    it("should bypass translation if target language equals source language", () => {
      const res = translateText("Welcome to the stadium", "en");
      expect(res.success).toBe(true);
      expect(res.translatedText).toBe("Welcome to the stadium");
    });

    it("should fall back to simulated AI translation for unknown phrases", () => {
      const res = translateText("There is a water leak in the hallway", "fr");
      expect(res.success).toBe(true);
      expect(res.translatedText).toContain("Fuite signalée");
    });

    it("should handle empty inputs gracefully", () => {
      const res = translateText("", "es");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Text is empty.");
    });
  });
});
