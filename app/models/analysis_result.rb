class AnalysisResult < ApplicationRecord
  belongs_to :tenant
  belongs_to :webhook_event, dependent: :destroy
  has_many :evidence_packs, dependent: :destroy
  validates :tenant, presence: true
  validates :webhook_event, presence: true

  # Validations
  validates :status, inclusion: { in: %w[new triaging triaged resolved false_positive] }, if: -> { status.present? }
  validates :severity, inclusion: { in: [1, 2, 3, 4, 5] }, if: -> { severity.present? }

  # Scopes
  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
endclass AnalysisResult < ApplicationRecord
  belongs_to :tenant
  belongs_to :webhook_event, dependent: :destroy
  has_many :evidence_packs, dependent: :destroy

  validates :tenant, presence: true
  validates :webhook_event, presence: true

  # Validations
  validates :status, inclusion: { in: %w[new triaging triaged resolved false_positive] }, if: -> { status.present? }
  validates :severity, inclusion: { in: [1, 2, 3, 4, 5] }, if: -> { severity.present? }

  # Scopes
  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
endclass AnalysisResult < ApplicationRecord 
    belongs_to :tenant 
    belongs_to :webhook_event 
    has_many :evidence_packs, dependent: :destroy 
    validates :tenant, presence: true 
    validates :webhook_event, presence: true 
end
  # Validations
  validates :status, inclusion: { in: %w[new triaging triaged resolved false_positive] }, if: -> { status.present? }
  validates :severity, inclusion: { in: [1, 2, 3, 4, 5] }, if: -> { severity.present? }

  # Scopes
  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
