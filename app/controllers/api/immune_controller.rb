module Api
  class ImmuneController < ApplicationController
    def analyze
      alerts = params[:alerts] || []
      results = alerts.map { |alert| analyze_alert(alert) }
      render json: { results: results }
    end
    
    private
    
    def analyze_alert(alert)
      title = alert[:title] || alert['title'] || ''
      category = alert[:category] || alert['category'] || ''
      severity = alert[:severity] || alert['severity'] || 'low'
      
      base_score = case severity.to_s.downcase
                   when 'critical' then 85
                   when 'high' then 70
                   when 'medium' then 50
                   when 'low' then 25
                   else 40
                   end
      
      if category.to_s.downcase.include?('phishing')
        threat_score = [base_score + 15, 100].min
        action = threat_score > 80 ? 'isolate' : 'block'
        explanation = "Tentative de phishing détectée"
      elsif category.to_s.downcase.include?('malware')
        threat_score = [base_score + 20, 100].min
        action = threat_score > 85 ? 'destroy' : 'isolate'
        explanation = "Malware identifié"
      elsif category.to_s.downcase.include?('suspiciouslogin')
        threat_score = [base_score + 10, 100].min
        action = threat_score > 75 ? 'block' : 'monitor'
        explanation = "Connexion anormale détectée"
      else
        threat_score = base_score
        action = threat_score > 60 ? 'isolate' : 'monitor'
        explanation = "Analyse système immunitaire"
      end
      
      is_fp = title.to_s.downcase.include?('test')
      threat_score = [threat_score - 30, 10].max if is_fp
      
      {
        threat_score: threat_score,
        is_false_positive: is_fp,
        recommended_action: action,
        explanation: explanation,
        indicators: [severity.to_s, category.to_s]
      }
    end
  end
end
