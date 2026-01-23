# INSTRUCTIONS AGENT IA - LUMENSEC V2.6 MVP

## ⚠️ LIRE AVANT TOUTE ACTION

### ÉTAT ACTUEL DU PROJET (35% complété)
- ✅ PostgreSQL installé et configuré
- ✅ Base de données créée (lumensec_api_development)
- ✅ Tables existantes : tenants, webhook_events, analysis_results, evidence_packs
- ✅ Models : Tenant, WebhookEvent, AnalysisResult, EvidencePack (avec associations)
- ✅ Controllers : WebhooksController, AnalysisResultsController, EvidencePacksController
- ✅ Seeds : 1 tenant de démo créé avec données de test
- ❌ MANQUANT : Auth, RBAC, KPIs, Cost Firewall, Audit, Evidence Pack PDF

### FICHIERS DÉJÀ MODIFIÉS (NE PAS RECRÉER)
- ✅ `db/migrate/20260123011541_fix_analysis_results_id_type.rb` EXISTE
- ✅ `app/models/tenant.rb` mis à jour
- ✅ `app/models/webhook_event.rb` mis à jour
- ✅ `app/controllers/analysis_results_controller.rb` corrigé
- ✅ `app/controllers/evidence_packs_controller.rb` corrigé
- ✅ `db/seeds.rb` créé avec données de test

---

## 📋 TON OBJECTIF : Compléter les 65% manquants pour MVP S4

Tu dois créer les fonctionnalités manquantes dans cet ordre strict.

---

## 🎯 PHASE 1 : MIGRATIONS DATABASE (Jour 1)

### Créer 3 nouvelles migrations

**Migration 1 : CreateAuthTables**
```bash
rails generate migration CreateAuthTables
```

Contenu du fichier :
```ruby
class CreateAuthTables < ActiveRecord::Migration[7.2]
  def change
    # Users
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :name
      t.timestamps
    end
    
    add_index :users, :tenant_id
    add_index :users, :email, unique: true
    add_foreign_key :users, :tenants
    
    # Roles
    create_table :roles, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.jsonb :permissions, default: {}, null: false
      t.timestamps
    end
    
    add_index :roles, :name, unique: true
    
    # User Roles (join table)
    create_table :user_roles, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :user_id, null: false
      t.uuid :role_id, null: false
      t.timestamps
    end
    
    add_index :user_roles, [:user_id, :role_id], unique: true
    add_foreign_key :user_roles, :users
    add_foreign_key :user_roles, :roles
  end
end
```

**Migration 2 : CreateObservabilityTables**
```bash
rails generate migration CreateObservabilityTables
```

Contenu :
```ruby
class CreateObservabilityTables < ActiveRecord::Migration[7.2]
  def change
    # Sources
    create_table :sources, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.string :source_type, null: false
      t.string :name, null: false
      t.jsonb :config, default: {}, null: false
      t.boolean :active, default: true
      t.timestamps
    end
    
    add_index :sources, :tenant_id
    add_foreign_key :sources, :tenants
    
    # KPI Snapshots
    create_table :kpi_snapshots, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.date :snapshot_date, null: false
      t.integer :incidents_count, default: 0
      t.decimal :mttd_minutes, precision: 10, scale: 2
      t.decimal :mttr_hours, precision: 10, scale: 2
      t.decimal :fp_rate, precision: 5, scale: 2
      t.decimal :ai_cost_usd, precision: 10, scale: 2, default: 0.0
      t.jsonb :metadata, default: {}, null: false
      t.timestamps
    end
    
    add_index :kpi_snapshots, [:tenant_id, :snapshot_date], unique: true
    add_foreign_key :kpi_snapshots, :tenants
    
    # Cost Usages
    create_table :cost_usages, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.uuid :analysis_result_id
      t.string :provider, null: false
      t.string :model
      t.integer :tokens_in, default: 0
      t.integer :tokens_out, default: 0
      t.decimal :cost_usd, precision: 10, scale: 6, default: 0.0
      t.timestamps
    end
    
    add_index :cost_usages, :tenant_id
    add_index :cost_usages, :created_at
    add_foreign_key :cost_usages, :tenants
    
    # Audit Logs
    create_table :audit_logs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.uuid :user_id
      t.string :action, null: false
      t.string :resource_type
      t.uuid :resource_id
      t.jsonb :metadata, default: {}, null: false
      t.inet :ip_address
      t.datetime :created_at, null: false
    end
    
    add_index :audit_logs, :tenant_id
    add_index :audit_logs, :created_at
    add_foreign_key :audit_logs, :tenants
  end
end
```

