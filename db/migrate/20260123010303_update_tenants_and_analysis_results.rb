class UpdateTenantsAndAnalysisResults < ActiveRecord::Migration[7.2]
  def change
    # Update Tenants table
    add_column :tenants, :name, :string
    add_column :tenants, :plan, :string, default: 'starter'
    add_column :tenants, :webhook_secret_digest, :string
    add_column :tenants, :monthly_budget_cap, :decimal, precision: 10, scale: 2, default: 10.0
    add_column :tenants, :degraded_mode, :boolean, default: false
    
    # Update Analysis Results table
    add_column :analysis_results, :status, :string, default: 'new'
    add_column :analysis_results, :severity, :integer, default: 3
    add_column :analysis_results, :title, :string
    add_column :analysis_results, :summary, :text
    add_column :analysis_results, :detected_at, :datetime
    add_column :analysis_results, :triaged_at, :datetime
    add_column :analysis_results, :resolved_at, :datetime
    
    add_index :analysis_results, [:tenant_id, :status]
    
    # Update Evidence Packs table
    add_column :evidence_packs, :tenant_id, :uuid
    add_column :evidence_packs, :pack_type, :string, default: 'incident'
    add_column :evidence_packs, :pdf_url, :string
    add_column :evidence_packs, :json_url, :string
    add_column :evidence_packs, :hash_sha256, :string
    add_column :evidence_packs, :generated_at, :datetime
    
    add_index :evidence_packs, :tenant_id
  end
end
