class ImmuneAnalysisService
  ACTION_LEVELS = {
    monitor: 0,
    isolate: 1,
    block: 2,
    destroy: 3
  }.freeze

  def initialize
    @api_key = defined?(GEMINI_API_KEY) ? GEMINI_API_KEY : ENV['GEMINI_API_KEY']
    @model = defined?(GEMINI_MODEL) ? GEMINI_MODEL : 'gemini-2.0-flash'
  end

  def analyze_alert(alert_data)
    return mock_analysis(alert_data) unless api_configured?

    prompt = build_analysis_prompt(alert_data)
    
    begin
      response = call_gemini_api(prompt)
      parse_analysis_response(response)
    rescue => e
      Rails.logger.error("Gemini API error: #{e.message}")
      mock_analysis(alert_data)
    end
  end

  def analyze_batch(alerts)
    alerts.map { |alert| analyze_alert(alert) }
  end

  def contextualize_alert(alert, historical_alerts = [])
    return alert unless historical_alerts.any?
    similar = find_similar_alerts(alert, historical_alerts)
    return alert if similar.empty?
    
    avg_past_score = similar.map { |a| a[:threat_score] || 50 }.sum / similar.size
    alert[:contextual_score] = ((alert[:threat_score] || 50) * 0.7 + avg_past_score * 0.3).round
    alert[:memory_note] = "Pattern vu #{similar.size} fois avant"
    alert
  end

  private

  def api_configured?
    @api_key.present? && @api_key != 'YOUR_API_KEY_HERE'
  end

  def call_gemini_api(prompt)
    uri = URI("https://generativelanguage.googleapis.com/v1/models/#{@model}:generateContent?key=#{@api_key}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = 'application/json'
    
    body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
    }
    
    request.body = body.to_json
    response = http.request(request)
    
    JSON.parse(response.body)
  end

  def build_analysis_prompt(alert)
    <<~PROMPT
      Tu es le système immunitaire de LumenSec, un SOC pour PME.
      Analyse cette alerte et détermine si c'est SELF (normal) ou NON-SELF (menace).
      
      ALERTE:
      - Type: #{alert[:category] || 'Unknown'}
      - Sévérité: #{alert[:severity] || 'Unknown'}
      - Titre: #{alert[:title] || 'N/A'}
      - Description: #{alert[:description] || 'N/A'}
      - Utilisateur: #{alert[:user_email] || 'Unknown'}
      - IP: #{alert[:ip_address] || 'Unknown'}
      
      Réponds UNIQUEMENT en JSON:
      {"threat_score":0-100,"is_false_positive":true/false,"recommended_action":"monitor|isolate|block|destroy","explanation":"raison","indicators":["liste"]}
      
      Règles: <30=Monitor, 30-60=Isolate, 60-85=Block, >85=Destroy
    PROMPT
  end

  def parse_analysis_response(response)
    text = response.dig('candidates', 0, 'content', 'parts', 0, 'text') || '{}'
    text = text.gsub(/```json\n?/, '').gsub(/```\n?/, '').strip
    
    result = JSON.parse(text, symbolize_names: true)
    {
      threat_score: result[:threat_score] || 50,
      is_false_positive: result[:is_false_positive] || false,
      recommended_action: result[:recommended_action] || 'monitor',
      explanation: result[:explanation] || 'Analyse Gemini',
      indicators: result[:indicators] || []
    }
  rescue JSON::ParserError => e
    Rails.logger.error("JSON parse error: #{e.message}")
    { threat_score: 50, is_false_positive: false, recommended_action: 'monitor', explanation: 'Parse error', indicators: [] }
  end

  def mock_analysis(alert)
    title = alert[:title]&.downcase || ''
    if title.include?('suspicious') || title.include?('impossible')
      { threat_score: 75, is_false_positive: false, recommended_action: 'isolate', explanation: 'Connexion anormale', indicators: ['Pattern reconnu'] }
    elsif title.include?('malware') || title.include?('ransomware')
      { threat_score: 95, is_false_positive: false, recommended_action: 'destroy', explanation: 'Menace critique', indicators: ['Code malveillant'] }
    else
      { threat_score: 45, is_false_positive: false, recommended_action: 'monitor', explanation: 'Analyse par défaut', indicators: ['À surveiller'] }
    end
  end

  def find_similar_alerts(alert, historical)
    historical.select { |h| h[:category] == alert[:category] }.first(5)
  end
end
