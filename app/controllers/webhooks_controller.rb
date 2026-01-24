# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class WebhooksController < ApplicationController
  skip_before_action :set_tenant, only: [:crowdstrike]

  def crowdstrike
    # Créer l'événement webhook
    webhook_event = WebhookEvent.create!(
      tenant_id: find_tenant_from_webhook,
      source: 'crowdstrike',
      event_id: params[:event_id],
      payload: params.to_unsafe_h
    )

    # Créer l'analyse
    analysis = AnalysisResult.create!(
      tenant_id: webhook_event.tenant_id,
      webhook_event: webhook_event,
      correlation_id: webhook_event.id,
      source: 'crowdstrike',
      event_key: { event_id: params[:event_id] },
      triage: extract_triage_data(params),
      narrative: extract_narrative(params),
      evidence: extract_evidence(params),
      status: 'new',
      severity: calculate_severity(params)
    )

    render json: { 
      status: 'received', 
      webhook_event_id: webhook_event.id,
      analysis_id: analysis.id 
    }, status: :created
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def find_tenant_from_webhook
    Tenant.first&.id
  end

  def extract_triage_data(params)
    {
      verdict: params.dig(:metadata, :verdict) || 'unknown',
      priority: params.dig(:metadata, :priority) || 'medium',
      confidence: params.dig(:metadata, :confidence) || 0.5
    }
  end

  def extract_narrative(params)
    {
      summary: params.dig(:metadata, :description) || 'Security event detected',
      details: params.dig(:metadata, :details) || 'Event requires investigation'
    }
  end

  def extract_evidence(params)
    {
      files: params.dig(:metadata, :files) || [],
      hashes: params.dig(:metadata, :hashes) || [],
      processes: params.dig(:metadata, :processes) || []
    }
  end

  def calculate_severity(params)
    case params.dig(:metadata, :severity)&.downcase
    when 'critical' then 5
    when 'high' then 4
    when 'medium' then 3
    when 'low' then 2
    else 1
    end
  end
end
