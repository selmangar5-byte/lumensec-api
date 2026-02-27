class AddOauthFieldsToM365Credentials < ActiveRecord::Migration[7.2]
  def change
    # Tokens OAuth (chiffrés via Rails encrypted attributes)
    add_column :m365_credentials, :access_token, :text
    add_column :m365_credentials, :refresh_token, :text
    add_column :m365_credentials, :expires_at, :datetime
    
    # Info utilisateur connecté (pour l'audit)
    add_column :m365_credentials, :connected_by_email, :string
    add_column :m365_credentials, :connected_by_name, :string
    
    # Statut détaillé
    add_column :m365_credentials, :connection_status, :string, default: 'pending'
    add_column :m365_credentials, :last_error, :text
    
    # Index pour performance
    add_index :m365_credentials, :connection_status
  end
end
