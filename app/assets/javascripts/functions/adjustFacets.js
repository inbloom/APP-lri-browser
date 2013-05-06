// Color the facets based on results
function adjustFacets(facets) {
  for (group in facets) {
    $("div."+group).find("label").addClass('disabled').find('input').prop('disabled',true);
    for (termObj in facets[group].terms) {
      var count = facets[group].terms[termObj].count
      var term = facets[group].terms[termObj].term
      term = term.toLowerCase().replace(/[\s|\-|\+|\&|\/|\)|\(]/g, '');

      if (count != 0) {
        $("div."+group).find("label._"+term).removeClass('disabled').find('input').prop('disabled',false);
      }
    }
  }
}