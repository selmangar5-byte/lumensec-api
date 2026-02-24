class AddWebhookSecretToTenants < ActiveRecord::Migration[7.2]
  def change
    add_column :tenants, :webhook_secret, :string
  end
end
