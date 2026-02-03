# frozen_string_literal: true
# © 2025 Lumensec Inc. - Propriété Exclusive de Nawal - Tech Lead
# Niveau de Sécurité : Enterprise Grade

class EvidencePack < ApplicationRecord
  belongs_to :analysis_result

  # Validations de base
  validates :analysis_result, presence: true
  validates :data, presence: true
  
  # Validation chirurgicale du schéma JSON (Propriété de Nawal)
  validate :validate_data_schema

  # Helpers pour le Frontend
  def confidence_score
    data&.dig('confidence_score') || 0.0
  end

  def items
    data&.dig('items') || []
  end

  def label
    data&.dig('pack_label') || "Pack Sans Nom"
  end

  private

  REQUIRED_KEYS = %w[pack_label items confidence_score].freeze

  def validate_data_schema
    return if data.blank?

    unless data.is_a?(Hash)
      errors.add(:data, "doit être un objet JSON valide")
      return
    end

    # Vérification des clés obligatoires
    missing = REQUIRED_KEYS - data.keys.map(&:to_s)
    if missing.any?
      errors.add(:data, "clés manquantes pour le SOC : #{missing.join(', ')}")
    end

    # Validation du score (doit être entre 0 et 1 pour Gemini)
    cs = data["confidence_score"]
    if cs.present?
      begin
        score = Float(cs)
        if score < 0.0 || score > 1.0
          errors.add(:data, "le score de confiance doit être compris entre 0.0 et 1.0")
        end
      rescue ArgumentError, TypeError
        errors.add(:data, "le score de confiance doit être un nombre")
      end
    end

    # Validation de la présence d'items
    if data["items"].present? && !data["items"].is_a?(Array)
      errors.add(:data, "les items de preuve doivent être fournis sous forme de liste (Array)")
    end
  end
end


