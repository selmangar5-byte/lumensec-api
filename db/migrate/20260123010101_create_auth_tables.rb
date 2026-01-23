class CreateAuthTables < ActiveRecord::Migration[7.2]
  def change
    # Users table
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :tenant_id, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :name
      t.timestamps
    end
    
    add_index :users, :tenant_id
    add_index :users, :email, unique: true
    add_foreign_key :users, :tenants
    
    # Roles table
    create_table :roles, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.jsonb :permissions, default: {}, null: false
      t.timestamps
    end
    
    add_index :roles, :name, unique: true
    
    # User Roles table (join table)
    create_table :user_roles, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :user_id, null: false
      t.uuid :role_id, null: false
      t.timestamps
    end
    
    add_index :user_roles, [:user_id, :role_id], unique: true
    add_foreign_key :user_roles, :users
    add_foreign_key :user_roles, :roles
  end
end