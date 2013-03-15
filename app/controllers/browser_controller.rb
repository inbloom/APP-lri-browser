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

  def search
    respond_to do |format|
      format.json { render json: response }
    end
  end

end
