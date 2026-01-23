class WebhookEvent < ApplicationRecord
  belongs_to :tenant
  has_many :analysis_results, dependent: :destroy
  
  validates :tenant, presence: true
  validates :source, presence: true
  validates :payload, presence: true
end
