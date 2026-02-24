class AddDetailsToLoi25Assessments < ActiveRecord::Migration[7.2]
  def change
    add_column :loi25_assessments, :details, :jsonb
  end
end
