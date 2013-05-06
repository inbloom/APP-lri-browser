// Primary search. Works a lot like inline search but allows the main filter to be defined and doesn't restrict by dotnotation
// Also it only listens to the secondary filters as the primary filters check the secondaries where necessary
function search(query, page, limit) {
  if (query == undefined) return;
  var query = query.replace(/^\s+/,'').replace(/\s+$/,'');
  var page = (page != undefined)?page:searchPage;
  var limit = (limit != undefined)?limit:searchLimit;
  var offset = (page -1) * limit;
  // don't allow empty searches
  if (query == '') return;
  // Show the searching mask and panel
  toggleSearchPanel(true);
  toggleSearchMask(true);
  toggleSearchSpinner(true);
  $('#itemModal').fadeOut();
  // build our filters
  var filters = {};
  // Go through the complete secondary filter list and add them to the filter variable
  // We dont have to add the primaries like we do up in the inline filter loader because
  // the secondaries are checked when you check the primaries
  $('input.secondaryCheckbox').each(function(i, o) {
    if ($(o).prop('checked')) {
      var name = $(o).prop('name');
      filters[name] = true;
    }
  });
  // setting some globals
  searchQuery = query;
  searchOffset = offset;
  searchLimit = limit;
  searchFilters = filters;
  searchPage = page;

  // POST!
  $.ajax({
    type : "POST",
    dataType : 'json',
    url  : "/browser/search",
    data : { query : query, filters : filters, limit : limit, offset : offset },
    success : function(xhr) {
      toggleSearchMask(false);
      toggleSearchSpinner(false);
      renderSearchResults(xhr.hits, true);
      adjustFacets(xhr.facets);
    },
    error : function(xhr, txtStatus, errThrown) {
      // @TODO what do we do here if something just fails
    }
  });

}


