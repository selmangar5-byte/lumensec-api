class CreateEvidencePacks < ActiveRecord::Migration[7.2]
  def change
    create_table :evidence_packs do |t|
      t.references :analysis_result, null: false, foreign_key: true
      t.jsonb :data

      t.timestamps
    end
  end
end
