
# © 2025 Lumensec - Données de Simulation SOC pour Nawal
puts "--- INITIALISATION DU SOC LUMENSEC ---"

AnalysisResult.destroy_all

incidents = [
  {
    tenant_id: "1",
    source: "Crowdstrike Falcon",
    status: "new",
    severity: 5,
    narrative: { summary: "Tentative d'exfiltration via Powershell encodé", details: "Le process powershell.exe a tenté de contacter une IP connue pour du C2 (91.x.x.x)" },
    triage: { verdict: "Malicious", priority: "Urgent", confidence: 0.98 },
    evidence: { processes: ["powershell.exe", "cmd.exe"], hashes: ["a1b2c3d4e5f6..."] }
  },
  {
    tenant_id: "1",
    source: "Azure Sentinel",
    status: "triaging",
    severity: 4,
    narrative: { summary: "Brute Force SSH détecté sur Web-SRV-01", details: "Plus de 500 tentatives de connexion en 2 minutes depuis la Chine." },
    triage: { verdict: "Suspicious", priority: "High", confidence: 0.85 },
    evidence: { processes: ["sshd"], hashes: [] }
  },
  {
    tenant_id: "1",
    source: "Custom Firewall",
    status: "resolved",
    severity: 2,
    narrative: { summary: "Scan de ports détecté", details: "Scan Nmap sur les ports 80, 443, 8080." },
    triage: { verdict: "Reconnaissance", priority: "Low", confidence: 0.70 },
    evidence: { processes: [], hashes: [] }
  }
]

incidents.each do |inc|
  result = AnalysisResult.create!(inc)
  
  # Création d'un pack de preuves pour l'incident critique
  if result.severity >= 4
    EvidencePack.create!(
      analysis_result: result,
      data: {
        pack_label: "Digital Forensic Pack Alpha",
        confidence_score: 0.95,
        items: [
          { type: "IP", label: "Attacker IP", value: "91.234.56.78" },
          { type: "FILE", label: "Malicious Script", value: "/tmp/exploit.sh" },
          { type: "MD5", label: "Payload Hash", value: "5d41402abc4b2a76b9719d911017c592" }
        ]
      }
    )
  end
end

puts "--- SEED TERMINÉ : #{AnalysisResult.count} INCIDENTS CRÉÉS POUR NAWAL ---"
