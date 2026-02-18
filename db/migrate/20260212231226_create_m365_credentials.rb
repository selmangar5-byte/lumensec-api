class CreateM365Credentials < ActiveRecord::Migration[7.2]
  def change
    create_table :m365_credentials do |t|
      t.string :tenant_id, null: false
      t.string :client_id, null: false
      t.string :client_secret, null: false
      t.string :m365_tenant_id, null: false  # Le vrai tenant ID du client
      t.boolean :active, default: false
      t.datetime :last_sync_at
      t.text :error_message
      
      t.timestamps
    end
    
    add_index :m365_credentials, :tenant_id, unique: true
  end
end
