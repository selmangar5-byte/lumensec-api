20.times do |i|
  Incident.create!(
    tenant_id: '1',
    source: ['Crowdstrike', 'Azure Sentinel', 'Firewall', 'EDR', 'SIEM'].sample,
    severity: rand(1..5),
    status: ['new', 'triaging', 'resolved'].sample,
    summary: "Incident de test ##{i+1}",
    narrative: "Détails incident #{i+1}",
    source_ip: "192.168.#{rand(1..255)}.#{rand(1..255)}",
    target_system: "Server-#{rand(1..50)}",
    event_key: "SEED-#{i+1}"
  )
end
puts "✅ 20 incidents créés"