**Migration 3 : UpdateTenantsAndAnalysisResults**
```bash
rails generate migration UpdateTenantsAndAnalysisResults
```

Contenu :
```ruby
class UpdateTenantsAndAnalysisResults < ActiveRecord::Migration[7.2]
  def change
    # Update Tenants
    add_column :tenants, :name, :string
    add_column :tenants, :plan, :string, default: 'starter'
    add_column :tenants, :webhook_secret_digest, :string
    add_column :tenants, :monthly_budget_cap, :decimal, precision: 10, scale: 2, default: 10.0
    add_column :tenants, :degraded_mode, :boolean, default: false
    
    # Update Analysis Results
    add_column :analysis_results, :status, :string, default: 'new'
    add_column :analysis_results, :severity, :integer, default: 3
    add_column :analysis_results, :title, :string
    add_column :analysis_results, :summary, :text
    add_column :analysis_results, :detected_at, :datetime
    add_column :analysis_results, :triaged_at, :datetime
    add_column :analysis_results, :resolved_at, :datetime
    
    add_index :analysis_results, [:tenant_id, :status]
    
    # Update Evidence Packs
    add_column :evidence_packs, :tenant_id, :uuid
    add_column :evidence_packs, :pack_type, :string, default: 'incident'
    add_column :evidence_packs, :pdf_url, :string
    add_column :evidence_packs, :json_url, :string
    add_column :evidence_packs, :hash_sha256, :string
    add_column :evidence_packs, :generated_at, :datetime
    
    add_index :evidence_packs, :tenant_id
  end
end
```

### ⚠️ STOP ET DEMANDER VALIDATION

Après avoir créé ces 3 migrations, ARRÊTE-TOI et dis :

**"Les 3 migrations sont créées. Puis-je exécuter `rails db:migrate` ?"**

Attends ma confirmation avant de continuer.

---

## 🎯 PHASE 2 : MODELS (Jour 2)

Après validation des migrations, crée ces models :

### 1. User Model
```ruby
# app/models/user.rb
class User < ApplicationRecord
  belongs_to :tenant
  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :audit_logs, dependent: :nullify

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def can?(permission)
    roles.any? { |role| role.permissions[permission.to_s] == true }
  end

  def admin?
    roles.any? { |role| role.name == 'admin' }
  end
end
```

### 2. Role Model
```ruby
# app/models/role.rb
class Role < ApplicationRecord
  has_many :user_roles, dependent: :destroy
  has_many :users, through: :user_roles

  validates :name, presence: true, uniqueness: true

  ADMIN_PERMISSIONS = {
    'incidents:read' => true,
    'incidents:write' => true,
    'evidence:export' => true,
    'rules:write' => true,
    'users:manage' => true
  }.freeze

  ANALYST_PERMISSIONS = {
    'incidents:read' => true,
    'incidents:write' => true,
    'evidence:export' => true
  }.freeze

  VIEWER_PERMISSIONS = {
    'incidents:read' => true
  }.freeze
end
```

### 3. Autres Models

Crée aussi :
- `app/models/user_role.rb`
- `app/models/source.rb`
- `app/models/kpi_snapshot.rb`
- `app/models/cost_usage.rb`
- `app/models/audit_log.rb`

### 4. Mettre à jour Tenant

