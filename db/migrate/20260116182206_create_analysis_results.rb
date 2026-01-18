class CreateAnalysisResults < ActiveRecord::Migration[7.2]
  def change
    create_table :analysis_results do |t|
      t.references :tenant, type: :uuid, null: false, foreign_key: true
t.references :webhook_event, type: :uuid, null: false, foreign_key: true

      t.uuid :correlation_id
      t.string :source
      t.jsonb :event_key
      t.jsonb :triage
      t.jsonb :narrative
      t.jsonb :evidence

      t.timestamps
    end
  end
end
