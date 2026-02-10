module Api
  class InsuranceAssessmentsController < ApplicationController
    def create
      answers = params[:answers]
      
      result = InsuranceScoringEngine.calculate(answers)
      
      render json: {
        success: true,
        assessment: result
      }, status: :created
    end
  end
end
