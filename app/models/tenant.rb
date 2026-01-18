class Tenant < ApplicationRecord
  has_many :webhook_events, dependent: :destroy
end
