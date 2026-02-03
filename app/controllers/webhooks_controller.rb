# frozen_string_literal: true

class WebhooksController < ApplicationController
  def receive
    # S1 — Ingestion : à implémenter
    render json: { status: 'received' }, status: :accepted
  end
end