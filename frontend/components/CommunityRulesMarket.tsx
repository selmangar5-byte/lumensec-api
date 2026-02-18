import React, { useState } from 'react';
import { mockCommunityRules } from '../data/mockCommunityRules';

interface Rule {
  id: string;
  name: string;
  description: string;
  installed: boolean;
}

export default function CommunityRulesMarket() {
  const [rules, setRules] = useState<Rule[]>(mockCommunityRules);
  const [installing, setInstalling] = useState<string | null>(null);

  const handleInstall = (ruleId: string) => {
    setInstalling(ruleId);
    
    setTimeout(() => {
      setRules((prevRules: Rule[]) =>
        prevRules.map((rule: Rule) =>
          rule.id === ruleId ? { ...rule, installed: true } : rule
        )
      );
      setInstalling(null);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Marketplace de Règles Communautaires</h2>
      <div className="grid gap-4">
        {rules.map((rule: Rule) => (
          <div key={rule.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{rule.name}</h3>
              <p className="text-sm text-gray-600">{rule.description}</p>
            </div>
            <button
              onClick={() => handleInstall(rule.id)}
              disabled={installing === rule.id || rule.installed}
              className={`px-4 py-2 rounded ${
                rule.installed 
                  ? 'bg-green-500 text-white' 
                  : installing === rule.id 
                    ? 'bg-gray-400 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {rule.installed 
                ? 'Installé' 
                : installing === rule.id 
                  ? 'Installation...' 
                  : 'Installer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}