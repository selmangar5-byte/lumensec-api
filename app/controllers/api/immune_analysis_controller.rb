module Api
  class ImmuneAnalysisController < ApplicationController
    def analyze
      alerts = params[:alerts] || []
      
      service = ImmuneAnalysisService.new
      results = service.analyze_batch(alerts)
      
      # Enrichir avec contexte si historique fourni
      if params[:historical_alerts].present?
        results = results.map { |r| service.contextualize_alert(r, params[:historical_alerts]) }
      end
      
      render json: {
        analyzed_at: Time.now.iso8601,
        total_alerts: results.size,
        false_positives: results.count { |r| r[:is_false_positive] },
        critical_threats: results.count { |r| r[:threat_score] > 85 },
        results: results
      }
    end

    def decision
      # Endpoint pour action immunitaire auto sur une alerte spécifique
      alert_id = params[:alert_id]
      alert = M365Alert.find_by(id: alert_id)
      
      unless alert
        return render json: { error: 'Alert not found' }, status: :not_found
      end
      
      service = ImmuneAnalysisService.new
      analysis = service.analyze_alert(alert.as_json)
      
      # Exécuter l'action recommandée (simulation pour l'instant)
      action_result = execute_immune_action(analysis, alert)
      
      render json: {
        alert_id: alert_id,
        analysis: analysis,
        action_executed: action_result,
        timestamp: Time.now.iso8601
      }
    end

    private

    def execute_immune_action(analysis, alert)
      case analysis[:recommended_action]
      when 'isolate'
        { status: 'isolated', details: 'User network access restricted' }
      when 'block'
        { status: 'blocked', details: 'Account temporarily disabled' }
      when 'destroy'
        { status: 'quarantined', details: 'Files quarantined, session killed' }
      else
        { status: 'monitored', details: 'Added to watch list' }
      end
    end
  end
end
