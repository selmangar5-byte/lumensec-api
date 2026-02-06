source "https://rubygems.org"

ruby "3.2.0"

# Rails
gem "rails", "~> 7.2.3"

# Web server
gem "puma", ">= 5.0"

# Database (PostgreSQL — Lumensec)
gem "pg", "~> 1.5"

# Performance
gem "bootsnap", require: false

# Timezone data for Windows
gem "tzinfo-data", platforms: %i[ mswin mswin64 mingw x64_mingw jruby ]

# Security / Auth
gem "bcrypt", "~> 3.1.7"
gem "jwt", "~> 2.7"

# CORS
gem "rack-cors", "~> 3.0"

# PDF / Evidence Pack
gem "grover"          # HTML → PDF (Evidence Pack export)
gem "prawn", "~> 2.4" # (non utilisé actuellement, conservé)
gem "prawn-table", "~> 0.2"

# Utilities
gem "matrix"

group :development, :test do
  # Debugging
  gem "debug", platforms: %i[ mri mswin mswin64 mingw x64_mingw ], require: "debug/prelude"

  # Security scanner
  gem "brakeman", require: false

  # Ruby / Rails style
  gem "rubocop-rails-omakase", require: false
end
