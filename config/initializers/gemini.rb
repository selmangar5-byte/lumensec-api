# Chargement de la clé Gemini depuis .env
if File.exist?('/workspaces/lumensec-api/.env')
  File.readlines('/workspaces/lumensec-api/.env').each do |line|
    key, value = line.split('=', 2)
    ENV[key] = value.chomp if key && value
  end
end

GEMINI_API_KEY = ENV['GEMINI_API_KEY']
GEMINI_MODEL = 'gemini-2.0-flash'

Rails.logger.info "Gemini API Key: #{GEMINI_API_KEY ? 'Configured ✅' : 'Not configured ❌'}"