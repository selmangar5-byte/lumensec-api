tenant = Tenant.find(1)

incidents_data = [
  {severity: 5, status: "investigating", source: "CrowdStrike Falcon", summary: "Ransomware activity detected", narrative: "WannaCry variant identified encrypting files on file server", source_ip: "203.0.113.45", target_system: "FileServer-PROD-01"},
  {severity: 5, status: "contained", source: "Azure Sentinel", summary: "Mass data exfiltration to China", narrative: "15GB transferred to Shanghai IP in 2 hours", source_ip: "192.0.2.88", target_system: "Database-PROD"},
  {severity: 4, status: "resolved", source: "Custom Firewall", summary: "SQL Injection attempt on customer portal", narrative: "Multiple SQLi patterns detected, WAF blocked 847 requests", source_ip: "198.51.100.42", target_system: "WebPortal"},
  {severity: 4, status: "investigating", source: "Okta", summary: "Brute force attack on VPN", narrative: "3200 failed login attempts from Russian IP", source_ip: "203.0.113.156", target_system: "VPN-Gateway"},
  {severity: 4, status: "triaging", source: "Proofpoint", summary: "Executive spear-phishing campaign", narrative: "CEO impersonation email with malicious Office macro", source_ip: "198.51.100.77", target_system: "Exchange-Server"},
  {severity: 4, status: "new", source: "Qualys", summary: "Zero-day Log4Shell exploitation", narrative: "CVE-2021-44228 exploit detected on Java app server", source_ip: "192.0.2.199", target_system: "AppServer-03"},
  {severity: 4, status: "contained", source: "EDR", summary: "Privilege escalation via kernel exploit", narrative: "Local user gained SYSTEM via CVE-2023-12345", source_ip: "10.0.5.42", target_system: "Workstation-HR-12"},
  {severity: 3, status: "resolved", source: "Cloudflare", summary: "DDoS attack mitigated", narrative: "240Gbps volumetric attack blocked by CDN", source_ip: "203.0.113.0/24", target_system: "Public-Website"},
  {severity: 3, status: "investigating", source: "Splunk", summary: "Insider threat - suspicious file access", narrative: "Employee accessed 5000+ customer records at 3AM", source_ip: "10.0.8.156", target_system: "CRM-Database"},
  {severity: 3, status: "triaging", source: "Windows Defender", summary: "Emotet trojan detected", narrative: "Banking trojan found on Finance dept workstation", source_ip: "10.0.2.88", target_system: "Finance-WS-07"},
  {severity: 3, status: "new", source: "AWS GuardDuty", summary: "S3 bucket misconfiguration", narrative: "Public read access on bucket with PII data", source_ip: "N/A", target_system: "s3://customer-backups"},
  {severity: 3, status: "resolved", source: "Network IDS", summary: "DNS tunneling detected", narrative: "Command & control via DNS TXT records", source_ip: "192.0.2.45", target_system: "Internal-Network"},
  {severity: 3, status: "investigating", source: "Azure AD", summary: "Compromised service account", narrative: "Service account used from 3 countries in 10 minutes", source_ip: "Multiple", target_system: "AD-Domain"},
  {severity: 3, status: "contained", source: "Palo Alto", summary: "APT29 C2 traffic blocked", narrative: "Known APT infrastructure contacted by workstation", source_ip: "10.0.9.23", target_system: "DevOps-WS-04"},
  {severity: 3, status: "triaging", source: "Nessus", summary: "Critical vulnerability on web server", narrative: "Apache Struts RCE vulnerability unpatched", source_ip: "N/A", target_system: "WebServer-DMZ-02"},
  {severity: 2, status: "resolved", source: "Certificate Monitor", summary: "SSL certificate expiring soon", narrative: "Wildcard cert for *.company.com expires in 7 days", source_ip: "N/A", target_system: "Load-Balancer"},
  {severity: 2, status: "investigating", source: "Duo Security", summary: "Anomalous login from new location", narrative: "User logged in from Nigeria, usual location is Canada", source_ip: "41.58.123.45", target_system: "Office365"},
  {severity: 2, status: "new", source: "SIEM", summary: "Policy violation - unauthorized software", narrative: "Torrent client detected on corporate laptop", source_ip: "10.0.3.99", target_system: "Sales-Laptop-23"},
  {severity: 1, status: "resolved", source: "Vulnerability Scanner", summary: "Outdated JavaScript library", narrative: "jQuery 1.x detected, no active exploitation", source_ip: "N/A", target_system: "Internal-Portal"},
  {severity: 1, status: "new", source: "Log Analysis", summary: "Failed backup job", narrative: "Nightly backup to NAS failed, disk full", source_ip: "10.0.10.50", target_system: "Backup-Server"}
]

incidents_data.each_with_index do |data, i|
  incident = Incident.create!(
    tenant_id: tenant.id,
    source: data[:source],
    severity: data[:severity],
    status: data[:status],
    summary: data[:summary],
    narrative: data[:narrative],
    source_ip: data[:source_ip],
    target_system: data[:target_system],
    event_key: "DEMO-#{Time.now.to_i}-#{i}",
    created_at: Time.now - rand(1..7).days
  )
  
  AnalysisResult.create!(
    incident_id: incident.id,
    tenant_id: tenant.id,
    verdict: ["malicious", "suspicious", "benign"][rand(3)],
    confidence: rand(70..99),
    summary: "AI analysis: #{data[:summary]}",
    narrative: "Automated triage completed. #{data[:narrative]}"
  )
end

puts "✅ Created #{incidents_data.count} demo incidents"
