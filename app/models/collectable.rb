class Collectable < ActiveRecord::Base
  attr_accessible :user_id, :resource_uuid, :sort_order
  
  belongs_to :user
  
  validates :resource_uuid, :presence => true
end
