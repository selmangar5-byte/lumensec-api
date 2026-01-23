# Nettoyer la base de données (seulement en développement)
if Rails.env.development?
  puts "🧹 Nettoyage de la base de données..."
  EvidencePack.destroy_all
  AnalysisResult.destroy_all
  WebhookEvent.destroy_all
  Tenant.destroy_all
  puts "✅ Base nettoyée"
end

# Créer un tenant de démonstration
puts "\n🏢 Création du tenant de démo..."
tenant = Tenant.create!(
  webhook_secret: SecureRandom.hex(32)
)

puts "✅ Tenant créé !"
puts "   📋 ID: #{tenant.id}"
puts "   🔑 Webhook secret: #{tenant.webhook_secret}"

# Créer un événement webhook
puts "\n📨 Création d'un événement webhook..."
event = tenant.webhook_events.create!(
  source: "crowdstrike",
  event_id: "evt_#{SecureRandom.hex(8)}",
  fingerprint: SecureRandom.hex(16),
  payload: {
    "alert_type" => "malware_detection",
    "severity" => "high",
    "host" => "workstation-42",
    "user" => "jdoe@example.com",
    "timestamp" => Time.current.iso8601
  }
)

puts "✅ Webhook event créé !"
puts "   📋 ID: #{event.id}"

# Créer une analyse
puts "\n🔍 Création d'une analyse..."
analysis = AnalysisResult.create!(
  tenant: tenant,
  webhook_event: event,
  correlation_id: event.id,
  source: event.source,
  event_key: { event_id: event.event_id },
  triage: { 
    priority: "high", 
    confidence: 0.95,
    verdict: "malicious"
  },
  narrative: { 
    summary: "Malware détecté sur workstation-42",
    details: "Un fichier malveillant a été détecté et bloqué"
  },
  evidence: { 
    files: ["malware.exe"], 
    hashes: ["abc123def456"],
    processes: ["suspicious.exe"]
  }
)

puts "✅ Analysis result créé !"
puts "   📋 ID: #{analysis.id}"

# Créer un evidence pack
puts "\n📦 Création d'un evidence pack..."
pack = EvidencePack.create!(
  analysis_result: analysis,
  data: {
    pack_label: "Incident Malware - #{Date.today}",
    items: [
      { 
        type: "file", 
        name: "malware.exe", 
        hash: "abc123def456",
        threat_level: "critical"
      },
      { 
        type: "process", 
        name: "suspicious.exe", 
        pid: 1234,
        parent_process: "explorer.exe"
      }
    ],
    confidence_score: 0.95
  }
)

puts "✅ Evidence pack créé !"
puts "   📋 ID: #{pack.id}"

puts "\n" + "="*60
puts "🎉 SEEDS COMPLÉTÉS AVEC SUCCÈS !"
puts "="*60
puts "\n📊 RÉSUMÉ DES DONNÉES CRÉÉES :"
puts "   • 1 Tenant"
puts "   • 1 Webhook Event"
puts "   • 1 Analysis Result"
puts "   • 1 Evidence Pack"
puts "\n🔑 IDs IMPORTANTS (garde-les pour tester) :"
puts "   Tenant ID:         #{tenant.id}"
puts "   Webhook Event ID:  #{event.id}"
puts "   Analysis ID:       #{analysis.id}"
puts "   Evidence Pack ID:  #{pack.id}"
puts "\n💡 Pour tester dans la console Rails, tape :"
puts "   rails console"
puts "   Puis essaie : Tenant.first"
puts "="*60
