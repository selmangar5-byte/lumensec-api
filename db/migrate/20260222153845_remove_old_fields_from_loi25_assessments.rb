class RemoveOldFieldsFromLoi25Assessments < ActiveRecord::Migration[7.2]
  def change
    remove_column :loi25_assessments, :answers, :jsonb
    remove_column :loi25_assessments, :pii_inventory, :jsonb
    remove_column :loi25_assessments, :gaps, :text
  end
end
