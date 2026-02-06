class AddIncidentIdToAnalysisResults < ActiveRecord::Migration[7.2]
  def change
    add_column :analysis_results, :incident_id, :bigint
    add_index :analysis_results, :incident_id
  end
end
