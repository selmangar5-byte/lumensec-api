class CreateWebhookEvents < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto'

    create_table :webhook_events, id: :uuid do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true
      t.string :source, null: false
      t.string :event_id
      t.string :fingerprint
      t.jsonb :payload, null: false, default: {}

      t.timestamps
    end

    add_index :webhook_events, [:tenant_id, :source, :event_id],
              unique: true,
              where: "event_id IS NOT NULL",
              name: 'idx_webhook_events_tenant_source_event_id'

    add_index :webhook_events, [:tenant_id, :source, :fingerprint],
              unique: true,
              where: "fingerprint IS NOT NULL",
              name: 'idx_webhook_events_tenant_source_fingerprint'
  end
end
