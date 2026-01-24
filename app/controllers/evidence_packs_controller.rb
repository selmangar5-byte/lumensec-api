# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class EvidencePacksController < ApplicationController
  def index
    @evidence_packs = EvidencePack.all
    render json: @evidence_packs
  end

  def show
    @evidence_pack = EvidencePack.find(params[:id])
    render json: @evidence_pack, include: :analysis_result
  end

  def generate_pdf
    @evidence_pack = EvidencePack.find(params[:id])
    
    pdf = Prawn::Document.new
    pdf.text "Evidence Pack Report", size: 24, style: :bold
    pdf.move_down 20
    pdf.text "Generated: #{Time.current.strftime('%Y-%m-%d %H:%M:%S')}"
    pdf.move_down 10
    pdf.text "Pack Type: #{@evidence_pack.pack_type}"
    pdf.move_down 10
    pdf.text "Data: #{@evidence_pack.data}"
    
    send_data pdf.render,
              filename: "evidence_pack_#{@evidence_pack.id}.pdf",
              type: 'application/pdf',
              disposition: 'attachment'
  end
end