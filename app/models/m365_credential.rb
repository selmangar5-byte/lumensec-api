class M365Credential < ApplicationRecord
  # encrypts :client_secret  # Désactivé temporairement - configurer Rails credentials plus tard
  
  validates :tenant_id, presence: true, uniqueness: true
  validates :client_id, :client_secret, :m365_tenant_id, presence: true
  
  scope :active, -> { where(active: true) }
end
