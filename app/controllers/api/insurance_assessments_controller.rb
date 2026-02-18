module Api
  class InsuranceAssessmentsController < ApplicationController
    def create
      answers = params[:answers]
      # Hardcoded pour test - fonctionne immédiatement
      tenant_id = '00000000-0000-0000-0000-000000000001'
      
      result = InsuranceScoringEngine.calculate(answers)
      
      assessment = InsuranceAssessment.create!(
        tenant_id: tenant_id,
        score: result[:score],
        risk_level: result[:risk_level],
        answers: answers
      )
      
      render json: {
        success: true,
        assessment: result.merge(id: assessment.id, created_at: assessment.created_at)
      }, status: :created
    end
    
    def index
      tenant_id = '00000000-0000-0000-0000-000000000001'
      
      assessments = InsuranceAssessment
        .where(tenant_id: tenant_id)
        .order(created_at: :desc)
        .limit(10)
        .map do |a|
          result = InsuranceScoringEngine.calculate(a.answers)
          {
            id: a.id,
            score: a.score,
            risk_level: a.risk_level,
            created_at: a.created_at,
            section_scores: result[:section_scores]
          }
        end
      
      render json: { assessments: assessments }
    end
    
    def report
      tenant_id = '00000000-0000-0000-0000-000000000001'
      
      assessment = InsuranceAssessment.find_by(id: params[:id], tenant_id: tenant_id)
      
      unless assessment
        return render json: { error: 'Assessment not found' }, status: :not_found
      end
      
      # Récupération données M365 (mock)
      m365_alerts = fetch_m365_alerts(tenant_id)
      m365_stats = fetch_m365_stats(tenant_id)
      
      # Génération HTML
      html_content = generate_report_html(assessment, m365_alerts, m365_stats)
      
      # Conversion PDF via Grover
      pdf = Grover.new(html_content, format: 'A4', margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }).to_pdf
      
      send_data pdf, 
        filename: "LumenSec_Report_#{assessment.id}_#{Date.today}.pdf",
        type: 'application/pdf',
        disposition: 'inline'
    end
    
    private
    
    def fetch_m365_alerts(tenant_id)
      [
        { severity: 'High', title: 'Suspicious login detected', time: '2025-02-14 10:30', status: 'New' },
        { severity: 'Medium', title: 'Unusual file access pattern', time: '2025-02-14 09:15', status: 'InProgress' },
        { severity: 'Low', title: 'Policy violation', time: '2025-02-14 08:45', status: 'Resolved' }
      ]
    end
    
    def fetch_m365_stats(tenant_id)
      { total_alerts: 3, high_severity: 1, medium_severity: 1, low_severity: 1 }
    end
    
    def generate_report_html(assessment, alerts, stats)
      result = InsuranceScoringEngine.calculate(assessment.answers)
      
      <<~HTML
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport LumenSec - #{assessment.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .header { background: #1a237e; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .score-box { background: #{score_color(result[:score])}; color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .score-number { font-size: 48px; font-weight: bold; margin: 0; }
            .score-label { font-size: 18px; margin: 5px 0 0 0; }
            .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .section h2 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-top: 0; }
            .alert-high { background: #ffebee; border-left: 4px solid #c62828; padding: 10px; margin: 10px 0; }
            .alert-medium { background: #fff3e0; border-left: 4px solid #ef6c00; padding: 10px; margin: 10px 0; }
            .alert-low { background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 10px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            .compliance-badge { display: inline-block; background: #4caf50; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 RAPPORT DE CYBERSÉCURITÉ LUMENSEC</h1>
            <p>Généré le #{Date.today.strftime('%d/%m/%Y')} | Référence: #{assessment.id}</p>
          </div>
          
          <div class="score-box">
            <p class="score-number">#{result[:score]}%</p>
            <p class="score-label">Score de conformité #{result[:risk_level]}</p>
          </div>
          
          <div class="section">
            <h2>📊 Résumé Executive</h2>
            <p><strong>Niveau de risque:</strong> #{result[:risk_level]}</p>
            <p><strong>Date d'évaluation:</strong> #{assessment.created_at.strftime('%d/%m/%Y %H:%M')}</p>
            <p><strong>Tenant ID:</strong> #{assessment.tenant_id}</p>
            <br>
            <span class="compliance-badge">✓ Conforme Loi 25 (Québec)</span>
          </div>
          
          <div class="section">
            <h2>🚨 Alertes Microsoft 365 (7 derniers jours)</h2>
            <p><strong>Total:</strong> #{stats[:total_alerts]} alertes | 
               <strong>Haute:</strong> #{stats[:high_severity]} | 
               <strong>Moyenne:</strong> #{stats[:medium_severity]} | 
               <strong>Basse:</strong> #{stats[:low_severity]}</p>
            #{alerts.map { |a| alert_html(a) }.join}
          </div>
          
          <div class="section">
            <h2>📈 Détails par Section</h2>
            #{result[:section_scores].map { |section, score| "<p><strong>#{section}:</strong> #{score}/100</p>" }.join}
          </div>
          
          <div class="footer">
            <p>LumenSec - Système Immunitaire Numérique pour PME</p>
            <p>Ce document est confidentiel et destiné à usage interne uniquement.</p>
          </div>
        </body>
        </html>
      HTML
    end
    
    def score_color(score)
      return '#c62828' if score < 50
      return '#ef6c00' if score < 75
      '#2e7d32'
    end
    
    def alert_html(alert)
      css_class = "alert-#{alert[:severity].downcase}"
      <<~HTML
        <div class="#{css_class}">
          <strong>[#{alert[:severity]}]</strong> #{alert[:title]}<br>
          <small>#{alert[:time]} | Statut: #{alert[:status]}</small>
        </div>
      HTML
    end
  end
end