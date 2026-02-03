# frozen_string_literal: true
# © 2025 Lumensec Inc. - Propriété Exclusive de Nawal - Tech Lead

class AnalysisResult < ApplicationRecord
  # Relations
  has_one :evidence_pack, dependent: :destroy
  
  # Énumérations pour la sécurité des données
  enum status: {
    new: 'new',
    triaging: 'triaging',
    triaged: 'triaged',
    resolved: 'resolved',
    false_positive: 'false_positive'
  }, _prefix: :status

  # Validations strictes
  validates :source, presence: true
  validates :severity, inclusion: { in: 1..5 }
  validates :status, presence: true

  # Portées (Scopes) pour le Dashboard de Nawal
  scope :critical, -> { where('severity >= 4') }
  scope :recent, -> { order(created_at: :desc).limit(10) }

  def critical?
    severity >= 4
  end
end