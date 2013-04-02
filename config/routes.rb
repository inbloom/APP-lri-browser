###############################################################################
# Copyright 2012-2013 inBloom, Inc. and its affiliates.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###############################################################################

Browser::Application.routes.draw do

  match "/auth/:provider/callback" => "sessions#create"
  match "/signout" => "sessions#destroy", :as => :signout

  # This is the only way to do this for now.. when a user enters a query string, do a full search to get the results
  resources :browser, :only => [ :index, :search ] do
    collection do
      post :search,   :path => "/search",   :constraints => { :format => /json/ }
    end
  end

  # Until we get the products united, just forward to tagger code
  root :to => 'browser#index'

end
