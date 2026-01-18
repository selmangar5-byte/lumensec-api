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

ActiveRecord::Schema[7.2].define(version: 2026_01_16_182206) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "analysis_results", force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.uuid "webhook_event_id", null: false
    t.uuid "correlation_id"
    t.string "source"
    t.jsonb "event_key"
    t.jsonb "triage"
    t.jsonb "narrative"
    t.jsonb "evidence"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id"], name: "index_analysis_results_on_tenant_id"
    t.index ["webhook_event_id"], name: "index_analysis_results_on_webhook_event_id"
  end

  create_table "tenants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "webhook_secret", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  add_foreign_key "webhook_events", "tenants"
end
