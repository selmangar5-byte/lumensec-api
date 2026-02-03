# frozen_string_literal: true

Rails.application.routes.draw do
  root to: proc { [200, { 'Content-Type' => 'application/json' }, [{ status: 'Lumensec SOC API Online', version: '2.8.0' }.to_json]] }

  get 'dashboard/stats', to: 'dashboard#stats'

  resources :analysis_results, only: [:index, :show, :update] do
    member do
      get :evidence_pack
      get :export_pdf
    end
  end

  post 'webhooks/receive', to: 'webhooks#receive'
end