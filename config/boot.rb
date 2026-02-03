# config/boot.rb
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup"

begin
  require "bootsnap/setup"
rescue LoadError
  # bootsnap is optional (safe fallback)
end
