// Helper to adjust the item margins to fit the screen correctly
function adjustItemMargins() {
  whole = $('div.results._search').width() / 220;
  required = 220 * Math.floor(whole);
  blankspace = $('div.results._search').width() - required;
  margins = Math.ceil((blankspace / Math.floor(whole)) / 2) + 5;

  $('div.item').css('margin-left', margins);
  $('div.item').css('margin-right', margins);
}