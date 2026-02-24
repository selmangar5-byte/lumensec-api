class CreateLoi25Assessments < ActiveRecord::Migration[7.2]
  def change
    create_table :loi25_assessments do |t|
      t.string :tenant_id
      t.integer :score
      t.string :status
      t.jsonb :answers
      t.jsonb :pii_inventory
      t.jsonb :gaps

      t.timestamps
    end
  end
end
