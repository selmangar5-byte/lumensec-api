class CreateObservabilityTables < ActiveRecord::Migration[7.2]
  def change
    # Sources table
    create_table :sources, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.string :source_type, null: false
      t.string :name, null: false
      t.jsonb :config, default: {}, null: false
      t.boolean :active, default: true
      t.timestamps
    end
    
    add_index :sources, :tenant_id
    add_foreign_key :sources, :tenants
    
    # KPI Snapshots table
    create_table :kpi_snapshots, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.date :snapshot_date, null: false
      t.integer :incidents_count, default: 0
      t.decimal :mttd_minutes, precision: 10, scale: 2
      t.decimal :mttr_hours, precision: 10, scale: 2
      t.decimal :fp_rate, precision: 5, scale: 2
      t.decimal :ai_cost_usd, precision: 10, scale: 2, default: 0.0
      t.jsonb :metadata, default: {}, null: false
      t.timestamps
    end
    
    add_index :kpi_snapshots, [:tenant_id, :snapshot_date], unique: true
    add_foreign_key :kpi_snapshots, :tenants
    
    # Cost Usages table
    create_table :cost_usages, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.uuid :analysis_result_id
      t.string :provider, null: false
      t.string :model
      t.integer :tokens_in, default: 0
      t.integer :tokens_out, default: 0
      t.decimal :cost_usd, precision: 10, scale: 6, default: 0.0
      t.timestamps
    end
    
    add_index :cost_usages, :tenant_id
    add_index :cost_usages, :created_at
    add_foreign_key :cost_usages, :tenants
    
    # Audit Logs table
    create_table :audit_logs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.uuid :user_id
      t.string :action, null: false
      t.string :resource_type
      t.uuid :resource_id
      t.jsonb :metadata, default: {}, null: false
      t.inet :ip_address
      t.datetime :created_at, null: false
    end
    
    add_index :audit_logs, :tenant_id
    add_index :audit_logs, :created_at
    add_foreign_key :audit_logs, :tenants
  end
end