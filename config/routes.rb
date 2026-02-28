Rails.application.routes.draw do
  # Health check
  get '/health', to: 'application#health'

  # Dashboard (ANCIEN - conservé pour compatibilité)
  get '/dashboard/stats', to: 'dashboard#stats'

  # M365 (ANCIEN - conservé pour compatibilité)
  get '/m365/alerts', to: 'm365#alerts'
  get '/m365/credentials', to: 'm365#credentials'
# Microsoft OAuth
get '/api/auth/microsoft', to: 'api/oauth#microsoft_auth'
get '/api/auth/microsoft/callback', to: 'api/oauth#microsoft_callback'
post '/api/m365/:tenant_id/scan', to: 'api/m365_credentials#trigger_scan'
get '/api/m365/:tenant_id/scan-status', to: 'api/m365_credentials#scan_status'
  # Analyse IA (ANCIEN)
  post '/alerts/:id/analyze', to: 'alerts#analyze'
  
  # API Namespace (NOUVEAU - pour Insurance et futurs endpoints)
  namespace :api do
    # M365 Credentials API (pour frontend)
    get 'm365/credentials', to: 'm365_credentials#show'
    options 'm365/credentials', to: 'm365_credentials#options'
    
    # Insurance Assessments - CRITIQUE pour le module Insurance
    get 'insurance_assessments', to: 'insurance_assessments#index'
    post 'insurance_assessments', to: 'insurance_assessments#create'
    
    # AJOUT : Route pour générer le rapport PDF (Étape 1 correction)
    get 'insurance_assessments/:id/report', to: 'insurance_assessments#report'
    
    # AJOUT : Routes Loi 25 (NOUVEAU)
    get 'loi25_assessments', to: 'loi25_assessments#index'
    post 'loi25_assessments', to: 'loi25_assessments#create'
    get 'loi25_assessments/:id', to: 'loi25_assessments#show'
    
    # AJOUT : Routes Ransomware (Wedge #3 - NOUVEAU)
    get 'ransomware_assessments', to: 'ransomware_assessments#index'
    post 'ransomware_assessments', to: 'ransomware_assessments#create'
    get 'ransomware_assessments/:id', to: 'ransomware_assessments#show'
    
    # AJOUT : Routes Templates Loi 25 pour génération documents (NOUVEAU)
    get 'templates/loi25/:template_type', to: 'templates#show'
    get 'templates/loi25/:template_type/download', to: 'templates#download'
    
    # CORS Preflight pour toutes les routes API
    match '*path', to: proc { [204, {}, ['']] }, via: :options
  end
  
  # CORS Preflight global
  match '*path', to: proc { [204, {}, ['']] }, via: :options
end