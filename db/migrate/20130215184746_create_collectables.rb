class CreateCollectables < ActiveRecord::Migration
  def change
    create_table :collectables do |t|
      t.integer :user_id
      t.string  :resource_uuid
      t.timestamps
    end
  end
end
