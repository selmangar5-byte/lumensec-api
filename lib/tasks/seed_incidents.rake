namespace :db do
  task seed_incidents: :environment do
    incidents_data = [
      {source: 'Crowdstrike', severity: 5, status: 'new', summary: 'Ransomware détecté', narrative: 'Tentative chiffrement fichiers', source_ip: '192.168.1.50', target_system: 'SRV-DB-01'},
      {source: 'Azure Sentinel', severity: 4, status: 'triaging', summary: 'Brute force SSH', narrative: '1000+ tentatives connexion', source_ip: '91.234.56.78', target_system: 'WEB-SRV-02'},
      {source: 'Firewall', severity: 3, status: 'resolved', summary: 'Port scan détecté', narrative: 'Scan Nmap ports 80-8080', source_ip: '10.0.0.15', target_system: 'DMZ-FW-01'},
      {source: 'EDR', severity: 5, status: 'new', summary: 'Lateral movement', narrative: 'Connexion RDP suspecte', source_ip: '172.16.5.100', target_system: 'SRV-AD-01'},
      {source: 'SIEM', severity: 4, status: 'triaging', summary: 'Exfiltration données', narrative: 'Upload 5GB vers IP externe', source_ip: '192.168.10.80', target_system: 'SRV-FILE-01'},
      {source: 'IDS', severity: 2, status: 'resolved', summary: 'Malware download', narrative: 'Téléchargement .exe suspect', source_ip: '10.50.1.25', target_system: 'DESK-USER-042'},
      {source: 'Proxy', severity: 3, status: 'new', summary: 'C2 communication', narrative: 'Connexion vers domaine malveillant', source_ip: '192.168.2.99', target_system: 'LAPTOP-DEV-15'},
      {source: 'Email Gateway', severity: 2, status: 'resolved', summary: 'Phishing détecté', narrative: 'Email avec lien malveillant', source_ip: 'N/A', target_system: 'MAIL-RELAY'},
      {source: 'WAF', severity: 4, status: 'triaging', summary: 'SQL Injection', narrative: 'Tentative injection base données', source_ip: '203.0.113.45', target_system: 'WEB-APP-01'},
      {source: 'DLP', severity: 3, status: 'new', summary: 'Fuite données', narrative: 'Envoi fichier confidentiel', source_ip: '192.168.5.120', target_system: 'DESK-FIN-08'},
      {source: 'Antivirus', severity: 5, status: 'new', summary: 'Trojan détecté', narrative: 'Backdoor actif sur serveur', source_ip: '10.20.30.40', target_system: 'SRV-WEB-05'},
      {source: 'Network IDS', severity: 4, status: 'triaging', summary: 'DDoS attempt', narrative: 'Flood SYN packets détecté', source_ip: '185.220.101.50', target_system: 'EDGE-RTR-01'},
      {source: 'Cloud Security', severity: 3, status: 'resolved', summary: 'Accès non autorisé', narrative: 'Connexion depuis pays bloqué', source_ip: '45.33.21.100', target_system: 'AWS-EC2-PROD'},
      {source: 'Endpoint', severity: 2, status: 'new', summary: 'Crypto miner', narrative: 'Process minage crypto détecté', source_ip: '192.168.8.77', target_system: 'LAPTOP-IT-22'},
      {source: 'AD Logs', severity: 4, status: 'triaging', summary: 'Privilege escalation', narrative: 'Compte utilisateur → Admin', source_ip: '172.20.1.50', target_system: 'DC-PRIMARY'},
      {source: 'VPN', severity: 3, status: 'resolved', summary: 'Connexion suspecte', narrative: 'VPN depuis TOR exit node', source_ip: '185.220.102.8', target_system: 'VPN-GATEWAY'},
      {source: 'Database', severity: 5, status: 'new', summary: 'Unauthorized query', narrative: 'SELECT * FROM users_passwords', source_ip: '10.100.5.200', target_system: 'DB-MYSQL-PROD'},
      {source: 'Backup System', severity: 2, status: 'resolved', summary: 'Backup tampered', narrative: 'Fichiers backup modifiés', source_ip: '192.168.99.10', target_system: 'BACKUP-SRV-01'},
      {source: 'API Gateway', severity: 4, status: 'triaging', summary: 'Rate limit breach', narrative: '10000 req/sec API abuse', source_ip: '104.28.5.100', target_system: 'API-GW-PROD'},
      {source: 'Container Security', severity: 3, status: 'new', summary: 'Vulnerable image', narrative: 'Docker image avec CVE critique', source_ip: 'N/A', target_system: 'K8S-CLUSTER-01'}
    ]
    
    incidents_data.each do |data|
      Incident.create!(
        tenant_id: '1',
        source: data[:source],
        severity: data[:severity],
        status: data[:status],
        summary: data[:summary],
        narrative: data[:narrative],
        source_ip: data[:source_ip],
        target_system: data[:target_system],
        event_key: "SEED-#{SecureRandom.hex(4)}"
      )
    end
    
    puts "✅ Created #{incidents_data.count} incidents"
  end
end
