
import React, { useState } from 'react';
import { Incident } from '../types';
import { securityAI, AIAnalysisResult } from '../services/ai';
import { GoogleGenAI, Modality } from "@google/genai";
import RemediationConsole from './RemediationConsole';

interface AIAnalystProps {
  incident: Incident;
  onRemediated?: () => void;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ incident, onRemediated }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [step, setStep] = useState<string>('');

  const generateAnalysis = async () => {
    setLoading(true);
    setStep('Accès à la mémoire immunitaire S4...');
    
    try {
      setTimeout(() => setStep('Corrélation des signaux historiques...'), 1000);
      setTimeout(() => setStep('Préparation des suggestions de triage...'), 2500);

      const result = await securityAI.analyzeIncident(incident);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const speakAnalysis = async () => {
    if (!analysis || isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statusText = analysis.isImmunityPatternMatched 
        ? "Nawal, ce pattern a été identifié dans notre mémoire immunitaire. Une stratégie de réponse est prête pour votre approbation."
        : `Analyse complétée. Voici mes propositions de triage pour votre validation.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: statusText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      {analysis?.isImmunityPatternMatched && (
        <div className="bg-indigo-500/10 border-2 border-indigo-500/30 rounded-[2rem] p-8 flex items-center space-x-6 animate-in slide-in-from-top-6 duration-700">
          <div className="w-16 h-16 bg-slate-900 border-4 border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h4 className="text-indigo-400 font-black text-sm uppercase tracking-widest italic">S4 : Mémoire Immunitaire Détectée</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-1 italic uppercase tracking-wider">Pattern reconnu. Stratégie de remédiation suggérée en attente d'approbation humaine.</p>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
        <div className="px-10 py-6 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${isSpeaking || loading ? 'bg-indigo-500 shadow-[0_0_15px_indigo] animate-pulse' : 'bg-slate-700'}`}></div>
            </div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">S3 : Assistance au Triage (IA)</h3>
          </div>
          <div className="flex items-center space-x-3">
            {analysis && (
              <button onClick={speakAnalysis} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${isSpeaking ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                <span>Briefing</span>
              </button>
            )}
            {!analysis && !loading && (
              <button onClick={generateAnalysis} className="text-[10px] font-black bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl transition-all shadow-xl uppercase italic">
                Analyser pour Approbation
              </button>
            )}
          </div>
        </div>
        
        <div className="p-10">
          {loading ? (
            <div className="flex flex-col items-center py-12 space-y-6">
              <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest italic">{step}</p>
            </div>
          ) : analysis ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-950/40 p-8 rounded-3xl border border-slate-800 whitespace-pre-wrap">
                {analysis.text}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-800/50 rounded-3xl">
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] italic">En attente d'instruction de triage, Nawal.</p>
            </div>
          )}
        </div>
      </div>

      {analysis?.suggestedActions && analysis.suggestedActions.length > 0 && (
        <RemediationConsole 
          actions={analysis.suggestedActions} 
          incidentId={incident.id} 
          onSuccess={() => onRemediated?.()} 
        />
      )}
    </div>
  );
};

export default AIAnalyst;
