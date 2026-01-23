class AnalysisResult < ApplicationRecord 
    belongs_to :tenant 
    belongs_to :webhook_event 
    has_many :evidence_packs, dependent: :destroy 
    validates :tenant, presence: true 
    validates :webhook_event, presence: true 
end