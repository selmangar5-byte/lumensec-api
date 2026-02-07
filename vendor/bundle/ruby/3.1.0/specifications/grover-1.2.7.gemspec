# -*- encoding: utf-8 -*-
# stub: grover 1.2.7 ruby lib

Gem::Specification.new do |s|
  s.name = "grover".freeze
  s.version = "1.2.7"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "allowed_push_host" => "https://rubygems.org", "rubygems_mfa_required" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Andrew Bromwich".freeze]
  s.date = "2026-02-06"
  s.description = "Transform HTML into PDF/PNG/JPEG using Google Puppeteer/Chromium".freeze
  s.email = ["abromwich@studiosity.com".freeze]
  s.homepage = "https://github.com/Studiosity/grover".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new([">= 3.0.0".freeze, "< 4.1.0".freeze])
  s.rubygems_version = "3.3.15".freeze
  s.summary = "A Ruby gem to transform HTML into PDF, PNG or JPEG by wrapping the NodeJS Google Puppeteer driver for Chromium".freeze

  s.installed_by_version = "3.3.15" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<nokogiri>.freeze, ["~> 1"])
  else
    s.add_dependency(%q<nokogiri>.freeze, ["~> 1"])
  end
end
