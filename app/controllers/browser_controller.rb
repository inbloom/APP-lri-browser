class BrowserController < ApplicationController

  def index

    # TODO Eventually we will be hitting ES here for now its dummy data
    response = {
      page: 1,
      pageCount: 14,
      items: [{
          id: '123abc-1',
          img: '/assets/tmp-1.png',
          title: 'Treefrog Video',
          provider: 'Mother Nature',
          popularity: 2
      },{
          id: '123abc-2',
          img: '/assets/tmp-2.png',
          title: 'Neemo Video',
          provider: 'Sharkbait Films',
          popularity: 3
      },{
          id: '123abc-3',
          img: '/assets/tmp-3.png',
          title: 'Paradise Lost',
          provider: 'SomeIsland',
          popularity: 1
      },{
          id: '123abc-4',
          img: '/assets/tmp-4.png',
          title: 'Wayout-there Video',
          provider: 'Space Screams',
          popularity: 0
      }]
    };

    respond_to do |format|
      format.html {}
      format.json { render json: response }
    end

  end

end
