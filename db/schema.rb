# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_01_23_011541) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "analysis_results", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.uuid "webhook_event_id", null: false
    t.uuid "correlation_id"
    t.string "source"
    t.jsonb "event_key", default: {}
    t.jsonb "triage", default: {}
    t.jsonb "narrative", default: {}
    t.jsonb "evidence", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "new"
    t.integer "severity", default: 3
    t.string "title"
    t.text "summary"
    t.datetime "detected_at"
    t.datetime "triaged_at"
    t.datetime "resolved_at"
    t.index ["tenant_id", "status"], name: "index_analysis_results_on_tenant_id_and_status"
    t.index ["tenant_id"], name: "index_analysis_results_on_tenant_id"
    t.index ["webhook_event_id"], name: "index_analysis_results_on_webhook_event_id"
  end

  create_table "audit_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.uuid "user_id"
    t.string "action", null: false
    t.string "resource_type"
    t.uuid "resource_id"
    t.jsonb "metadata", default: {}, null: false
    t.inet "ip_address"
    t.datetime "created_at", null: false
    t.index ["created_at"], name: "index_audit_logs_on_created_at"
    t.index ["tenant_id"], name: "index_audit_logs_on_tenant_id"
  end

  create_table "cost_usages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.uuid "analysis_result_id"
    t.string "provider", null: false
    t.string "model"
    t.integer "tokens_in", default: 0
    t.integer "tokens_out", default: 0
    t.decimal "cost_usd", precision: 10, scale: 6, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_cost_usages_on_created_at"
    t.index ["tenant_id"], name: "index_cost_usages_on_tenant_id"
  end

  create_table "evidence_packs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "analysis_result_id", null: false
    t.jsonb "data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "tenant_id"
    t.string "pack_type", default: "incident"
    t.string "pdf_url"
    t.string "json_url"
    t.string "hash_sha256"
    t.datetime "generated_at"
    t.index ["analysis_result_id"], name: "index_evidence_packs_on_analysis_result_id"
    t.index ["tenant_id"], name: "index_evidence_packs_on_tenant_id"
  end

  create_table "kpi_snapshots", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.date "snapshot_date", null: false
    t.integer "incidents_count", default: 0
    t.decimal "mttd_minutes", precision: 10, scale: 2
    t.decimal "mttr_hours", precision: 10, scale: 2
    t.decimal "fp_rate", precision: 5, scale: 2
    t.decimal "ai_cost_usd", precision: 10, scale: 2, default: "0.0"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id", "snapshot_date"], name: "index_kpi_snapshots_on_tenant_id_and_snapshot_date", unique: true
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "permissions", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "sources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.string "source_type", null: false
    t.string "name", null: false
    t.jsonb "config", default: {}, null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id"], name: "index_sources_on_tenant_id"
  end

  create_table "tenants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "webhook_secret", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "plan", default: "starter"
    t.string "webhook_secret_digest"
    t.decimal "monthly_budget_cap", precision: 10, scale: 2, default: "10.0"
    t.boolean "degraded_mode", default: false
  end

  create_table "user_roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "role_id"], name: "index_user_roles_on_user_id_and_role_id", unique: true
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["tenant_id"], name: "index_users_on_tenant_id"
  end

  create_table "webhook_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.string "source", null: false
    t.string "event_id"
    t.string "fingerprint"
    t.jsonb "payload", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id", "source", "event_id"], name: "idx_webhook_events_tenant_source_event_id", unique: true, where: "(event_id IS NOT NULL)"
    t.index ["tenant_id", "source", "fingerprint"], name: "idx_webhook_events_tenant_source_fingerprint", unique: true, where: "(fingerprint IS NOT NULL)"
    t.index ["tenant_id"], name: "index_webhook_events_on_tenant_id"
  end

  add_foreign_key "analysis_results", "tenants"
  add_foreign_key "analysis_results", "webhook_events"
  add_foreign_key "audit_logs", "tenants"
  add_foreign_key "cost_usages", "tenants"
  add_foreign_key "evidence_packs", "analysis_results"
  add_foreign_key "kpi_snapshots", "tenants"
  add_foreign_key "sources", "tenants"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
  add_foreign_key "users", "tenants"
  add_foreign_key "webhook_events", "tenants"
end
