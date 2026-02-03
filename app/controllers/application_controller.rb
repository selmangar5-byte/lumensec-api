# frozen_string_literal: true

class ApplicationController < ActionController::API
  private

  def current_tenant_id
    tenant_id = request.headers['X-Tenant-ID'].presence
    raise ActionController::BadRequest unless tenant_id
    tenant_id
  end

  def tenant_scope
    AnalysisResult.where(tenant_id: current_tenant_id)
  end
end