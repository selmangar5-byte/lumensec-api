import React, { useState, useEffect, useRef } from 'react';

const SOCTerminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>([
    "[SYSTEM] Lumensec OS v2.8.0-immune initialized.",
    "[AUTH] Nawal session: Tech Lead / SOC Commander",
  ]);
  const [isOperational, setIsOperational] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = [
      "DIAGNOSTIC: Checking Immunity Core...",
      "IMMUNITY: Historical pattern database linked.",
      "IMMUNITY: Auto-neutralization protocol ENABLED.",
      "NOISE: Noise Reduction Engine (SOAR) initialized.",
      "NOISE: Deduplication filter set to 95% threshold.",
      "AI: Gemini 3 Pro thinking budget allocated (20k tokens).",
      "STATUS: LUMENSEC v2.8 FULLY OPERATIONAL.",
      "READY: Protection active. No manual action required for known threats."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLines(prev => [...prev, `[LOG] ${sequence[i]}`]);
        i++;
      } else {
        setIsOperational(true);
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="bg-black/95 border border-indigo-500/20 rounded-[2.5rem] p-8 font-mono text-[10px] shadow-2xl h-80 overflow-hidden relative flex flex-col">
      <div className="absolute top-4 right-8 flex space-x-1.5 z-20">
        <div className={`w-2.5 h-2.5 rounded-full ${isOperational ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-amber-500 animate-pulse'}`}></div>
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/20"></div>
      </div>
      
      <div ref={containerRef} className="flex-grow overflow-y-auto space-y-2 scrollbar-hide relative z-10 pb-4">
        {lines.map((line, i) => (
          <div key={i} className={`${
            line.includes('OPERATIONAL') || line.includes('READY') || line.includes('ENABLED') ? 'text-emerald-400 font-black' : 
            line.includes('DIAGNOSTIC') ? 'text-indigo-400' : 
            'text-slate-500'
          }`}>
            <span className="text-slate-800 mr-4 font-normal">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        {isOperational && (
          <div className="mt-6 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in zoom-in duration-500">
             <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Security Node: AUTO-IMMUNE CORE ONLINE</span>
                <span className="text-[9px] text-emerald-600 font-mono italic">Protection 24/7</span>
             </div>
          </div>
        )}
        <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block ml-1 align-middle"></div>
      </div>
    </div>
  );
};

export default SOCTerminal;