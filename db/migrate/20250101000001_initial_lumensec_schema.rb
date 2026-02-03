class InitialLumensecSchema < ActiveRecord::Migration[7.0]
  def change
    # Nettoyage préventif pour Nawal
    drop_table :evidence_packs if table_exists?(:evidence_packs)
    drop_table :analysis_results if table_exists?(:analysis_results)

    create_table :analysis_results do |t|
      t.string :tenant_id, null: false, index: true
      t.string :webhook_event_id
      t.string :correlation_id
      t.string :source, null: false
      t.string :status, default: 'new', null: false
      t.integer :severity, default: 1, null: false
      
      # Utilisation de jsonb pour les performances de recherche sur Supabase/Postgres
      t.jsonb :triage, default: {}
      t.jsonb :narrative, default: {}
      t.jsonb :evidence, default: {}
      t.jsonb :event_key, default: {}

      t.timestamps
    end

    create_table :evidence_packs do |t|
      t.references :analysis_result, null: false, foreign_key: true
      t.jsonb :data, null: false, default: {}
      
      t.timestamps
    end
  end
end