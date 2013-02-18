class AddSortOrderToCollectables < ActiveRecord::Migration
  def change
    add_column :collectables, :sort_order, :integer
  end
end
