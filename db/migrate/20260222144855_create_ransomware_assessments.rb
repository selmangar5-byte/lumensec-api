class CreateRansomwareAssessments < ActiveRecord::Migration[7.2]
  def change
    create_table :ransomware_assessments do |t|
      t.string :tenant_id
      t.integer :score
      t.string :status
      t.jsonb :answers
      t.integer :backup_score
      t.integer :isolation_score
      t.integer :detection_score
      t.integer :response_score

      t.timestamps
    end
  end
end
