Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # API endpoints
  resources :analysis_results, only: [:index, :show, :update]
  
  resources :evidence_packs, only: [:index, :show] do
    member do
      get :generate_pdf
    end
  end

  # Webhooks
  post 'webhooks/crowdstrike', to: 'webhooks#crowdstrike'

  # Dashboard
  get 'dashboard/stats', to: 'dashboard#stats'
end
