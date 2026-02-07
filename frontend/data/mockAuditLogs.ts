export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  ip: string;
  details: string;
}

export const mockAuditLogs: AuditLog[] = [
  { id: '1', timestamp: '2026-02-07 09:15:42', user: 'admin@lumensec.io', action: 'LOGIN', resource: 'Dashboard', status: 'SUCCESS', ip: '192.168.1.105', details: 'Connexion réussie depuis Québec' },
  { id: '2', timestamp: '2026-02-07 09:12:18', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #283', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Sévérité faible' },
  { id: '3', timestamp: '2026-02-07 09:08:33', user: 'analyst.martin@lumensec.io', action: 'UPDATE_RULE', resource: 'Rule #42 - Brute Force Detection', status: 'SUCCESS', ip: '192.168.1.87', details: 'Seuil modifié: 5 → 3 tentatives' },
  { id: '4', timestamp: '2026-02-07 09:05:12', user: 'system', action: 'ALERT_TRIGGERED', resource: 'EDR Endpoint-12', status: 'WARNING', ip: '172.16.45.23', details: 'Activité suspecte détectée - Processus non-autorisé' },
  { id: '5', timestamp: '2026-02-07 09:02:47', user: 'admin@lumensec.io', action: 'EXPORT_REPORT', resource: 'Rapport Mensuel Janvier 2026', status: 'SUCCESS', ip: '192.168.1.105', details: 'Export PDF généré avec succès' },
  { id: '6', timestamp: '2026-02-07 08:58:21', user: 'system', action: 'BACKUP_COMPLETED', resource: 'PostgreSQL Database', status: 'SUCCESS', ip: '10.0.0.1', details: 'Sauvegarde automatique 3.2 GB' },
  { id: '7', timestamp: '2026-02-07 08:45:09', user: 'analyst.dubois@lumensec.io', action: 'CLOSE_INCIDENT', resource: 'Incident #281', status: 'SUCCESS', ip: '192.168.1.92', details: 'Incident résolu - False positive confirmé' },
  { id: '8', timestamp: '2026-02-07 08:42:15', user: 'system', action: 'SCAN_COMPLETED', resource: 'Network Scan - Subnet 192.168.0.0/24', status: 'SUCCESS', ip: '10.0.0.1', details: '254 hôtes scannés - Aucune vulnérabilité critique' },
  { id: '9', timestamp: '2026-02-07 08:38:44', user: 'admin@lumensec.io', action: 'CREATE_USER', resource: 'User: analyst.tremblay@lumensec.io', status: 'SUCCESS', ip: '192.168.1.105', details: 'Nouvel analyste SOC ajouté - Rôle: Analyst' },
  { id: '10', timestamp: '2026-02-07 08:35:28', user: 'system', action: 'RULE_DEPLOYED', resource: 'Community Rule #156 - Ransomware Detection', status: 'SUCCESS', ip: '10.0.0.1', details: 'Règle installée et activée automatiquement' },
  { id: '11', timestamp: '2026-02-07 08:30:12', user: 'analyst.martin@lumensec.io', action: 'INVESTIGATE', resource: 'Incident #279', status: 'SUCCESS', ip: '192.168.1.87', details: 'Investigation approfondie - Logs collectés' },
  { id: '12', timestamp: '2026-02-07 08:25:47', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #278', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Noise reduction activée' },
  { id: '13', timestamp: '2026-02-07 08:18:33', user: 'system', action: 'CERTIFICATE_RENEWED', resource: 'SSL Certificate lumensec.io', status: 'SUCCESS', ip: '10.0.0.1', details: 'Certificat renouvelé - Expiration: 2027-02-07' },
  { id: '14', timestamp: '2026-02-07 08:12:05', user: 'admin@lumensec.io', action: 'CONFIG_CHANGE', resource: 'Alert Threshold Configuration', status: 'WARNING', ip: '192.168.1.105', details: 'Seuil critique modifié: 8 → 10 incidents/min' },
  { id: '15', timestamp: '2026-02-07 08:08:42', user: 'system', action: 'HEALTH_CHECK', resource: 'All Services', status: 'SUCCESS', ip: '10.0.0.1', details: 'Tous les services opérationnels - Latency: 12ms' },
  { id: '16', timestamp: '2026-02-07 08:02:18', user: 'analyst.dubois@lumensec.io', action: 'ASSIGN_INCIDENT', resource: 'Incident #276', status: 'SUCCESS', ip: '192.168.1.92', details: 'Incident assigné à analyst.martin@lumensec.io' },
  { id: '17', timestamp: '2026-02-07 07:58:39', user: 'system', action: 'INTEGRATION_SYNC', resource: 'Azure Sentinel Connector', status: 'SUCCESS', ip: '10.0.0.1', details: 'Synchronisation complétée - 47 nouveaux events' },
  { id: '18', timestamp: '2026-02-07 07:52:21', user: 'system', action: 'ALERT_TRIGGERED', resource: 'Firewall Rule Violation', status: 'ERROR', ip: '203.45.67.89', details: 'Tentative accès non-autorisé bloquée - IP blacklistée' },
  { id: '19', timestamp: '2026-02-07 07:45:14', user: 'admin@lumensec.io', action: 'DELETE_RULE', resource: 'Rule #38 - Deprecated Detection', status: 'SUCCESS', ip: '192.168.1.105', details: 'Règle obsolète supprimée du système' },
  { id: '20', timestamp: '2026-02-07 07:38:47', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #272', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Pattern matched: False positive' },
  { id: '21', timestamp: '2026-02-07 07:32:09', user: 'analyst.martin@lumensec.io', action: 'ESCALATE', resource: 'Incident #270', status: 'WARNING', ip: '192.168.1.87', details: 'Incident escaladé - Sévérité élevée détectée' },
  { id: '22', timestamp: '2026-02-07 07:28:55', user: 'system', action: 'BACKUP_STARTED', resource: 'PostgreSQL Database', status: 'SUCCESS', ip: '10.0.0.1', details: 'Sauvegarde quotidienne initiée' },
  { id: '23', timestamp: '2026-02-07 07:22:31', user: 'system', action: 'SCAN_COMPLETED', resource: 'Vulnerability Scan - Critical Assets', status: 'SUCCESS', ip: '10.0.0.1', details: '12 actifs scannés - 2 vulnérabilités mineures détectées' },
  { id: '24', timestamp: '2026-02-07 07:15:18', user: 'admin@lumensec.io', action: 'UPDATE_POLICY', resource: 'Password Policy', status: 'SUCCESS', ip: '192.168.1.105', details: 'Complexité renforcée - Min: 12 caractères + 2FA obligatoire' },
  { id: '25', timestamp: '2026-02-07 07:08:42', user: 'system', action: 'INTEGRATION_SYNC', resource: 'EDR Platform Connector', status: 'SUCCESS', ip: '10.0.0.1', details: 'Synchronisation complétée - 83 endpoints actifs' },
  { id: '26', timestamp: '2026-02-07 07:02:14', user: 'analyst.dubois@lumensec.io', action: 'ADD_COMMENT', resource: 'Incident #268', status: 'SUCCESS', ip: '192.168.1.92', details: 'Commentaire ajouté: Investigation en cours avec équipe réseau' },
  { id: '27', timestamp: '2026-02-07 06:58:37', user: 'system', action: 'ALERT_TRIGGERED', resource: 'Anomaly Detection - Database Query', status: 'WARNING', ip: '10.45.23.67', details: 'Requête SQL inhabituelle détectée - Analyse en cours' },
  { id: '28', timestamp: '2026-02-07 06:52:09', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #265', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Confidence: 98%' },
  { id: '29', timestamp: '2026-02-07 06:45:28', user: 'admin@lumensec.io', action: 'LOGOUT', resource: 'Dashboard', status: 'SUCCESS', ip: '192.168.1.105', details: 'Session terminée normalement' },
  { id: '30', timestamp: '2026-02-07 06:38:41', user: 'system', action: 'HEALTH_CHECK', resource: 'All Services', status: 'SUCCESS', ip: '10.0.0.1', details: 'Tous les services opérationnels - Latency: 8ms' },
  { id: '31', timestamp: '2026-02-07 06:32:15', user: 'system', action: 'RULE_DEPLOYED', resource: 'Community Rule #159 - DDoS Mitigation', status: 'SUCCESS', ip: '10.0.0.1', details: 'Règle installée et activée automatiquement' },
  { id: '32', timestamp: '2026-02-07 06:25:47', user: 'analyst.martin@lumensec.io', action: 'LOGIN', resource: 'Dashboard', status: 'SUCCESS', ip: '192.168.1.87', details: 'Connexion réussie depuis Montréal' },
  { id: '33', timestamp: '2026-02-07 06:18:33', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #262', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Sévérité faible' },
  { id: '34', timestamp: '2026-02-07 06:12:09', user: 'system', action: 'INTEGRATION_SYNC', resource: 'SIEM Platform Connector', status: 'SUCCESS', ip: '10.0.0.1', details: 'Synchronisation complétée - 124 nouveaux logs' },
  { id: '35', timestamp: '2026-02-07 06:05:41', user: 'system', action: 'CERTIFICATE_CHECK', resource: 'All SSL Certificates', status: 'SUCCESS', ip: '10.0.0.1', details: 'Tous les certificats valides - Prochaine expiration: 45 jours' },
  { id: '36', timestamp: '2026-02-07 05:58:22', user: 'system', action: 'BACKUP_COMPLETED', resource: 'Configuration Files', status: 'SUCCESS', ip: '10.0.0.1', details: 'Sauvegarde config complétée - 145 MB' },
  { id: '37', timestamp: '2026-02-07 05:52:14', user: 'system', action: 'ALERT_TRIGGERED', resource: 'Memory Usage - Server-03', status: 'WARNING', ip: '10.0.5.12', details: 'Utilisation mémoire: 87% - Seuil: 85%' },
  { id: '38', timestamp: '2026-02-07 05:45:38', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #258', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Pattern matched' },
  { id: '39', timestamp: '2026-02-07 05:38:19', user: 'system', action: 'SCAN_COMPLETED', resource: 'Port Scan - External Perimeter', status: 'SUCCESS', ip: '10.0.0.1', details: 'Tous les ports sécurisés - Aucune exposition non-autorisée' },
  { id: '40', timestamp: '2026-02-07 05:32:47', user: 'system', action: 'HEALTH_CHECK', resource: 'Database Connections', status: 'SUCCESS', ip: '10.0.0.1', details: 'Pool: 45/100 connexions actives' },
  { id: '41', timestamp: '2026-02-07 05:25:11', user: 'system', action: 'RULE_UPDATED', resource: 'Rule #67 - SQL Injection Detection', status: 'SUCCESS', ip: '10.0.0.1', details: 'Pattern mis à jour - Nouvelles signatures ajoutées' },
  { id: '42', timestamp: '2026-02-07 05:18:39', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #254', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Noise reduction' },
  { id: '43', timestamp: '2026-02-07 05:12:05', user: 'system', action: 'INTEGRATION_SYNC', resource: 'Cloud Security Posture', status: 'SUCCESS', ip: '10.0.0.1', details: 'Synchronisation AWS complétée - 34 ressources analysées' },
  { id: '44', timestamp: '2026-02-07 05:05:28', user: 'system', action: 'ALERT_TRIGGERED', resource: 'Disk Usage - Log Server', status: 'WARNING', ip: '10.0.8.45', details: 'Utilisation disque: 78% - Rotation logs planifiée' },
  { id: '45', timestamp: '2026-02-07 04:58:42', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #250', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Confidence: 95%' },
  { id: '46', timestamp: '2026-02-07 04:52:14', user: 'system', action: 'BACKUP_STARTED', resource: 'Incident Evidence Archive', status: 'SUCCESS', ip: '10.0.0.1', details: 'Archivage incidents résolus > 90 jours' },
  { id: '47', timestamp: '2026-02-07 04:45:37', user: 'system', action: 'HEALTH_CHECK', resource: 'All Services', status: 'SUCCESS', ip: '10.0.0.1', details: 'Tous les services opérationnels - Latency: 10ms' },
  { id: '48', timestamp: '2026-02-07 04:38:09', user: 'system', action: 'SCAN_COMPLETED', resource: 'Malware Scan - Email Gateway', status: 'SUCCESS', ip: '10.0.0.1', details: '1,247 emails scannés - 3 menaces bloquées' },
  { id: '49', timestamp: '2026-02-07 04:32:41', user: 'system', action: 'INTEGRATION_SYNC', resource: 'Threat Intelligence Feed', status: 'SUCCESS', ip: '10.0.0.1', details: '87 nouveaux IOCs ajoutés à la blacklist' },
  { id: '50', timestamp: '2026-02-07 04:25:18', user: 'system', action: 'AUTO_NEUTRALIZE', resource: 'Incident #246', status: 'SUCCESS', ip: '10.0.0.1', details: 'Neutralisation automatique - Sévérité faible' },
];