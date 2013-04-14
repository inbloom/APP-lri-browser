require 'spec_helper'

describe "PasswordResets" do

  Capybara.ignore_hidden_elements = true

  it "shows Language Arts data when on ELA tab" do
    visit root_path
    click_button "_ccsselaliteracy"
    page.should have_content("English Language Arts")
  end
  
  it "shows Language Arts data when on ELA tab" do
    visit root_path
    page.should have_content("Mathematics")
  end
  
  it "redirects to url via link action" do
    # visit '/browser/link?url=https://www.inbloom.org'
    # save_and_open_page
    # page.status_code.should == 302
    # # page.should have_content("inBloom, Inc")
  end

end
