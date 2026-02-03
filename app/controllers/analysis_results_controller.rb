# frozen_string_literal: true

class AnalysisResultsController < ApplicationController
  before_action :set_analysis_result, only: [:show, :update, :evidence_pack, :export_pdf]

  def index
    render json: tenant_scope.order(created_at: :desc)
  end

  def show
    render json: @analysis_result.as_json(include: :evidence_pack)
  end

  def update
    if @analysis_result.update(analysis_result_params)
      render json: @analysis_result
    else
      render json: { error: @analysis_result.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def evidence_pack
    @pack = @analysis_result.evidence_pack
    if @pack
      render json: @pack
    else
      render json: { error: "No evidence found" }, status: :not_found
    end
  end

  def export_pdf
    @pack = @analysis_result.evidence_pack
    return render json: { error: "Evidence pack missing" }, status: :not_found unless @pack

    html = render_to_string(
      template: 'evidence_packs/pdf_template',
      layout: 'pdf',
      locals: { pack: @pack, incident: @analysis_result }
    )

    begin
      grover = Grover.new(html, format: 'A4')
      pdf    = grover.to_pdf
      send_data pdf, filename: "lumensec_evidence_#{@analysis_result.id}.pdf", type: 'application/pdf'
    rescue => e
      # Fallback : Grover non configuré. html_safe à remplacer en P2.
      render html: html.html_safe
    end
  end

  private

  def set_analysis_result
    @analysis_result = tenant_scope.find(params[:id])
  end

  def analysis_result_params
    params.require(:analysis_result).permit(:status)
  end
end