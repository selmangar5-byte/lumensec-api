class AddBooleanFieldsToLoi25Assessments < ActiveRecord::Migration[7.2]
  def change
    add_column :loi25_assessments, :governance, :boolean
    add_column :loi25_assessments, :data_inventory, :boolean
    add_column :loi25_assessments, :consent_management, :boolean
    add_column :loi25_assessments, :security_measures, :boolean
    add_column :loi25_assessments, :breach_notification, :boolean
    add_column :loi25_assessments, :data_retention, :boolean
  end
end
