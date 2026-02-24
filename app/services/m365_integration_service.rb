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
  
  # AJOUT : Vérification MFA (nouvelle méthode)
  def verify_mfa_status
    return mock_mfa_verification if @mode == 'mock'
    real_mfa_verification
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
  
  # AJOUT : Mock MFA vérification réaliste
  def mock_mfa_verification
    credential = M365Credential.find_by(tenant_id: @tenant_id)
    
    unless credential
      return {
        verified: false,
        connected: false,
        coverage_percentage: 0,
        total_users: 0,
        mfa_enabled_users: 0,
        admin_mfa_enabled: false,
        security_defaults_enabled: false,
        recommendation: "Connecter M365 pour vérifier le MFA",
        discrepancies: []
      }
    end
    
    # Simulation réaliste basée sur l'état des credentials
    total_users = 20
    mfa_enabled = rand(8..18) # Entre 40% et 90% pour la démo
    coverage = (mfa_enabled.to_f / total_users * 100).round
    
    {
      verified: true,
      connected: true,
      coverage_percentage: coverage,
      total_users: total_users,
      mfa_enabled_users: mfa_enabled,
      admin_mfa_enabled: coverage > 80,
      security_defaults_enabled: coverage > 50,
      last_sync: credential.updated_at,
      recommendation: coverage < 100 ? "MFA incomplet: #{coverage}% des utilisateurs protégés. Objectif: 100%" : "MFA complet ✓",
      discrepancies: coverage < 100 ? ["#{total_users - mfa_enabled} utilisateurs sans MFA"] : []
    }
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
  
  # AJOUT : Méthode réelle MFA (à activer quand tu as les credentials)
  def real_mfa_verification
    token = get_access_token
    
    # Récupérer tous les utilisateurs
    users_uri = URI("https://graph.microsoft.com/v1.0/users?$select=id,userPrincipalName")
    users = graph_api_get(users_uri, token)
    
    # Vérifier MFA par utilisateur (via methode ou strongAuthentication)
    total_users = users['value'].count
    mfa_enabled = 0
    
    users['value'].each do |user|
      user_details = graph_api_get(URI("https://graph.microsoft.com/v1.0/users/#{user['id']}?$select=strongAuthentication"), token)
      mfa_enabled += 1 if user_details['strongAuthentication'].present?
    end
    
    coverage = total_users > 0 ? (mfa_enabled.to_f / total_users * 100).round : 0
    
    {
      verified: true,
      connected: true,
      coverage_percentage: coverage,
      total_users: total_users,
      mfa_enabled_users: mfa_enabled,
      admin_mfa_enabled: coverage > 80,
      security_defaults_enabled: coverage > 50,
      last_sync: Time.current,
      recommendation: coverage < 100 ? "MFA incomplet: #{coverage}%" : "MFA complet",
      discrepancies: []
    }
  rescue => e
    {
      verified: false,
      connected: true,
      error: e.message,
      recommendation: "Erreur de connexion à M365"
    }
  end
  
  def get_access_token
    credential = M365Credential.find_by(tenant_id: @tenant_id)
    raise "M365 not connected" unless credential
    
    # TODO: Implémenter le refresh token si nécessaire
    credential.access_token
  end
  
  # AJOUT : Helper pour les appels API
  def graph_api_get(uri, token)
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{token}"
    req['Accept'] = 'application/json'
    
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    
    JSON.parse(res.body)
  end
end