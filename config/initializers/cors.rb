Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['X-Tenant-ID', 'Content-Type', 'Access-Control-Allow-Origin'],
      credentials: false
  end

  # Explicit allow for Codespaces frontend
  allow do
    origins 'https://symmetrical-system-wrpwxpjr57qx29wjr-5173.app.github.dev'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['X-Tenant-ID', 'Content-Type'],
      credentials: false
  end
end
