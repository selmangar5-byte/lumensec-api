Rails.application.routes.draw do
 # get "analysis_results/create"
  post "/ingest/webhook", to: "webhooks#create"
  post "/analysis_results", to: "analysis_results#create"

end
