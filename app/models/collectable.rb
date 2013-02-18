class Collectable < ActiveRecord::Base
  attr_accessible :user_id, :resource_uuid
  
  has_many :users
end
