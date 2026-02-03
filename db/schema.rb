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

ActiveRecord::Schema[7.2].define(version: 2025_01_01_000001) do
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
    t.index ["tenant_id"], name: "index_analysis_results_on_tenant_id"
  end

  create_table "evidence_packs", force: :cascade do |t|
    t.bigint "analysis_result_id", null: false
    t.jsonb "data", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["analysis_result_id"], name: "index_evidence_packs_on_analysis_result_id"
  end

  add_foreign_key "evidence_packs", "analysis_results"
end
