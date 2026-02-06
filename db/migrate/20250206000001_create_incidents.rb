class CreateIncidents < ActiveRecord::Migration[7.2]
  def change
    create_table :incidents do |t|
      t.string :tenant_id, null: false
      t.string :webhook_event_id
      t.string :correlation_id
      t.string :source, null: false
      t.string :status, default: "new", null: false
      t.integer :severity, default: 1, null: false
      t.string :summary
      t.text :narrative
      t.string :source_ip
      t.string :target_system
      t.jsonb :event_key, default: {}
      t.timestamps

      t.index :tenant_id
      t.index :status
      t.index :severity
    end
  end
end
