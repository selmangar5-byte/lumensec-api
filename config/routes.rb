# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

Rails.application.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }

  # Auth (public)
  post '/auth/login', to: 'auth#login'
  post '/auth/logout', to: 'auth#logout'

  # Webhooks (public)
  post '/ingest/webhook', to: 'webhooks#create'

  # Analysis Results
  resources :analysis_results, only: [:index, :show, :update]
  
  # Evidence Packs
  resources :evidence_packs, only: [:index, :show, :create, :destroy] do
    member do
      get :download_pdf
    end
  end

  # Dashboard KPIs
  get '/dashboard', to: 'kpis#dashboard'
end