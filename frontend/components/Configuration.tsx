import React from 'react';
import { Shield, Download, FileText, Lock, Globe, Database, Cpu, Settings, Wrench } from 'lucide-react';
import CommunityRulesMarket from './CommunityRulesMarket';

interface ConfigCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: string;
}

const configTools: ConfigCard[] = [
  {
    id: 'playbooks',
    title: 'Playbooks SOC',
    description: 'Télécharger les procédures de réponse aux incidents',
    icon: FileText,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    action: 'Voir les 12 playbooks'
  },
  {
    id: 'rules',
    title: 'Règles Communautaires',
    description: 'Règles YARA/Sigma pour la détection avancée',
    icon: Shield,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    action: 'Explorer le marché'
  },
  {
    id: 'scripts',
    title: 'Scripts de Défense',
    description: 'Automatisation PowerShell/Python pour la réponse',
    icon: Cpu,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    action: 'Accéder aux scripts'
  },
  {
    id: 'ioc',
    title: 'IOC Database',
    description: 'Indicateurs de compromission mis à jour',
    icon: Database,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    action: 'Consulter les IOCs'
  },
  {
    id: 'tools',
    title: 'Outils de Forensics',
    description: 'Utilitaires d\'analyse et de collecte d\'évidence',
    icon: Settings,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    action: 'Télécharger'
  },
  {
    id: 'compliance',
    title: 'Templates Conformité',
    description: 'Documents Loi 25 et normes ISO pré-remplis',
    icon: Lock,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    action: 'Générer'
  },
  {
    id: 'network',
    title: 'Network Tools',
    description: 'Scanner et outils d\'analyse réseau',
    icon: Globe,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    action: 'Lancer'
  },
  {
    id: 'updates',
    title: 'Mises à Jour',
    description: 'Dernières signatures et moteurs de détection',
    icon: Download,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    action: 'Vérifier'
  }
];

export default function Configuration() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight italic">
              Centre de Configuration
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gérez vos outils, playbooks et ressources de défense
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">Système à jour</span>
        </div>
      </div>

      {/* Les 8 cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {configTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="group bg-slate-900/60 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer hover:bg-slate-800/60"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 border`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                {tool.title}
              </h3>
              
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex items-center text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span>{tool.action}</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Community Rules */}
      <div className="mt-12 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
          <Shield className="w-5 h-5 text-emerald-400" />
          Règles Communautaires Avancées
        </h2>
        <CommunityRulesMarket />
      </div>
    </div>
  );
}