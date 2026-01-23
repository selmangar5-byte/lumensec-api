class EvidencePack < ApplicationRecord
  belongs_to :analysis_result

  validates :analysis_result, presence: true
  validates :data, presence: true
  validate :validate_data_schema

  private

  REQUIRED_KEYS = %w[pack_label items confidence_score].freeze

  def validate_data_schema
    return if data.blank?

    unless data.is_a?(Hash)
      errors.add(:data, "must be a JSON object")
      return
    end

    # Check required keys
    missing = REQUIRED_KEYS - data.keys.map(&:to_s)
    errors.add(:data, "missing keys: #{missing.join(', ')}") if missing.any?

    # pack_label: non-empty string
    pack_label = data["pack_label"]
    if pack_label.blank? || !pack_label.is_a?(String)
      errors.add(:data, "pack_label must be a non-empty string")
    end

    # items: non-empty array
    items = data["items"]
    unless items.is_a?(Array) && items.any?
      errors.add(:data, "items must be a non-empty array")
    end

    # confidence_score: numeric between 0.0 and 1.0
    cs = data["confidence_score"]
    begin
      cs_f = Float(cs)
      if cs_f < 0.0 || cs_f > 1.0
        errors.add(:data, "confidence_score must be between 0.0 and 1.0")
      end
    rescue ArgumentError, TypeError
      errors.add(:data, "confidence_score must be numeric")
    end
  end
end


