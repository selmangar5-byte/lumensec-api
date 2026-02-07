export const translations = {
  fr: {
    // Header
    dashboard: 'TABLEAU DE BORD',
    cartography: 'CARTOGRAPHIE',
    
    // KPIs
    activeAlerts: 'ALERTES ACTIVES',
    autoNeutralized: 'AUTO-NEUTRALISÉS',
    noiseReduction: 'BRUIT RÉDUIT',
    threatLevel: 'NIVEAU MENACE',
    seenClean: 'RIEN VU VENIR',
    
    // Incidents Table
    ingestionLayer: 'COUCHE INGESTION: RADAR PRINCIPAL',
    webhookApi: 'Webhook API',
    emailGateway: 'Passerelle Email',
    traceId: 'ID TRACE',
    severity: 'SÉVÉRITÉ',
    inferenceStatus: 'STATUT INFÉRENCE',
    action: 'ACTION',
    
    // Severity
    critical: 'CRITIQUE',
    high: 'ÉLEVÉE',
    medium: 'MOYENNE',
    low: 'FAIBLE',
    
    // Status
    new: 'NOUVEAU',
    triaging: 'EN ANALYSE',
    resolved: 'RÉSOLU',
    immunized: 'IMMUNISÉ',
    silenced: 'RÉDUIT AU SILENCE',
    remediated: 'CORRIGÉ',
    
    // Reporting Center
    reportingCenter: 'CENTRE DE RAPPORTS',
    ready: 'PRÊT',
    daily: 'JOURNALIER',
    dailyDesc: 'Activités des dernières 24h',
    weekly: 'HEBDO',
    weeklyDesc: "Tendances d'immunité 7j",
    monthly: 'MENSUEL',
    monthlyDesc: 'Bilan de sécurité global',
    exportPdf: 'EXPORTER PDF',
    
    // Audit Logs
    auditLogExplorer: 'EXPLORATEUR LOGS AUDIT',
    events: 'ÉVÉNEMENTS',
    all: 'TOUS',
    success: 'SUCCÈS',
    warning: 'AVERTISSEMENT',
    error: 'ERREUR',
    timestamp: 'HORODATAGE',
    user: 'UTILISATEUR',
    resource: 'RESSOURCE',
    status: 'STATUT',
    lastUpdate: 'Dernière mise à jour',
    displaying: 'Affichage',
    
    // Community Rules
    communityRules: 'MARCHÉ RÈGLES COMMUNAUTAIRES',
    rulesInstalled: 'règles installées',
    available: 'DISPONIBLES',
    install: 'INSTALLER',
    installed: 'INSTALLÉ',
    installing: 'INSTALLATION...',
    installs: 'installations',
    
    // Compliance
    loi25Compliance: 'SCORE CONFORMITÉ LOI 25',
    dataProtected: "Nawal, vos données sont protégées et isolées. L'intégrité SHA-256 est vérifiée sur chaque pack de preuves.",
    
    // System Health
    systemHealth: 'SANTÉ SYSTÈME',
    
    // Investigation Modal
    detailedInvestigation: 'INVESTIGATION DÉTAILLÉE',
    event: 'Événement',
    completeFile: "Dossier complet de l'incident",
    timelineComplete: 'TIMELINE COMPLÈTE',
    eventSequence: 'Event Sequence & Correlation Analysis',
    timelineDesc: "Voyez minute par minute ce qui s'est passé avant, pendant et après l'alerte",
    evidencePacks: 'EVIDENCE PACKS',
    forensicArtifacts: 'Forensic Artifacts & IOCs (Indicators of Compromise)',
    evidenceDesc: "Fichiers suspects, captures d'écran, emails collectés automatiquement comme preuves",
    sourceAttribution: 'ATTRIBUTION SOURCE',
    userAgent: 'User-Agent, Geolocalisation IP & Device Fingerprinting',
    sourceDesc: "D'où vient la menace: pays, ville, type d'appareil utilisé pour l'attaque",
    stacktrace: 'STACKTRACE TECHNIQUE',
    codeExecution: 'Code Execution Path & Vulnerability Exploitation',
    stacktraceDesc: "Pour votre équipe IT: code exact exploité et lignes de système affectées",
    remediationPlaybook: 'PLAYBOOK REMÉDIATION',
    automatedResponse: 'Automated Response Actions & SOAR Integration',
    remediationDesc: "Ce que Lumensec vous conseille: bloquer IP, réinitialiser mot de passe, patcher serveur",
    dataAvailable: 'Données disponibles dans version complète',
    forensicInvestigation: 'Investigation Forensique Automatisée',
    availableEnterprise: 'Disponible dans Lumensec Enterprise',
  },
  
  en: {
    // Header
    dashboard: 'DASHBOARD',
    cartography: 'CARTOGRAPHY',
    
    // KPIs
    activeAlerts: 'ACTIVE ALERTS',
    autoNeutralized: 'AUTO-NEUTRALIZED',
    noiseReduction: 'NOISE REDUCED',
    threatLevel: 'THREAT LEVEL',
    seenClean: 'SEEN CLEAN',
    
    // Incidents Table
    ingestionLayer: 'INGESTION LAYER: MASTER RADAR',
    webhookApi: 'Webhook API',
    emailGateway: 'Email Gateway',
    traceId: 'TRACE ID',
    severity: 'SEVERITY',
    inferenceStatus: 'INFERENCE STATUS',
    action: 'ACTION',
    
    // Severity
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    
    // Status
    new: 'NEW',
    triaging: 'TRIAGING',
    resolved: 'RESOLVED',
    immunized: 'IMMUNIZED',
    silenced: 'SILENCED',
    remediated: 'REMEDIATED',
    
    // Reporting Center
    reportingCenter: 'REPORTING CENTER',
    ready: 'READY',
    daily: 'DAILY',
    dailyDesc: 'Last 24h activities',
    weekly: 'WEEKLY',
    weeklyDesc: '7-day immunity trends',
    monthly: 'MONTHLY',
    monthlyDesc: 'Global security report',
    exportPdf: 'EXPORT PDF',
    
    // Audit Logs
    auditLogExplorer: 'AUDIT LOG EXPLORER',
    events: 'EVENTS',
    all: 'ALL',
    success: 'SUCCESS',
    warning: 'WARNING',
    error: 'ERROR',
    timestamp: 'TIMESTAMP',
    user: 'USER',
    resource: 'RESOURCE',
    status: 'STATUS',
    lastUpdate: 'Last update',
    displaying: 'Displaying',
    
    // Community Rules
    communityRules: 'COMMUNITY RULES MARKET',
    rulesInstalled: 'rules installed',
    available: 'AVAILABLE',
    install: 'INSTALL',
    installed: 'INSTALLED',
    installing: 'INSTALLING...',
    installs: 'installs',
    
    // Compliance
    loi25Compliance: 'LOI 25 COMPLIANCE SCORE',
    dataProtected: "Nawal, your data is protected and isolated. SHA-256 integrity is verified on every evidence pack.",
    
    // System Health
    systemHealth: 'SYSTEM HEALTH',
    
    // Investigation Modal
    detailedInvestigation: 'DETAILED INVESTIGATION',
    event: 'Event',
    completeFile: 'Complete incident file',
    timelineComplete: 'COMPLETE TIMELINE',
    eventSequence: 'Event Sequence & Correlation Analysis',
    timelineDesc: 'See minute-by-minute what happened before, during and after the alert',
    evidencePacks: 'EVIDENCE PACKS',
    forensicArtifacts: 'Forensic Artifacts & IOCs (Indicators of Compromise)',
    evidenceDesc: 'Suspicious files, screenshots, emails collected automatically as evidence',
    sourceAttribution: 'SOURCE ATTRIBUTION',
    userAgent: 'User-Agent, IP Geolocation & Device Fingerprinting',
    sourceDesc: 'Where the threat comes from: country, city, device type used for attack',
    stacktrace: 'TECHNICAL STACKTRACE',
    codeExecution: 'Code Execution Path & Vulnerability Exploitation',
    stacktraceDesc: 'For your IT team: exact code exploited and affected system lines',
    remediationPlaybook: 'REMEDIATION PLAYBOOK',
    automatedResponse: 'Automated Response Actions & SOAR Integration',
    remediationDesc: 'What Lumensec recommends: block IP, reset password, patch server',
    dataAvailable: 'Data available in full version',
    forensicInvestigation: 'Automated Forensic Investigation',
    availableEnterprise: 'Available in Lumensec Enterprise',
  }
};

export type Language = 'fr' | 'en';