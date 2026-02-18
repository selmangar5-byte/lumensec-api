class CreateM365Alerts < ActiveRecord::Migration[7.2]
  def change
    create_table :m365_alerts do |t|
      t.string :tenant_id
      t.string :alert_id
      t.string :title
      t.text :description
      t.integer :severity, default: 0
      t.integer :status, default: 0
      t.string :category
      t.string :user_email
      t.string :ip_address
      t.datetime :detected_at
      t.jsonb :raw_data
      
      t.timestamps
    end
    
    add_index :m365_alerts, [:tenant_id, :alert_id], unique: true
    add_index :m365_alerts, :detected_at
  end
end