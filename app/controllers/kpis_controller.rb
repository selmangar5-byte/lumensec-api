class KpisController < ApplicationController
  def dashboard
    # Métriques ce mois
    start_of_month = Time.current.beginning_of_month
    
    # Incidents
    total_incidents = current_tenant.analysis_results
      .where('created_at >= ?', start_of_month)
      .count
    
    incidents_by_status = current_tenant.analysis_results
      .where('created_at >= ?', start_of_month)
      .group(:status)
      .count
    
    # Coûts AI
    total_ai_cost = current_tenant.cost_usages
      .where('created_at >= ?', start_of_month)
      .sum(:cost_usd)
    
    budget_usage_percent = if current_tenant.monthly_budget_cap > 0
      (total_ai_cost / current_tenant.monthly_budget_cap * 100).round(2)
    else
      0
    end
    
    # MTTD / MTTR (si données disponibles)
    latest_snapshot = current_tenant.kpi_snapshots
      .order(snapshot_date: :desc)
      .first
    
    render json: {
      period: "#{start_of_month.strftime('%B %Y')}",
      incidents: {
        total: total_incidents,
        by_status: incidents_by_status,
        new: incidents_by_status['new'] || 0,
        triaging: incidents_by_status['triaging'] || 0,
        resolved: incidents_by_status['resolved'] || 0
      },
      costs: {
        total_usd: total_ai_cost.to_f.round(2),
        budget_cap_usd: current_tenant.monthly_budget_cap.to_f,
        usage_percent: budget_usage_percent,
        degraded_mode: current_tenant.degraded_mode?
      },
      performance: {
        mttd_minutes: latest_snapshot&.mttd_minutes&.to_f,
        mttr_hours: latest_snapshot&.mttr_hours&.to_f,
        false_positive_rate: latest_snapshot&.fp_rate&.to_f
      },
      tenant: {
        id: current_tenant.id,
        name: current_tenant.name,
        plan: current_tenant.plan
      }
    }, status: :ok
  end
end