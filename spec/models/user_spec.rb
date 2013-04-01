require 'spec_helper'

describe User do
  
  before { @user = User.new }

  context "Validation Checks" do

    it { should respond_to :full_name }
    it { should respond_to :external_id }
    it { should respond_to :email }
    it { should respond_to :realm }
    it { should respond_to :tenant_id }
    it { should respond_to :provider }
    it { should respond_to :user_id }
    it { should respond_to :tenant_id }

    it { should validate_presence_of(:full_name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:provider) }
    it { should validate_presence_of(:realm) }
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:tenant_id) }

  end

  context "Relationships" do
    it { should have_many(:collectables) }
  end

  context "Class Methods" do

  end

  context "Instance Methods" do
    
  end

end