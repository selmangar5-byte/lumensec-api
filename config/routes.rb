Rails.application.routes.draw do
  # Health check
  get '/health', to: 'application#health'

  # Dashboard
  get '/dashboard/stats', to: 'dashboard#stats'

  # M365
  get '/m365/alerts', to: 'm365#alerts'
  get '/m365/credentials', to: 'm365#credentials'

  # Analyse IA
  post '/alerts/:id/analyze', to: 'alerts#analyze'
end
