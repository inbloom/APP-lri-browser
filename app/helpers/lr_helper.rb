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

module LrHelper
  
  # Pushes patadata to the LR
  # def self.publish_paradata data, user
  def self.publish_paradata verb, object, content, related = nil
    
    request = {
      "active" => true,
      "doc_type" => "resource_data",
      "doc_version" => "0.23.0",
      "identity" => {
        # "curator" => "#{user.realm}:#{user.user_id}",
        "submitter" => "inBloom Browser",
        "signer" => "inBloom Browser",
        "submitter_type" => "agent"
      },
      "payload_placement" => "inline",
      'payload_schema' => [],
      "resource_data" => {
        "activity" => {
          "actor" => "inBloom LRI Browser",
          "verb" => verb,
          "object" => object,
          "related" => related,
          "content" => content
        }
      },
      "resource_data_type" => "paradata",
      "resource_locator" => object
    }

    res = self.request :publish, request
    
    puts res.to_yaml
        
  end

  private

  def self.request type, request
    # OAuth stuff..
    consumer = OAuth::Consumer.new 'tagger@inbloom.org', 'ut51n1FsP1CwPkkJxH+bPA2CwMp4DsRu', { :site => 'http://lrnode.inbloom.org' }
    token = OAuth::AccessToken.new(consumer, 'node_sign_token', 'f9Ow52bglXLDCV40sS9AVP0eQutvQj1u')

    # do the request by type!
    case type
      when :publish
        payload = {'documents' => [ request ]}
        rawResponse = consumer.request(:post, '/publish', token, {}, payload.to_json, { 'Content-Type' => 'application/json' })
    end
  end

end
