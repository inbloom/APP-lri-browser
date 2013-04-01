require 'spec_helper'

describe Collectable do
  
  before { @user = User.new }

  context "Validation Checks" do

    it { should respond_to :user_id }
    it { should respond_to :resource_uuid }

    it { should validate_presence_of(:resource_uuid) }

  end

  context "Relationships" do
    it { should belong_to(:user) }
  end

  context "Class Methods" do

  end

  context "Instance Methods" do
    
  end

end