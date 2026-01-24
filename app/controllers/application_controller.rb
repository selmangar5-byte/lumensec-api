# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class ApplicationController < ActionController::API
  wrap_parameters false
  
  before_action :authenticate_user!
  before_action :set_tenant

  attr_reader :current_user, :current_tenant

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless token

    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
      @current_user = User.find_by(id: decoded.first['user_id'])
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }, status: :unauthorized
    end

    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def set_tenant
    @current_tenant = @current_user&.tenant
  end

  def authorize_action!(permission)
    unless current_user.can?(permission)
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end