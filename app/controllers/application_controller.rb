# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class ApplicationController < ActionController::API
  before_action :set_tenant
  
  private

  def set_tenant
    # Pour l'instant, on utilise le premier tenant
    # Plus tard : extraction du tenant_id depuis JWT ou headers
    @current_tenant = Tenant.first
  end

  def current_tenant
    @current_tenant
  end
end
