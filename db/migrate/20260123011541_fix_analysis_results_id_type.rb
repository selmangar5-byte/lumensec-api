class FixAnalysisResultsIdType < ActiveRecord::Migration[7.2]
  def up
    # Créer une sauvegarde temporaire des données
    if table_exists?(:analysis_results)
      execute <<-SQL
        CREATE TABLE IF NOT EXISTS analysis_results_backup AS 
        SELECT * FROM analysis_results;
      SQL
    end
    
    # Supprimer les tables dans le bon ordre (à cause des foreign keys)
    drop_table :evidence_packs, if_exists: true
    drop_table :analysis_results, if_exists: true
    
    # Recréer analysis_results avec UUID
    create_table :analysis_results, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.uuid :webhook_event_id, null: false
      t.uuid :correlation_id
      t.string :source
      t.jsonb :event_key, default: {}
      t.jsonb :triage, default: {}
      t.jsonb :narrative, default: {}
      t.jsonb :evidence, default: {}
      t.timestamps
    end
    
    # Recréer evidence_packs avec UUID
    create_table :evidence_packs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :analysis_result_id, null: false
      t.jsonb :data, default: {}
      t.timestamps
    end
    
    # Ajouter les index
    add_index :analysis_results, :tenant_id
    add_index :analysis_results, :webhook_event_id
    add_index :evidence_packs, :analysis_result_id
    
    # Ajouter les foreign keys
    add_foreign_key :analysis_results, :tenants
    add_foreign_key :analysis_results, :webhook_events
    add_foreign_key :evidence_packs, :analysis_results
    
    # Nettoyer la sauvegarde
    execute "DROP TABLE IF EXISTS analysis_results_backup;"
  end
  
  def down
    raise ActiveRecord::IrreversibleMigration
  end
end