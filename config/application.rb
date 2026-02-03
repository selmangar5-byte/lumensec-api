# config/application.rb
require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module Lumensec
  class Application < Rails::Application
    # Initialise configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # API-only application
    config.api_only = true

    # Time zone (safe default)
    config.time_zone = "UTC"
    config.active_record.default_timezone = :utc

    # Disable generators we don't use
    config.generators do |g|
      g.test_framework nil
      g.assets false
      g.helper false
    end
  end
end
