class CreateInsuranceAssessments < ActiveRecord::Migration[7.2]
  def change
    create_table :insurance_assessments do |t|
      t.references :tenant, null: false, foreign_key: true
      t.integer :score
      t.string :risk_level
      t.jsonb :answers

      t.timestamps
    end
  end
end
