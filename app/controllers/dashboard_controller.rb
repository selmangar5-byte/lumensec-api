class DashboardController < ApplicationController
  def stats
    render json: {
      success: true,
      stats: {
        total_incidents: 123,
        critical_incidents: 12,
        active_threats: 5,
        by_severity: {
          "1" => 15,
          "2" => 28,
          "3" => 45,
          "4" => 23,
          "5" => 12
        },
        recent_incidents: [
          {
            id: 1,
            title: "Suspicious Login Attempt",
            severity: "high",
            status: "open",
            created_at: Time.now - 2.hours
          },
          {
            id: 2,
            title: "Malware Detection",
            severity: "critical",
            status: "investigating",
            created_at: Time.now - 5.hours
          },
          {
            id: 3,
            title: "Unauthorized Access",
            severity: "medium",
            status: "resolved",
            created_at: Time.now - 1.day
          }
        ]
      }
    }
  end
end