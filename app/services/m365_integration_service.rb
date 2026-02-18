require 'net/http'
require 'json'

class M365IntegrationService
  def initialize(tenant_id, mode: ENV.fetch('M365_MODE', 'mock'))
    @tenant_id = tenant_id
    @mode = mode
  end
  
  def fetch_security_alerts
    return mock_alerts if @mode == 'mock'
    real_alerts
  end
  
  private
  
  def mock_alerts
    [
      {
        alert_id: "SEC-2026-001",
        title: "Tentative de phishing détectée",
        description: "Email malveillant détecté contenant un lien vers un site de phishing bancaire. L'email a été bloqué par Microsoft Defender.",
        severity: "high",
        status: "new_alert",
        category: "phishing",
        user_email: "comptable@client-test.com",
        ip_address: "185.220.101.42",
        detected_at: 2.hours.ago,
        recommended_action: "Vérifier si l'utilisateur a cliqué sur le lien. Réinitialiser le mot de passe si suspicion de compromission."
      },
      {
        alert_id: "SEC-2026-002", 
        title: "Connexion suspecte depuis l'étranger",
        description: "Connexion détectée depuis l'Ukraine (IP: 91.203.164.11) pour un utilisateur basé à Montréal. Pas d'historique de voyage signalé.",
        severity: "critical",
        status: "in_progress",
        category: "suspiciousLogin",
        user_email: "dg@client-test.com",
        ip_address: "91.203.164.11",
        detected_at: 5.hours.ago,
        recommended_action: "Bloquer immédiatement la session. Contacter l'utilisateur pour vérification. Activer MFA si pas déjà fait."
      },
      {
        alert_id: "SEC-2026-003",
        title: "Téléchargement de malware bloqué",
        description: "Microsoft Defender a bloqué le téléchargement d'un fichier contenant le trojan Emotet. Le fichier a été mis en quarantaine.",
        severity: "medium",
        status: "resolved",
        category: "malware",
        user_email: "assistant@client-test.com",
        ip_address: nil,
        detected_at: 1.day.ago,
        recommended_action: "Nettoyer la quarantaine. Scanner l'appareil complet. Formation utilisateur sur les pièces jointes suspectes."
      },
      {
        alert_id: "SEC-2026-004",
        title: "Partage de fichier anonyme suspect",
        description: "Un lien de partage anonyme a été créé sur un document contenant des données clients. Risque de fuite de données.",
        severity: "high",
        status: "new_alert",
        category: "dataExfiltration",
        user_email: "marketing@client-test.com",
        ip_address: nil,
        detected_at: 3.hours.ago,
        recommended_action: "Révoquer immédiatement le lien de partage. Auditer les accès au document. Vérifier la classification du document."
      }
    ]
  end
  
  def real_alerts
    token = get_access_token
    uri = URI("https://graph.microsoft.com/v1.0/security/alerts")
    
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{token}"
    req['Accept'] = 'application/json'
    
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    
    JSON.parse(res.body)['value']
  end
  
  def get_access_token
    raise "Not implemented yet - waiting for real M365 credentials"
  end
end