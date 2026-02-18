class M365Alert < ApplicationRecord
  belongs_to :tenant, optional: true
  
  enum severity: { informational: 0, low: 1, medium: 2, high: 3, critical: 4 }
  enum status: { new_alert: 0, in_progress: 1, resolved: 2, dismissed: 3 }
  
  scope :recent, -> { where('created_at > ?', 24.hours.ago) }
  scope :critical, -> { where(severity: [:high, :critical]) }
end