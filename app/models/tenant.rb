class Tenant < ApplicationRecord
  has_many :webhook_events, dependent: :destroy
  has_many :analysis_results, dependent: :destroy
  has_many :evidence_packs, through: :analysis_results
  
  validates :webhook_secret, presence: true, length: { minimum: 32 }
end