Ajoute ces associations dans `app/models/tenant.rb` :
```ruby
has_many :users, dependent: :destroy
has_many :sources, dependent: :destroy
has_many :kpi_snapshots, dependent: :destroy
has_many :cost_usages, dependent: :destroy
has_many :audit_logs, dependent: :destroy

validates :name, presence: true, if: -> { name.present? }
validates :plan, inclusion: { in: %w[starter pro premium elite] }, if: -> { plan.present? }

def degraded_mode?
  degraded_mode || current_month_cost >= monthly_budget_cap
end

def current_month_cost
  cost_usages.where('created_at >= ?', Time.current.beginning_of_month).sum(:cost_usd)
end
```

---

## 🎯 PHASE 3 : AUTHENTICATION (Jour 3)

### 1. Ajouter gems au Gemfile

Ajoute ces lignes dans le Gemfile :
```ruby
gem 'bcrypt', '~> 3.1.7'
gem 'jwt', '~> 2.7'
```

Puis exécute : `bundle install`

### 2. Créer AuthController
```ruby
# app/controllers/auth_controller.rb
class AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:login]

  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: { token: token, user: user }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def logout
    # JWT est stateless, pas besoin de logout côté serveur
    head :no_content
  end

  private

  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
  end
end
```

### 3. Mettre à jour ApplicationController

Modifie `app/controllers/application_controller.rb` :
```ruby
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
```

---

## 🎯 PHASE 4 : ROUTES & SEEDS

### Mettre à jour routes.rb
```ruby
Rails.application.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }

  # Auth
  post '/auth/login', to: 'auth#login'
  post '/auth/logout', to: 'auth#logout'

  # Webhooks (public)
  post '/ingest/webhook', to: 'webhooks#create'

  # Analysis Results (renommer en incidents plus tard)
  resources :analysis_results, only: [:index, :show, :update]
  
  # Evidence Packs
  resources :evidence_packs, only: [:index, :show, :create, :destroy]
  
  # KPIs
  get '/kpis', to: 'kpis#index'
end
```

### Mettre à jour seeds.rb

Ajoute APRÈS les seeds existants :
```ruby
# Créer des rôles par défaut
puts "\n🔐 Création des rôles..."
admin_role = Role.find_or_create_by!(name: 'admin') do |role|
  role.permissions = Role::ADMIN_PERMISSIONS
end

analyst_role = Role.find_or_create_by!(name: 'analyst') do |role|
  role.permissions = Role::ANALYST_PERMISSIONS
end

viewer_role = Role.find_or_create_by!(name: 'viewer') do |role|
  role.permissions = Role::VIEWER_PERMISSIONS
end

puts "✅ Rôles créés : admin, analyst, viewer"

# Créer un utilisateur admin
puts "\n👤 Création d'un utilisateur admin..."
admin_user = User.find_or_create_by!(email: 'admin@lumensec.local') do |user|
  user.tenant = tenant
  user.name = 'Admin Demo'
  user.password = 'password123'
end

admin_user.user_roles.find_or_create_by!(role: admin_role)

puts "✅ Utilisateur admin créé !"
puts "   📧 Email: admin@lumensec.local"
puts "   🔑 Password: password123"
```

---

## ⚠️ RÈGLES ABSOLUES

1. ❌ JAMAIS exécuter `rails db:drop` ou `rails db:reset`
2. ✅ TOUJOURS demander validation avant `rails db:migrate`
3. ✅ TOUJOURS tester après chaque phase
4. ✅ TOUJOURS isoler par tenant (current_tenant scope)
5. ⚠️ Si erreur → STOP et demander aide

---

## 📞 QUAND DEMANDER VALIDATION

- Avant d'exécuter `rails db:migrate`
- Si une erreur survient
- Si quelque chose n'est pas clair
- Après chaque PHASE complétée

---

## 🎯 DEFINITION OF DONE (MVP S4)

Le MVP est terminé quand :
- ✅ Migrations passées sans erreur
- ✅ Models créés et testés
- ✅ Auth JWT fonctionne (login)
- ✅ Seeds avec admin user OK
- ✅ 0 leak cross-tenant