# frozen_string_literal: true

require "openssl"

class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  before_action :verify_signature

  def create
    # Required: source, payload, and at least one identifier (event_id or fingerprint)
    if params[:source].blank? || params[:payload].blank? || (params[:event_id].blank? && params[:fingerprint].blank?)
      return render json: { error: "Missing required fields" }, status: :bad_request
    end

    begin
      event = @tenant.webhook_events.create!(webhook_params)

      # Persist analysis result (triage output) if present in payload
      AnalysisResult.create!(
        tenant: @tenant,
        webhook_event: event,
        correlation_id: event.id,
        source: event.source,
        event_key: {
          event_id: event.event_id,
          fingerprint: event.fingerprint
        },
        triage: event.payload["triage"],
        narrative: event.payload["narrative"],
        evidence: event.payload["evidence"]
      )

      envelope = {
        schema_version: "event_envelope.v1",
        correlation_id: event.id,
        tenant_id: @tenant.id,
        source: event.source,
        event_key: {
          event_id: event.event_id,
          fingerprint: event.fingerprint
        },
        received_at: event.created_at.utc.iso8601,
        signature_validated: true,
        payload: event.payload,
        context: {
          request_ip: request.remote_ip,
          user_agent: request.user_agent,
          headers_whitelist: {
            content_type: request.content_type
          }
        }
      }

      Rails.logger.info("LUMENSEC_EVENT_ENVELOPE=#{envelope.to_json}")

    rescue ActiveRecord::RecordNotUnique
      # Idempotency: Duplicate found, treat as accepted
    end

    head :accepted
  end

  private

  def webhook_params
    params.permit(:source, :event_id, :fingerprint, payload: {})
  end

  def verify_signature
    tenant_id  = request.headers["X-Lumensec-Tenant-Id"]
    timestamp  = request.headers["X-Lumensec-Timestamp"]
    signature  = request.headers["X-Lumensec-Signature"]

    if tenant_id.blank? || timestamp.blank? || signature.blank?
      render json: { error: "Missing authentication headers" }, status: :unauthorized
      return
    end

    unless timestamp.to_s.match?(/\A\d+\z/)
      render json: { error: "Invalid timestamp" }, status: :unauthorized
      return
    end

    # Replay protection: 5 minutes in the past, 1 minute in the future
    ts = timestamp.to_i
    if ts < 5.minutes.ago.to_i || ts > 1.minute.from_now.to_i
      render json: { error: "Invalid timestamp" }, status: :unauthorized
      return
    end

    @tenant = Tenant.find_by(id: tenant_id)
    unless @tenant
      render json: { error: "Invalid tenant" }, status: :unauthorized
      return
    end

    request.body.rewind
    body_content = request.body.read
    request.body.rewind

    computed = OpenSSL::HMAC.hexdigest(
      "SHA256",
      @tenant.webhook_secret,
      "#{timestamp}.#{body_content}"
    )

    # secure_compare requires same length
    if computed.bytesize != signature.bytesize ||
       !ActiveSupport::SecurityUtils.secure_compare(computed, signature)
      render json: { error: "Invalid signature" }, status: :unauthorized
      return
    end
  end
end
