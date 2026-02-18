Grover.configure do |config|
  config.options = {
    executable_path: '/usr/bin/chromium-browser',
    launch_args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
end
