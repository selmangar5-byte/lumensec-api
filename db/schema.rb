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

ActiveRecord::Schema[7.2].define(version: 2026_02_10_181744) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "analysis_results", force: :cascade do |t|
    t.string "tenant_id", null: false
    t.string "webhook_event_id"
    t.string "correlation_id"
    t.string "source", null: false
    t.string "status", default: "new", null: false
    t.integer "severity", default: 1, null: false
    t.jsonb "triage", default: {}
    t.jsonb "narrative", default: {}
    t.jsonb "evidence", default: {}
    t.jsonb "event_key", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "incident_id"
    t.index ["incident_id"], name: "index_analysis_results_on_incident_id"
    t.index ["tenant_id"], name: "index_analysis_results_on_tenant_id"
  end

  create_table "evidence_packs", force: :cascade do |t|
    t.bigint "analysis_result_id", null: false
    t.jsonb "data", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["analysis_result_id"], name: "index_evidence_packs_on_analysis_result_id"
  end

  create_table "incidents", force: :cascade do |t|
    t.string "tenant_id", null: false
    t.string "webhook_event_id"
    t.string "correlation_id"
    t.string "source", null: false
    t.string "status", default: "new", null: false
    t.integer "severity", default: 1, null: false
    t.string "summary"
    t.text "narrative"
    t.string "source_ip"
    t.string "target_system"
    t.jsonb "event_key", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["severity"], name: "index_incidents_on_severity"
    t.index ["status"], name: "index_incidents_on_status"
    t.index ["tenant_id"], name: "index_incidents_on_tenant_id"
  end

  create_table "insurance_assessments", force: :cascade do |t|
    t.uuid "tenant_id", null: false
    t.integer "score"
    t.string "risk_level"
    t.jsonb "answers"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id"], name: "index_insurance_assessments_on_tenant_id"
  end

  add_foreign_key "evidence_packs", "analysis_results"
end
