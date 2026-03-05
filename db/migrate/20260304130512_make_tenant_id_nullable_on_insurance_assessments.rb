class MakeTenantIdNullableOnInsuranceAssessments < ActiveRecord::Migration[7.2]
  def change
    change_column_null :insurance_assessments, :tenant_id, true
  end
end
