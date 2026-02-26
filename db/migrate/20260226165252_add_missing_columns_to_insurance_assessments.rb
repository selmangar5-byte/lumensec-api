class AddMissingColumnsToInsuranceAssessments < ActiveRecord::Migration[7.2]
  def change
    add_column :insurance_assessments, :section_scores, :jsonb
    add_column :insurance_assessments, :gaps, :jsonb
    add_column :insurance_assessments, :recommendations, :jsonb
    add_column :insurance_assessments, :premium_impact, :string
    add_column :insurance_assessments, :status, :string
  end
end
