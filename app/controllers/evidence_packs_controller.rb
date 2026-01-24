# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

class EvidencePacksController < ApplicationController
  skip_before_action :authenticate_user!
  
  def index
    @evidence_packs = EvidencePack.all
    render json: @evidence_packs
  end

  def show
    @evidence_pack = EvidencePack.find(params[:id])
    render json: @evidence_pack
  end
end
