module Api
  class OauthController < ApplicationController
    
    # Étape 1: Redirection vers Microsoft
    def microsoft_auth
      tenant_id = params[:tenant_id] || request.headers['X-Tenant-ID'] || 'default'
      
      # Configuration Microsoft (valeurs directes pour test)
      client_id = "b6e46d8-3293-4ed7-94ad-f15e4e42c776"
      redirect_uri = "https://symmetrical-system-wrpwxpjr57qx29wjr-3000.app.github.dev/api/auth/microsoft/callback"
      scopes = "User.Read.All Directory.Read.All Reports.Read.All"
      
      # On encode le tenant_id dans le state
      state_payload = {
        tenant_id: tenant_id,
        nonce: SecureRandom.hex(16)
      }
      state = Base64.urlsafe_encode64(state_payload.to_json)
      
      # URL d'autorisation Microsoft
      auth_url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" \
                 "client_id=#{client_id}" \
                 "&response_type=code" \
                 "&redirect_uri=#{CGI.escape(redirect_uri)}" \
                 "&scope=#{CGI.escape(scopes)}" \
                 "&state=#{state}" \
                 "&response_mode=query"
      
      redirect_to auth_url, allow_other_host: true
    end
    
    # Étape 2: Retour de Microsoft avec le code
    def microsoft_callback
      code = params[:code]
      error = params[:error]
      state = params[:state]
      
      tenant_id = extract_tenant_from_state(state) || 'default'
      
      if error
        return redirect_to "#{frontend_url}/insurance?error=microsoft_auth_failed&details=#{error}"
      end
      
      unless code
        return redirect_to "#{frontend_url}/insurance?error=no_code_received"
      end
      
      tokens = exchange_code_for_tokens(code)
      
      if tokens && tokens['access_token']
        user_info = fetch_user_info(tokens['access_token'])
        
        creds = M365Credential.find_or_initialize_by(tenant_id: tenant_id)
        creds.assign_attributes(
          access_token: tokens['access_token'],
          refresh_token: tokens['refresh_token'],
          expires_at: Time.current + tokens['expires_in'].to_i.seconds,
          connected_by_email: user_info&.dig('mail') || user_info&.dig('userPrincipalName'),
          connected_by_name: user_info&.dig('displayName'),
          connection_status: 'connected',
          active: true,
          last_sync_at: Time.current,
          last_error: nil
        )
        
        if creds.save
          redirect_to "#{frontend_url}/insurance?m365_connected=true&tenant=#{tenant_id}"
        else
          redirect_to "#{frontend_url}/insurance?error=save_failed"
        end
      else
        redirect_to "#{frontend_url}/insurance?error=token_exchange_failed"
      end
    end
    
    private
    
    def extract_tenant_from_state(state)
      return nil unless state
      decoded = Base64.urlsafe_decode64(state)
      payload = JSON.parse(decoded)
      payload['tenant_id']
    rescue
      nil
    end
    
    def exchange_code_for_tokens(code)
      # Configuration Microsoft (valeurs directes)
      client_id = "b6e46d8-3293-4ed7-94ad-f15e4e42c776"
      client_secret = "NAI8Q~X6uTjv4ADVRqf5yrpHp6DdHXzFjFOKhcpB"
      redirect_uri = "https://symmetrical-system-wrpwxpjr57qx29wjr-3000.app.github.dev/api/auth/microsoft/callback"
      
      uri = URI("https://login.microsoftonline.com/common/oauth2/v2.0/token")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      request = Net::HTTP::Post.new(uri)
      request.set_form_data({
        'client_id' => client_id,
        'client_secret' => client_secret,
        'code' => code,
        'redirect_uri' => redirect_uri,
        'grant_type' => 'authorization_code'
      })
      
      response = http.request(request)
      JSON.parse(response.body)
    rescue => e
      Rails.logger.error "Token exchange error: #{e.message}"
      nil
    end
    
    def fetch_user_info(access_token)
      uri = URI("https://graph.microsoft.com/v1.0/me")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      request = Net::HTTP::Get.new(uri)
      request['Authorization'] = "Bearer #{access_token}"
      
      response = http.request(request)
      JSON.parse(response.body) if response.code == '200'
    rescue
      nil
    end
    
    def frontend_url
      'https://symmetrical-system-wrpwxpjr57qx29wjr-5173.app.github.dev'
    end
  end
end
