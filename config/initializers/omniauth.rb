Rails.application.config.middleware.use OmniAuth::Builder do

  provider :slc, INBLOOM_CONFIG[:client_id], INBLOOM_CONFIG[:shared_secret], :setup => lambda{|env|
     env['omniauth.strategy'].options[:client_options].site = 'https://api.sandbox.inbloom.org'
  }

end