export interface CommunityRule {
  id: string;
  name: string;
  description: string;
  category: 'RANSOMWARE' | 'BRUTE_FORCE' | 'SQL_INJECTION' | 'DDoS' | 'MALWARE' | 'PHISHING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  installs: number;
  rating: number;
  author: string;
  installed: boolean;
}

export const mockCommunityRules: CommunityRule[] = [
  {
    id: '1',
    name: 'RDP Brute-Force Detection',
    description: 'Détecte les tentatives de force brute sur Remote Desktop Protocol avec seuil adaptatif',
    category: 'BRUTE_FORCE',
    severity: 'HIGH',
    installs: 12847,
    rating: 4.8,
    author: 'SecOps-Community',
    installed: false
  },
  {
    id: '2',
    name: 'Office365-SMA-Detect',
    description: 'Identifie les activités suspectes sur Office 365 via analyse comportementale',
    category: 'MALWARE',
    severity: 'MEDIUM',
    installs: 8934,
    rating: 4.6,
    author: 'Microsoft-Partners',
    installed: false
  },
  {
    id: '3',
    name: 'WannaCry Ransomware Shield',
    description: 'Bloque les signatures WannaCry et variantes connues en temps réel',
    category: 'RANSOMWARE',
    severity: 'CRITICAL',
    installs: 23456,
    rating: 4.9,
    author: 'CERT-Global',
    installed: true
  },
  {
    id: '4',
    name: 'SQL Injection Pattern v3',
    description: 'Détection avancée des injections SQL avec machine learning',
    category: 'SQL_INJECTION',
    severity: 'HIGH',
    installs: 15672,
    rating: 4.7,
    author: 'OWASP-Contributors',
    installed: true
  },
  {
    id: '5',
    name: 'DDoS Mitigation - Layer 7',
    description: 'Protection contre attaques DDoS application layer avec rate limiting intelligent',
    category: 'DDoS',
    severity: 'CRITICAL',
    installs: 19283,
    rating: 4.9,
    author: 'Cloudflare-Community',
    installed: false
  },
  {
    id: '6',
    name: 'Phishing URL Blocker',
    description: 'Bloque URLs de phishing identifiées par threat intelligence collaborative',
    category: 'PHISHING',
    severity: 'MEDIUM',
    installs: 11234,
    rating: 4.5,
    author: 'PhishTank-Team',
    installed: true
  },
  {
    id: '7',
    name: 'Cryptominer Detection',
    description: 'Identifie les activités de cryptominage non-autorisées sur endpoints',
    category: 'MALWARE',
    severity: 'MEDIUM',
    installs: 7456,
    rating: 4.4,
    author: 'EDR-Coalition',
    installed: false
  },
  {
    id: '8',
    name: 'Lateral Movement Detector',
    description: 'Détecte les mouvements latéraux dans le réseau indiquant une intrusion',
    category: 'MALWARE',
    severity: 'CRITICAL',
    installs: 14789,
    rating: 4.8,
    author: 'MITRE-ATT&CK',
    installed: false
  },
  {
    id: '9',
    name: 'Email Spoofing Guard',
    description: 'Vérifie SPF/DKIM/DMARC et bloque emails spoofés',
    category: 'PHISHING',
    severity: 'HIGH',
    installs: 10123,
    rating: 4.6,
    author: 'EmailSec-Alliance',
    installed: false
  },
  {
    id: '10',
    name: 'Zero-Day Exploit Sandbox',
    description: 'Exécute fichiers suspects en environnement isolé avant autorisation',
    category: 'MALWARE',
    severity: 'CRITICAL',
    installs: 18945,
    rating: 4.9,
    author: 'Sandbox-Labs',
    installed: false
  }
];