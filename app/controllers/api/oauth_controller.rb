module Api
  class OauthController < ApplicationController
    
    def microsoft_auth
      tenant_id = params[:tenant_id] || request.headers['X-Tenant-ID'] || 'default'
      client_id = ENV['M365_CLIENT_ID'] || "c13fce9a-22a8-4307-88ec-c2b416f0b449"
      redirect_uri = ENV['M365_REDIRECT_URI'] || "https://symmetrical-system-wrpwxpjr57qx29wjr-3000.app.github.dev/api/auth/microsoft/callback"
      scopes = "openid profile User.Read"
      
      state_payload = { tenant_id: tenant_id, nonce: SecureRandom.hex(16) }
      state = Base64.urlsafe_encode64(state_payload.to_json)
      
      auth_url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" \
                 "client_id=#{client_id}" \
                 "&response_type=code" \
                 "&redirect_uri=#{CGI.escape(redirect_uri)}" \
                 "&scope=#{CGI.escape(scopes)}" \
                 "&state=#{state}" \
                 "&response_mode=query"
      
      redirect_to auth_url, allow_other_host: true
    end
    
    def microsoft_callback
      code = params[:code]
      error = params[:error]
      state = params[:state]
      tenant_id = extract_tenant_from_state(state) || 'default'
      
      if error
        return redirect_to "#{frontend_url}/new-assessment?error=microsoft_auth_failed&details=#{CGI.escape(error)}", allow_other_host: true
      end
      
      unless code
        return redirect_to "#{frontend_url}/new-assessment?error=no_code_received", allow_other_host: true
      end
      
      tokens = exchange_code_for_tokens(code)
      
      if tokens && tokens['access_token']
        user_info = fetch_user_info(tokens['access_token'])
        client_id = ENV['M365_CLIENT_ID'] || "c13fce9a-22a8-4307-88ec-c2b416f0b449"
        client_secret = ENV['M365_CLIENT_SECRET'] || "rLk8Q~PalC-CFNeSz6G1me5xKRTbnYPZT0O33dvZ"
        
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
          client_id: client_id,
          client_secret: client_secret,
          m365_tenant_id: tenant_id
        )
        
        if creds.save
          email = user_info&.dig('mail') || user_info&.dig('userPrincipalName') || ''
          name = user_info&.dig('displayName') || ''
          redirect_to "#{frontend_url}/new-assessment?m365_connected=true&email=#{CGI.escape(email)}&name=#{CGI.escape(name)}", allow_other_host: true
        else
          redirect_to "#{frontend_url}/new-assessment?error=save_failed", allow_other_host: true
        end
      else
        error_msg = tokens&.dig('error_description') || tokens&.dig('error') || 'Unknown error'
        redirect_to "#{frontend_url}/new-assessment?error=token_exchange_failed&details=#{CGI.escape(error_msg)}", allow_other_host: true
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
      client_id = ENV['M365_CLIENT_ID'] || "c13fce9a-22a8-4307-88ec-c2b416f0b449"
      client_secret = ENV['M365_CLIENT_SECRET'] || "rLk8Q~PalC-CFNeSz6G1me5xKRTbnYPZT0O33dvZ"
      redirect_uri = ENV['M365_REDIRECT_URI'] || "https://symmetrical-system-wrpwxpjr57qx29wjr-3000.app.github.dev/api/auth/microsoft/callback"
      
      uri = URI("https://login.microsoftonline.com/common/oauth2/v2.0/token")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/x-www-form-urlencoded'
      request.body = URI.encode_www_form({
        'client_id' => client_id,
        'client_secret' => client_secret,
        'code' => code,
        'redirect_uri' => redirect_uri,
        'grant_type' => 'authorization_code'
      })
      
      response = http.request(request)
      JSON.parse(response.body)
    rescue => e
      { 'error' => 'exception', 'error_description' => e.message }
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