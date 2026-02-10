class CreateInsuranceAssessments < ActiveRecord::Migration[7.2]
  def change
    create_table :insurance_assessments do |t|
      t.uuid :tenant_id, null: false
      t.integer :score
      t.string :risk_level
      t.jsonb :answers
      t.timestamps
    end
    
    add_index :insurance_assessments, :tenant_id
  end
end
