Rails.Rails.application.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }

  # Auth (public, pas d'authentification requise)
  post '/auth/login', to: 'auth#login'
  post '/auth/logout', to: 'auth#logout'

  # Webhooks (public)
  post '/ingest/webhook', to: 'webhooks#create'

  # Analysis Results
  resources :analysis_results, only: [:index, :show, :update]
  
  # Evidence Packs
  resources :evidence_packs, only: [:index, :show, :create, :destroy]
endpplication.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }

  # Auth (public, pas d'authentification requise)
  post '/auth/login', to: 'auth#login'
  post '/auth/logout', to: 'auth#logout'

  # Webhooks (public)
  post '/ingest/webhook', to: 'webhooks#create'

  # Analysis Results
  resources :analysis_results, only: [:index, :show, :update]
  
  # Evidence Packs
  resources :evidence_packs, only: [:index, :show, :create, :destroy]
endRails.application.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }

  # Auth (public, pas d'authentification requise)
  post '/auth/login', to: 'auth#login'
  post '/auth/logout', to: 'auth#logout'

  # Webhooks (public)
  post '/ingest/webhook', to: 'webhooks#create'

  # Analysis Results
  resources :analysis_results, only: [:index, :show, :update]
  
  # Evidence Packs
  resources :evidence_packs, only: [:index, :show, :create, :destroy]
endRails.application.routes.draw do
  post "/ingest/webhook", to: "webhooks#create"
  post "/analysis_results", to: "analysis_results#create"
  get  "/analysis_results/:id", to: "analysis_results#show"

 
   # Dashboard KPIs
  get '/dashboard', to: 'kpis#dashboard'
   resources :evidence_packs, only: [:create, :show, :update, :destroy]
end
