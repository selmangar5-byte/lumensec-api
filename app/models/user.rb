# frozen_string_literal: true
# Copyright © 2025 Lumensec Inc. All rights reserved.

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