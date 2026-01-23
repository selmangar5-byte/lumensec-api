Rails.application.routes.draw do
  post "/ingest/webhook", to: "webhooks#create"
  post "/analysis_results", to: "analysis_results#create"
  get  "/analysis_results/:id", to: "analysis_results#show"

  resources :evidence_packs, only: [:create, :show, :update, :destroy]
end
