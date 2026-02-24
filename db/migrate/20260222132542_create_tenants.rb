class CreateTenants < ActiveRecord::Migration[7.2]
  def change
    create_table :tenants do |t|
      t.string :name
      t.string :domain

      t.timestamps
    end
  end
end
