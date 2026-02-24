
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Incident } from "../types";

export interface AIAnalysisResult {
  text: string;
  sources?: { uri: string; title: string }[];
  suggestedActions?: { name: string; args: any }[];
  isImmunityPatternMatched?: boolean; // Renommé pour clarté S4
}

const remediationTools: FunctionDeclaration[] = [
  {
    name: "block_ip",
    parameters: {
      type: Type.OBJECT,
      description: "Suggère le blocage d'une adresse IP sur le pare-feu.",
      properties: {
        ip: { type: Type.STRING },
        reason: { type: Type.STRING }
      },
      required: ["ip", "reason"]
    }
  },
  {
    name: "kill_process",
    parameters: {
      type: Type.OBJECT,
      description: "Suggère l'arrêt d'un processus suspect.",
      properties: {
        process_name: { type: Type.STRING }
      },
      required: ["process_name"]
    }
  },
  {
    name: "propose_silence_noise",
    parameters: {
      type: Type.OBJECT,
      description: "Suggère de classer l'incident comme bruit (faux positif).",
      properties: {
        reason: { type: Type.STRING, description: "Justification du triage." }
      },
      required: ["reason"]
    }
  }
];

export const securityAI = {
  async analyzeIncident(incident: Incident): Promise<AIAnalysisResult> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Instruction système S6 : IA Assistée et Défensive
    const systemInstruction = `
      TU ES L'ASSISTANT DE TRIAGE LUMENSEC v3.0 (ALIGNE S6).
      OPÉRATEUR SOUVERAIN : NAWAL (TECH LEAD).
      
      TON RÔLE :
      1. ANALYSER : Contextualise l'incident avec les faits fournis.
      2. MÉMOIRE IMMUNITAIRE (S4) : Si les signaux correspondent à une menace connue, signale-le comme "Pattern reconnu".
      3. PROPOSER (S3) : Suggère des actions via les outils fournis. 
      
      CONTRAINTES CRITIQUES :
      - NE DÉCIDE JAMAIS SEUL. L'exécution dépend de la validation humaine.
      - RESTE FACTUEL. Pas de marketing. Pas de spéculation.
      - SI DOUTE : Priorise la demande de validation à Nawal.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `${systemInstruction}\n\nANALYSE CET INCIDENT POUR VALIDATION HUMAINE : ${JSON.stringify(incident)}`,
        config: {
          tools: [{ googleSearch: {} }, { functionDeclarations: remediationTools }],
          thinkingConfig: { thinkingBudget: 24000 }
        }
      });

      const text = response.text || "Analyse de triage complétée. En attente de revue.";
      const suggestedActions = response.functionCalls?.map(fc => ({
        name: fc.name,
        args: fc.args
      })) || [];

      // S4 : On détecte si un pattern connu a été matché
      const isImmunityPatternMatched = suggestedActions.length > 0;

      return { text, suggestedActions, isImmunityPatternMatched };
    } catch (error: any) {
      console.error("AI SOC FAILURE:", error);
      return { text: `[ERREUR DE TRIAGE] Nawal, le moteur d'assistance est indisponible. Veuillez procéder par analyse manuelle.` };
    }
  }
};
