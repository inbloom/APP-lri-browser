class BrowserController < ApplicationController

  def index
    respond_to do |format|
      format.html {}
    end

  end

  def mathmatics
    respond_to do |format|
      format.json { render json: response }
    end
  end

  def languagearts
    respond_to do |format|
      format.json { render json: response }
    end
  end

  # Searching the site will
  # The Full Search function issues restful search requests to our ElasticSearch engine.
  # It's likely not perfect, and this is the first time I have used ES so forgive me if
  #  this is the wrong way to do this.
  # The bulk of the code below just forms the json query payload.  You can uncomment some
  #  of the commented out PUTS below to see the output in webrick and make sure it's right.
  # Comments, suggestions and feedback is welcome; Jason Ellis <jason@grok-interactive.com>
  def search

    # define the elasticsearch result "size" (limit)
    limit = params['limit']
    # define the elasticsearch result "from" (offset)
    offset = params['offset']
    # Default output
    searchResults = ''
    # If we have filters, we need to parse them
    if params['filters'].present?
      filters = []
      # For each of the filters format them and stuff them into an array
      params['filters'].each do |key, filter|
        if filter.keys.count > 1
          # This is more complex because this filter type needs the keys or'd together
          orFilters = []
          filter.keys.each do |f|
            orFilters << { 'query' => { 'match' => { key => f.to_s } } }
          end
          filters << { 'or' => orFilters }
        else
          # This should be simple, there is only one of this filter key
          filters << { 'query' => { 'match' => { key => filter.keys.first.to_s } } }
        end
      end

      # If the query is present we need to match it
      if params['query'].present?
        query = { 'match' => { '_all' => params['query'] } }
        filter = { 'limit' => { 'value' => 100 }, 'and' => filters }
        # If no query is present then we can wildcard against anything
      else
        query = { 'match' => { '_all' => '?' } }
        filter = { 'limit' => { 'value' => 100 }, 'and' => filters }
      end
       # if not filter is present then just match against query
    else
      query = { 'match' => { '_all' => params['query'] } }
      filter = { 'limit' => { 'value' => 100 } }
    end

    # Build the payload from the various parts
    payload = {
        'size' => limit,
        'from' => offset,
        'query' => {
            'filtered' => {
                'query' => query,
                'filter' => filter
            }
        }
    }
#puts "PAYLOAD"; puts payload.to_json

    # Okay after all that mess, lets make the request
    request = RestClient::Request.new( :method => :get, :url => Rails.configuration.elastic_search_url, :payload => payload.to_json )

    # Since this can error lets catch it
    begin
      searchResults = request.execute
      respond_to do |format|
        format.json { render json: searchResults }
#        format.json { render json: payload.to_json }
      end
#puts "RESPONSE"; puts searchResults
    rescue => e
      # @TODO Need to return the correct error type and then an error message to be shown to user.
      respond_to do |format|
        format.json { render json: searchResults }
      end
#puts "ERROR!"; puts e.response
    end

  end
  
  def link
    redirect_to params[:url]
  end

end

