# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class AnalysisResult < ApplicationRecord
  belongs_to :tenant
  belongs_to :webhook_event
  has_many :evidence_packs, dependent: :destroy
  
  validates :tenant, presence: true
  validates :webhook_event, presence: true
  validates :status, inclusion: { in: %w[new triaging triaged resolved false_positive] }, if: -> { status.present? }
  validates :severity, inclusion: { in: [1, 2, 3, 4, 5] }, if: -> { severity.present? }

  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
end