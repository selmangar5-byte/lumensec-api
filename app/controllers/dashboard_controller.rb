class DashboardController < ApplicationController
  def stats
    # Return mock stats for the old SOC Dashboard
    render json: {
      success: true,
      stats: {
        total_incidents: 123,
        critical_incidents: 12,
        active_threats: 5,
        recent_incidents: []
      }
    }
  end
end
