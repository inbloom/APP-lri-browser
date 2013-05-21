
// Build out the accordion navigation based on which standard
function buildAccordionNavigation(div, req) {
  // Clear the div
  $(div).empty();

  // Create navigation for CCSS.ELA-Literacy
  if (req == 'ccsselaliteracy') {
    var standard = jsonStandards.CCSS['ELA-Literacy'];

    for (i in standard) {
      if (i.charAt(0) == '_') continue;

      var title = accordionTitle(standard[i]._text);
      var links = "";

      for (var s = 0; s < 25; s++) {

        if (standard[i]._order[s] == undefined) continue;

        var key = standard[i]._order[s].substr( standard[i]._order[s].lastIndexOf('.') + 1, standard[i]._order[s].length )
        var item = standard[i][key];

        if (gradeRanges.maximum < item._min || gradeRanges.minimum > item._max) continue;

        var linkText = (standard[i][key]._text != undefined)?standard[i][key]._text:key;
        links += '<p><a href="#CCSS.ELA-Literacy.'+i+'.'+key+'" rel="navlink">' + linkText + '</a></p>';
      }

      $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);
    }

    // Create navigation for CCSS.Math
  } else if (req == 'ccssmath') {

    // Inject the math Practice standards -- they work completely differently than the rest of math.. of course
    var standard = jsonStandards.CCSS.Math.Practice;
    var title = accordionTitle(standard._text);
    var links = "";

    for (var i = 0; i < 25; i++) {
      if (standard._order[i] == undefined) continue;

      var linkText = standard._order[i].substr( standard._order[i].lastIndexOf(':') + 1, standard._order[i].length )
      var linkNotation = standard._order[i].substr( standard._order[i].lastIndexOf(':') + 1, standard._order[i].length )
      var key = standard._order[i].substr( standard._order[i].lastIndexOf('.') + 1, standard._order[i].length )
      var item = standard[key];

      if (gradeRanges.maximum < item._min || gradeRanges.minimum > item._max) continue;
      links += '<p><a href="#'+linkNotation+'" rel="navlink">' + linkText + '</a></p>';
    }
    $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);

    // Inject the rest of the math standards
    var standard = jsonStandards.CCSS.Math.Content;

//    for (i in standard._order) { // This doesn't work in firefox, it gets them out of order.
//    for (var i = 0; i < Object.keys(standard._order).length; i++) {  // Nope, this wont work either the keys are not sequential
    for (var i = 0; i < 25; i++) {

      if (standard._order[i] == undefined) continue;

      var key = standard._order[i].substr( standard._order[i].lastIndexOf('.') + 1, standard._order[i].length )
      var item = standard[key];

      if (gradeRanges.maximum < item._min || gradeRanges.minimum > item._max) continue;

      var title = accordionTitle(item._text);
      var links = "";
      for (s in item) {
        if (s.charAt(0) == '_') continue;
        var linkText = (item[s]._text != undefined)?item[s]._text:s;
        links += '<p><a href="#CCSS.Math.Content.'+key+'.'+s+'" rel="navlink">' + linkText + '</a></p>';
      }

      $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);
    }

  }

  // Step through the accordion and hide those that are empty
  $('div.accordion div:empty').each(function() {
    $(this).prev().hide();
    $(this).hide();
  });

  // In the event of a redraw go ahead and refresh
  if ($(".accordion").hasClass('ui-accordion')) {
    $(".accordion").accordion("refresh");
  }

}

// Take the title and transform it into something pretty
function accordionTitle(string) {
  if (string.indexOf(':') != -1) {
    string = string.substr(0,string.indexOf(':')) + '<span>' + string.substr(string.indexOf(':'),string.length) + '</span>'
  } else if (string.indexOf(' ') != -1) {
    string = string.substr(0,string.indexOf(' ')) + '<span>' + string.substr(string.indexOf(' '),string.length) + '</span>'
  }
  return string;
}