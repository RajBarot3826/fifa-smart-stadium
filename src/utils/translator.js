/**
 * @fileoverview Translation dictionary and simulation utility.
 * Simulates real-time multilingual translations for English, Spanish, and French.
 */

// Dictionary of predefined operational and fan-facing translations
export const TRANSLATION_DICTIONARY = {
  // English -> Spanish
  "welcome to the stadium": {
    es: "Bienvenido al estadio",
    fr: "Bienvenue au stade"
  },
  "please proceed to the nearest exit": {
    es: "Por favor, diríjase a la salida más cercana",
    fr: "Veuillez vous diriger vers la sortie la plus proche"
  },
  "security check is mandatory for all spectators": {
    es: "El control de seguridad es obligatorio para todos los espectadores",
    fr: "Le contrôle de sécurité est obligatoire pour tous les spectateurs"
  },
  "concession stand wait times are currently low": {
    es: "Los tiempos de espera en los puestos de comida son actualmente bajos",
    fr: "Les temps d'attente aux concessions sont actuellement faibles"
  },
  "emergency in section 104. please remain calm": {
    es: "Emergencia en la sección 104. Por favor, mantenga la calma",
    fr: "Urgence dans la section 104. Veuillez rester calme"
  },
  "where is the nearest restroom?": {
    es: "¿Dónde está el baño más cercano?",
    fr: "Où se trouvent les toilettes les plus proches?"
  },
  "how do i get to gate a?": {
    es: "¿Cómo llego a la puerta A?",
    fr: "Comment se rendre à la porte A?"
  },
  "your ticket has been successfully verified": {
    es: "Su boleto ha sido verificado con éxito",
    fr: "Votre billet a été vérifié avec succès"
  },

  // Spanish -> English & French
  "bienvenido al estadio": {
    en: "Welcome to the stadium",
    fr: "Bienvenue au stade"
  },
  "hay una pelea en la sección 204": {
    en: "There is a fight in section 204",
    fr: "Il y a une bagarre dans la section 204"
  },
  "¿dónde está el baño más cercano?": {
    en: "Where is the nearest restroom?",
    fr: "Où se trouvent les toilettes les plus proches?"
  },

  // French -> English & Spanish
  "bienvenue au stade": {
    en: "Welcome to the stadium",
    es: "Bienvenido al estadio"
  },
  "où se trouvent les toilettes les plus proches?": {
    en: "Where is the nearest restroom?",
    es: "¿Dónde está el baño más cercano?"
  }
};

/**
 * Detects the language of a given text string.
 *
 * @param {string} text - The input text to analyze
 * @returns {string} Language code: 'en' | 'es' | 'fr'
 */
export function detectLanguage(text) {
  if (!text) return "en";
  const cleaned = String(text).toLowerCase().trim();

  // Basic keyword-based heuristics for demo purposes
  const spanishKeywords = ["por favor", "gracias", "dónde", "estadio", "puerta", "sección", "baño", "boleto", "pelea", "ayuda"];
  const frenchKeywords = ["s'il vous plaît", "merci", "où", "stade", "porte", "section", "toilettes", "billet", "bagarre", "aide", "veuillez"];

  let esScore = 0;
  let frScore = 0;

  for (const word of spanishKeywords) {
    if (cleaned.includes(word)) esScore += 2;
  }
  for (const word of frenchKeywords) {
    if (cleaned.includes(word)) frScore += 2;
  }

  // Check common small words/articles
  if (cleaned.match(/\b(el|la|los|las|un|una|y|o|en|del|al)\b/)) esScore += 1;
  if (cleaned.match(/\b(le|la|les|un|une|et|ou|dans|du|au|en)\b/)) frScore += 1;

  if (esScore > frScore && esScore > 0) return "es";
  if (frScore > esScore && frScore > 0) return "fr";
  return "en";
}

/**
 * Translates a given text to a target language.
 * Uses a predefined dictionary, and falls back to a simulated generative translation
 * if the text is not in the dictionary.
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code ('en' | 'es' | 'fr')
 * @returns {Object} Result object containing source language, target language, and translated text
 */
export function translateText(text, targetLang) {
  if (!text) {
    return { success: false, error: "Text is empty." };
  }

  const cleanText = String(text).trim();
  const cleanTextLower = cleanText.toLowerCase();
  
  const sourceLang = detectLanguage(cleanText);
  const target = String(targetLang).toLowerCase().trim();

  if (sourceLang === target) {
    return {
      success: true,
      sourceLang,
      targetLang: target,
      translatedText: cleanText
    };
  }

  // 1. Check direct dictionary matches
  if (TRANSLATION_DICTIONARY[cleanTextLower]) {
    const translation = TRANSLATION_DICTIONARY[cleanTextLower][target];
    if (translation) {
      return {
        success: true,
        sourceLang,
        targetLang: target,
        translatedText: translation
      };
    }
  }

  // 2. Perform simulated translation (mocking LLM generation for unrecognized phrases)
  let translatedText = cleanText;

  if (target === "es") {
    // English -> Spanish mock suffix/prefix rules to simulate GenAI
    if (cleanTextLower.includes("leak")) {
      translatedText = `Fuga reportada: ${cleanText}`;
    } else if (cleanTextLower.includes("crowd") || cleanTextLower.includes("congestion")) {
      translatedText = `Congestión de multitud: ${cleanText}`;
    } else {
      translatedText = `[AI Traducido al Español]: ${cleanText}`;
    }
  } else if (target === "fr") {
    // English -> French mock
    if (cleanTextLower.includes("leak")) {
      translatedText = `Fuite signalée: ${cleanText}`;
    } else if (cleanTextLower.includes("crowd") || cleanTextLower.includes("congestion")) {
      translatedText = `Congestion de foule: ${cleanText}`;
    } else {
      translatedText = `[AI Traduit en Français]: ${cleanText}`;
    }
  } else if (target === "en") {
    // Spanish/French -> English mock
    translatedText = `[AI Translated to English]: ${cleanText}`;
  }

  return {
    success: true,
    sourceLang,
    targetLang: target,
    translatedText
  };
}
