class WebhooksController < ApplicationController
  def receive
    incident = Incident.create!(
      tenant_id: request.headers['X-Tenant-ID'],
      source: params[:source],
      severity: params[:severity],
      status: params[:status] || 'new',
      summary: params[:summary],
      narrative: params[:narrative],
      source_ip: params[:source_ip],
      target_system: params[:target_system],
      event_key: "WH-#{Time.now.to_i}"
    )
    
    AnalysisResult.create!(
      incident_id: incident.id,
      tenant_id: incident.tenant_id,
      verdict: 'pending',
      confidence: 0,
      summary: params[:summary],
      narrative: params[:narrative]
    )
    
    render json: { status: 'created', incident_id: incident.id }, status: :created
  end
end
