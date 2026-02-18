class AlertsController < ApplicationController
  def analyze
    # Simuler une analyse IA
    analysis = {
      results: [
        {
          threat_score: 85,
          recommended_action: 'isolate',
          false_positive: false,
          summary: 'Tentative de phishing détectée',
          indicators: ['Domaine suspect', 'URL malveillante']
        }
      ]
    }
    
    render json: analysis
  end
end
