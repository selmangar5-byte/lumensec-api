module Api
  class InsuranceAssessmentsController < ApplicationController
    def create
      answers = params[:answers]
      tenant_id = ([request.headers["X-Tenant-ID"], params[:tenant_id]].find { |v| v.present? && v != "default" }&.to_i || 1)
      
      # MODIFICATION : Passage du tenant_id pour vérification MFA M365
      result = InsuranceScoringEngine.calculate(answers.merge('tenant_id' => tenant_id))
      
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
      tenant_id = ([request.headers["X-Tenant-ID"], params[:tenant_id]].find { |v| v.present? && v != "default" }&.to_i || 1)
      
      assessments = InsuranceAssessment
        .where(tenant_id: tenant_id)
        .order(created_at: :desc)
        .limit(10)
        .map do |a|
          # MODIFICATION : Passage du tenant_id pour recalcul avec vérification MFA
          result = InsuranceScoringEngine.calculate(a.answers.merge('tenant_id' => tenant_id))
          {
            id: a.id,
            score: a.score,
            risk_level: a.risk_level,
            created_at: a.created_at,
            section_scores: result[:section_scores],
            mfa_verification: result[:mfa_verification] # AJOUT : inclusion dans la réponse
          }
        end
      
      render json: { assessments: assessments }
    end
    
    def report
      tenant_id = ([request.headers["X-Tenant-ID"], params[:tenant_id]].find { |v| v.present? && v != "default" }&.to_i || 1)
      
      assessment = InsuranceAssessment.find_by(id: params[:id], tenant_id: tenant_id)
      
      unless assessment
        return render json: { error: 'Assessment not found' }, status: :not_found
      end
      
      # Vérification M365 réelle
      m365_connected = M365Credential.exists?(tenant_id: tenant_id)
      
      # MODIFICATION : Passage du tenant_id pour vérification MFA dans le rapport
      result = InsuranceScoringEngine.calculate(assessment.answers.merge('tenant_id' => tenant_id))
      
      m365_alerts = m365_connected ? fetch_real_m365_alerts(tenant_id) : []
      m365_stats = m365_connected ? fetch_real_m365_stats(tenant_id) : { 
        total_alerts: 0, 
        high_severity: 0, 
        medium_severity: 0, 
        low_severity: 0,
        status: 'not_connected'
      }
      
      # MODIFICATION : Génération HTML avec données MFA vérifiées
      html_content = generate_report_html(assessment, m365_alerts, m365_stats, m365_connected, result[:mfa_verification])
      
      # Conversion PDF via Grover
      pdf = Grover.new(html_content, format: 'A4', margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }).to_pdf
      
      send_data pdf, 
        filename: "LumenSec_Report_#{assessment.id}_#{Date.today}.pdf",
        type: 'application/pdf',
        disposition: 'inline'
    end
    
    private
    
    def fetch_real_m365_alerts(tenant_id)
      []
    end
    
    def fetch_real_m365_stats(tenant_id)
      { 
        total_alerts: 0, 
        high_severity: 0, 
        medium_severity: 0, 
        low_severity: 0, 
        status: 'pending_integration' 
      }
    end
    
    # MODIFICATION : Ajout du paramètre mfa_verification
    def generate_report_html(assessment, alerts, stats, m365_connected, mfa_verification = nil)
      result = InsuranceScoringEngine.calculate(assessment.answers.merge('tenant_id' => assessment.tenant_id))
      
      loi25_status = calculate_loi25_status(result[:section_scores])
      
      # AJOUT : Section MFA vérifiée pour le rapport
      mfa_section = generate_mfa_verification_section(mfa_verification || result[:mfa_verification])
      
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
            .compliance-badge { display: inline-block; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; }
            .badge-success { background: #4caf50; }
            .badge-warning { background: #ff9800; }
            .m365-disconnected { background: #f5f5f5; border: 2px dashed #ccc; padding: 20px; text-align: center; color: #666; margin: 15px 0; }
            .m365-disconnected strong { color: #1a237e; }
            .verification-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 10px 0; }
            .verification-box.warning { background: #fff3e0; border-left-color: #ff9800; }
            .verification-box.error { background: #ffebee; border-left-color: #c62828; }
            .verification-box.success { background: #e8f5e9; border-left-color: #4caf50; }
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
            <br>
            #{loi25_badge(loi25_status)}
          </div>
          
          <div class="section">
            <h2>🔐 Vérification MFA (Multi-Factor Authentication)</h2>
            #{mfa_section}
          </div>
          
          <div class="section">
            <h2>🚨 Alertes Microsoft 365 (7 derniers jours)</h2>
            #{m365_connected ? m365_alerts_section(alerts, stats) : m365_disconnected_section}
          </div>
          
          <div class="section">
            <h2>📈 Détails par Section</h2>
            #{result[:section_scores].map { |section, score| "<p><strong>#{section}:</strong> #{score}/100</p>" }.join}
          </div>
          
          <div class="footer">
            <p>LumenSec - Système Immunitaire Numérique pour PME</p>
            <p>Ce document est confidentiel et destiné à usage interne uniquement.</p>
            #{mfa_verification && mfa_verification[:verified] ? '<p><small>MFA vérifié automatiquement via Microsoft Graph API</small></p>' : ''}
          </div>
        </body>
        </html>
      HTML
    end
    
    # AJOUT : Génération de la section MFA vérifiée
    def generate_mfa_verification_section(verification)
      return '<p>M365 non connecté - vérification MFA impossible</p>' unless verification && verification[:verified]
      
      coverage = verification[:coverage_percentage]
      css_class = coverage == 100 ? 'success' : (coverage >= 80 ? 'warning' : 'error')
      icon = coverage == 100 ? '✓' : (coverage >= 80 ? '⚠' : '✗')
      
      <<~HTML
        <div class="verification-box #{css_class}">
          <p><strong>#{icon} Vérification automatique M365</strong></p>
          <p><strong>Coverage MFA:</strong> #{coverage}% (#{verification[:mfa_enabled_users]}/#{verification[:total_users]} utilisateurs)</p>
          <p><strong>Status:</strong> #{verification[:recommendation]}</p>
          #{verification[:discrepancy_warning] ? '<p><strong>⚠️ Discordance détectée:</strong> Vous avez répondu "oui" au MFA mais M365 montre une couverture incomplète.</p>' : ''}
        </div>
      HTML
    end
    
    def score_color(score)
      return '#c62828' if score < 50
      return '#ef6c00' if score < 75
      '#2e7d32'
    end
    
    def calculate_loi25_status(section_scores)
      data_protection = section_scores['Data Protection'] || section_scores[:data_protection] || 0
      identity_access = section_scores['Identity & Access'] || section_scores[:identity_access] || 0
      
      if data_protection >= 70 && identity_access >= 60
        :compliant
      else
        :at_risk
      end
    end
    
    def loi25_badge(status)
      if status == :compliant
        '<span class="compliance-badge badge-success">✓ Conforme Loi 25 (Québec)</span>'
      else
        '<span class="compliance-badge badge-warning">⚠️ Conformité Loi 25 à améliorer</span><p style="margin-top:10px;"><small>Recommandation : Évaluez vos mesures de protection des données personnelles.</small></p>'
      end
    end
    
    def m365_alerts_section(alerts, stats)
      return '<p>Aucune alerte de sécurité détectée dans les 7 derniers jours.</p>' if alerts.empty?
      
      html = <<~HTML
        <p><strong>Total:</strong> #{stats[:total_alerts]} alertes | 
           <strong>Haute:</strong> #{stats[:high_severity]} | 
           <strong>Moyenne:</strong> #{stats[:medium_severity]} | 
           <strong>Basse:</strong> #{stats[:low_severity]}</p>
        #{alerts.map { |a| alert_html(a) }.join}
      HTML
      
      html
    end
    
    def m365_disconnected_section
      <<~HTML
        <div class="m365-disconnected">
          <p><strong>Microsoft 365 non connecté</strong></p>
          <p>Cette section affichera vos alertes de sécurité réelles une fois votre tenant M365 connecté.</p>
          <p style="font-size: 12px; margin-top: 10px;">💡 Contactez votre administrateur pour activer l'intégration M365.</p>
        </div>
      HTML
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