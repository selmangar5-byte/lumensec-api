# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class DashboardController < ApplicationController
  def stats
    render json: {
      total_incidents: AnalysisResult.count,
      by_status: AnalysisResult.group(:status).count,
      by_severity: AnalysisResult.group(:severity).count,
      recent_incidents: AnalysisResult.order(created_at: :desc).limit(10),
      summary: {
        new: AnalysisResult.where(status: "new").count,
        triaging: AnalysisResult.where(status: "triaging").count,
        resolved: AnalysisResult.where(status: "resolved").count
      }
    }
  end
end
