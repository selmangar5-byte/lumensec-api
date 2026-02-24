# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class Tenant < ApplicationRecord
  has_many :webhook_events, dependent: :destroy
  has_many :analysis_results, dependent: :destroy
  has_many :evidence_packs, through: :analysis_results
  
  # Assessments relations
  has_many :insurance_assessments, dependent: :destroy
  has_many :ransomware_assessments, dependent: :destroy
  has_many :loi25_assessments, dependent: :destroy
  
  validates :webhook_secret, presence: true, length: { minimum: 32 }
end