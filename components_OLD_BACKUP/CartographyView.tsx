
import React from 'react';

/**
 * Lumensec Master Strategic Cartography (S1 -> S6)
 * © 2025 Lumensec Inc. - Tech Lead: Nawal
 * Focus: Industrial MVP, Evidence-Driven, Human-in-the-loop.
 */
const CartographyView: React.FC = () => {
  const roadmap = [
    {
      id: "S6",
      title: "Gouvernance & Approbation",
      subtitle: "HUMAN DECISION LAYER",
      date: "Q3 2025",
      status: "CURRENT",
      color: "cyan",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      tech: ["Approbation Explicite", "Registre des Décisions", "Audit Loi 25"],
      impact: "Contrôle Souverain",
      desc: "Validation humaine obligatoire pour toute action de remédiation. Chaque décision de l'opérateur est enregistrée comme preuve juridique, garantissant une responsabilité totale et une conformité stricte."
    },
    {
      id: "S5",
      title: "Intégrité & Preuve",
      subtitle: "EVIDENCE LAYER",
      date: "Q2 2025",
      status: "COMPLETED",
      color: "emerald",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      tech: ["Empreintes SHA-256", "Scellement Numérique", "Evidence Packs"],
      impact: "Recevabilité Juridique",
      desc: "Transformation des alertes en dossiers de preuves immuables. Chaque artefact (IP, Hash, Log) est scellé pour garantir son intégrité devant les autorités ou les assureurs."
    },
    {
      id: "S4",
      title: "Mémoire Immunitaire",
      subtitle: "PATTERN LEARNING",
      date: "Q1 2025",
      status: "COMPLETED",
      color: "indigo",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      tech: ["Indexation des Menaces", "Reconnaissance de Motifs", "Accélération Triage"],
      impact: "Apprentissage Défensif",
      desc: "Chaque menace traitée génère une empreinte unique. Cette mémoire permet de reconnaître instantanément des signaux similaires à l'avenir pour suggérer des réponses déjà éprouvées."
    },
    {
      id: "S3",
      title: "Intelligence Assistée",
      subtitle: "INFERENCE LAYER (NON-EXÉCUTOIRE)",
      date: "Q4 2024",
      status: "COMPLETED",
      color: "purple",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      tech: ["Analyse de Contexte", "Classification IA", "Mécanisme Fallback"],
      impact: "Aide à la Décision",
      desc: "L'IA analyse, classe et contextualise les incidents. Elle propose des stratégies de réponse sans jamais décider seule. En cas d'indisponibilité, le moteur de règles prend le relais."
    },
    {
      id: "S2",
      title: "Synthèse & Normalisation",
      subtitle: "CANONICAL LAYER",
      date: "Q3 2024",
      status: "COMPLETED",
      color: "blue",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      tech: ["Filtrage SOAR", "Déduplication", "Format Pivot"],
      impact: "Réduction du Bruit",
      desc: "Élimination des faux positifs et normalisation des flux bruts. Les événements hétérogènes sont transformés en une structure unique facilitant l'analyse ultérieure."
    },
    {
      id: "S1",
      title: "Genèse & Radar",
      subtitle: "INGESTION LAYER",
      date: "Q2 2024",
      status: "COMPLETED",
      color: "slate",
      icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
      tech: ["Webhook Ingestion", "Email Gateway", "Signal Capture"],
      impact: "Visibilité Fondamentale",
      desc: "Capture universelle des signaux de sécurité. Mise en place du pipeline d'écoute pour centraliser les logs provenant de toutes les sources d'infrastructure."
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-40">
      <div className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">Industrial SOC Architecture // S1 - S6 Roadmap</span>
        </div>
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
          Cartographie <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">Lumensec</span>
        </h2>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.5em] max-w-2xl mx-auto italic">
          Ingénierie de Défense Gouvernée et Apprenante
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 -translate-x-1/2 opacity-30 hidden md:block"></div>

        <div className="space-y-32 relative">
          {roadmap.map((step, index) => (
            <div key={step.id} className={`flex flex-col md:flex-row items-center gap-12 group ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`p-10 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:border-${step.color}-500/30 group-hover:-translate-y-1 relative overflow-hidden`}>
                   
                   <div className={`flex items-center space-x-4 mb-6 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                     <span className={`text-[10px] font-black text-${step.color}-500 uppercase tracking-widest italic`}>
                       Phase {step.id} // {step.date}
                     </span>
                     <span className={`px-4 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${step.status === 'CURRENT' ? `bg-${step.color}-500 text-slate-950 border-${step.color}-400` : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                       {step.status}
                     </span>
                   </div>

                   <h3 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase leading-none">{step.title}</h3>
                   <p className={`text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic`}>{step.subtitle}</p>
                   
                   <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10 italic">
                     {step.desc}
                   </p>

                   <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      {step.tech.map(t => (
                        <span key={t} className="text-[9px] font-bold bg-black/40 text-slate-300 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest">
                          {t}
                        </span>
                      ))}
                   </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-20 h-20 bg-slate-950 border-4 border-slate-800 rounded-[1.5rem] flex items-center justify-center shadow-3xl transition-all duration-700 group-hover:rotate-[45deg] group-hover:border-${step.color}-500`}>
                  <div className="group-hover:-rotate-[45deg] transition-all duration-700">
                    <svg className={`w-8 h-8 text-${step.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={step.icon} />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-1/2">
                 <div className={`opacity-0 group-hover:opacity-100 transition-all duration-1000 flex ${index % 2 === 0 ? 'justify-start pl-20' : 'justify-end pr-20'}`}>
                    <div className={`text-[120px] font-black text-slate-800/10 select-none leading-none`}>
                      0{roadmap.length - index}
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-slate-900/40 p-16 rounded-[4rem] border border-slate-800 text-center backdrop-blur-3xl shadow-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-grid opacity-5"></div>
           <div className="relative z-10 space-y-12">
             <div className="space-y-4">
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                 Le Socle Industriel Lumensec
               </h4>
               <p className="text-sm text-slate-500 font-medium leading-relaxed italic max-w-2xl mx-auto">
                 Détecte. Défend. Apprend. <br/> 
                 Un système qui assiste l'humain sans jamais se substituer à sa responsabilité souveraine.
               </p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                   <p className="text-2xl font-black text-white italic">S1-S6</p>
                   <p className="text-[8px] text-slate-600 uppercase tracking-widest">Architecture</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-indigo-400 italic">ASSISTED</p>
                   <p className="text-[8px] text-slate-600 uppercase tracking-widest">Triage IA</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-emerald-400 italic">MEMORY</p>
                   <p className="text-[8px] text-slate-600 uppercase tracking-widest">Immunité</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-cyan-400 italic">HUMAN</p>
                   <p className="text-[8px] text-slate-600 uppercase tracking-widest">Validation Lead</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CartographyView;
