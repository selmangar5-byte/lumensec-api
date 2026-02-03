# frozen_string_literal: true

class DashboardController < ApplicationController
  def stats
    scope = tenant_scope
    render json: {
      total_incidents: scope.count,
      by_status: scope.group(:status).count,
      by_severity: scope.group(:severity).count,
      recent_incidents: scope.order(created_at: :desc).limit(10),
      summary: {
        new: scope.where(status: 'new').count,
        triaging: scope.where(status: 'triaging').count,
        triaged: scope.where(status: 'triaged').count,
        resolved: scope.where(status: 'resolved').count,
        false_positive: scope.where(status: 'false_positive').count
      }
    }
  end
end