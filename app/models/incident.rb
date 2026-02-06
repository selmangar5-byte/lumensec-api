class Incident < ApplicationRecord
  belongs_to :tenant
  has_many :analysis_results, dependent: :destroy
  has_one :evidence_pack, dependent: :destroy
end
