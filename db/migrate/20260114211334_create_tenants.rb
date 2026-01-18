class CreateTenants < ActiveRecord::Migration[7.2]
  def change
    create_table :tenants, id: :uuid do |t|
      t.string :webhook_secret, null: false
      t.timestamps
    end
  end
end
