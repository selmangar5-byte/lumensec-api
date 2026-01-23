class EvidencePacksController < ApplicationController
  protect_from_forgery with: :null_session
  
  def create
    evidence_pack = EvidencePack.create!(
      analysis_result_id: params[:analysis_result_id],
      data: params[:data]
    )
    render json: { id: evidence_pack.id }, status: :created
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def show
    evidence_pack = EvidencePack.find(params[:id])
    render json: evidence_pack, include: :analysis_result
  rescue => e
    render json: { error: e.message }, status: :not_found
  end

  def update
    evidence_pack = EvidencePack.find(params[:id])
    evidence_pack.update!(data: params[:data])
    head :no_content
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    evidence_pack = EvidencePack.find(params[:id])
    evidence_pack.destroy
    head :no_content
  rescue => e
    render json: { error: e.message }, status: :not_found
  end
end
