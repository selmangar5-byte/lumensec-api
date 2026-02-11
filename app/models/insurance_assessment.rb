class InsuranceAssessment < ApplicationRecord
  belongs_to :tenant, optional: true
end