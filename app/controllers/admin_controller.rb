class AdminController < ApplicationController
  def seed_incidents
    Rake::Task['db:seed_incidents'].invoke
    render json: { status: 'ok', message: 'Incidents seeded' }
  end
end
