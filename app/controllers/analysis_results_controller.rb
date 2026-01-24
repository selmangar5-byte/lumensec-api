# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class AnalysisResultsController < ApplicationController
  def index
    @analysis_results = current_tenant&.analysis_results || AnalysisResult.all
    render json: @analysis_results
  end

  def show
    @analysis_result = AnalysisResult.find(params[:id])
    render json: @analysis_result
  end

  def update
    @analysis_result = AnalysisResult.find(params[:id])
    if @analysis_result.update(analysis_result_params)
      render json: @analysis_result
    else
      render json: { errors: @analysis_result.errors }, status: :unprocessable_entity
    end
  end

  private

  def analysis_result_params
    params.require(:analysis_result).permit(:status, :severity)
  end
end
