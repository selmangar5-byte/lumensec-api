class AnalysisResult < ApplicationRecord
  belongs_to :tenant
  belongs_to :webhook_event
end
