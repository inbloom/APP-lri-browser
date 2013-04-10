// Now set some stuff on ready
$(function() {
  // Some initial values
  gradeRanges = { 'minimum': 0, 'maximum': 12 }
  subject = 'ccssmath';
  inlineSearchLimit = 6;
  searchLimit = 12;

  // Some position helpers K-12 in the event the need to be different sizes
  // Minimum is the offset for the left slider position compared to actual
  // Maximum is the offset for the right slider position compared to actual
  // Leftboundary is used when moving either slider from left to right
  // Rightboundary is used when moving either slider from right to left
  loc_offsets = {
    0 : {'minimum':-27,'maximum':42, 'leftBoundary': 15, 'rightBoundary': 45},
    1 : {'minimum':-27,'maximum':42, 'leftBoundary': 45, 'rightBoundary': 75},
    2 : {'minimum':-27,'maximum':42, 'leftBoundary': 75, 'rightBoundary': 105},
    3 : {'minimum':-27,'maximum':42, 'leftBoundary': 105, 'rightBoundary': 135},
    4 : {'minimum':-27,'maximum':42, 'leftBoundary': 135, 'rightBoundary': 165},
    5 : {'minimum':-27,'maximum':42, 'leftBoundary': 165, 'rightBoundary': 195},
    6 : {'minimum':-27,'maximum':42, 'leftBoundary': 195, 'rightBoundary': 225},
    7 : {'minimum':-27,'maximum':42, 'leftBoundary': 225, 'rightBoundary': 255},
    8 : {'minimum':-27,'maximum':42, 'leftBoundary': 255, 'rightBoundary': 285},
    9 : {'minimum':-27,'maximum':42, 'leftBoundary': 285, 'rightBoundary': 315},
    10 : {'minimum':-27,'maximum':42, 'leftBoundary': 315, 'rightBoundary': 345},
    11 : {'minimum':-27,'maximum':42, 'leftBoundary': 345, 'rightBoundary': 375},
    12 : {'minimum':-27,'maximum':42, 'leftBoundary': 375, 'rightBoundary': 405}
  }

  // Now turn on the UI and set defaults
  setTimeout(function(){
    setGradeRange(gradeRanges);
    setGradeRange(gradeRanges);
    setSubject(subject, 0);
    // Build the accordion based on dynamic content (that's hard coded for the time being until we learn to get it from the lri)
    buildAccordionNavigation($('div.accordion._ccssmath'), 'ccssmath');
    buildAccordionNavigation($('div.accordion._ccsselaliteracy'), 'ccsselaliteracy');
    // Initialization of the accordion
    $(".accordion").accordion({
      heightStyle: 'content',
      animate: 'easeInOutCubic'
    });
  },500);

  // Make Left Handle Draggable
  $('div.slider-handle-left').draggable({
      axis: 'x',
      containment: 'parent',
      drag: function(event, ui) {
          var position = $(this).offset().left - ageRangeSlider.left;
          for (i in loc_offsets) {
              if (i > gradeRanges.maximum) continue;
              if (position < (loc_offsets[i].leftBoundary+10) && position > (loc_offsets[i].leftBoundary-10)) {
                  setGradeRange({'minimum':i});
              }
          }
      },
      stop: function(event, ui) {
          setGradeRange();
      }
  });

  // Make Right Handle Draggable
  $('div.slider-handle-right').draggable({
      axis: 'x',
      containment: 'parent',
      drag: function(event, ui) {
          var position = $(this).offset().left - ageRangeSlider.left;
          for (i in loc_offsets) {
              if (i < gradeRanges.minimum) continue;
              if (position < (loc_offsets[i].rightBoundary+10) && position > (loc_offsets[i].rightBoundary-10)) {
                  setGradeRange({'maximum':i});
              }
          }
      },
      stop: function(event, ui) {
          setGradeRange();
      }
  });

//    // Make subjects clickable So that it selects between them -- only one can be selected.
//    $('div.subjects li a').click(function(e) {
//        var a = $(e.target);
//        var li = a.parent();
//        if (li.hasClass('disabled')) return false;
//        setSubject(a.html());
//        return false;
//    });

  $(document).on('click', '#_ccssmath', function() {
    subject = 'ccssmath';
    setSubject(subject);
    return false;
  });
  $(document).on('click', '#_ccsselaliteracy', function() {
    subject = 'ccsselaliteracy';
    setSubject(subject);
    return false;
  });

  // filter checkboxes
  $(document).on('click', '#teachersCheckbox', function() {
    refreshInlineSearchResults();
  });
  $(document).on('click', '#studentsCheckbox', function() {
    refreshInlineSearchResults();
  });
  $(document).on('click', '#pagesCheckbox', function() {
    refreshInlineSearchResults();
  });
  $(document).on('click', '#mediaCheckbox', function() {
    refreshInlineSearchResults();
  });

  // Make form work via ajax post
  $(document).on('submit', '#superform', function() {
      var request = $.ajax({
          url: $(this).attr('action'),
          type: 'post',
          dataType: 'json'
      });
      request.done(function(xhr, status) {
          redrawSearchResults(xhr);
      });
      request.fail(function(xhr, status) {
          // TODO An actual modal with error messages and what not is needed!
          alert('Search Failed: ' + status);
      })
      return false;
  });

  // Pagination links onclick
  $(document).on('click', 'a.paginatorPage', function() {
    // get the dot notation and page
    var href = $(this).attr('href').replace('#','');
    var split = href.split('!');
    var tmpDotNotation = split[0];
    var tmpPage = split[1];
    loadInlineSearchResults(tmpDotNotation, tmpPage)
    return false;
  });

  /*
   * Live event for nav links
   *
   * This is the magic of the UI for the time being.  This on click method goes through and pulls the information out
   * of the standard json blog and updates the UI with the information it has.  If the information isn't there, i tcan't
   * use it obviously.
   *
   */

  $(document).on('click', 'a[rel=navlink]', function() {
      // Strip away the #
      var href = $(this).attr('href').replace('#','');
      // Split the href by dot since its a dotnotation
      var split = href.split('.');
      // Find our panel name (strip dashes)
      var panel = ('_' + split[0] + split[1]).toLowerCase().replace('-','');
      // Parent Notation -- Massage the dots into an array..ish
      var parent = '';
      for (i in split) {
          if (i == split.length-1) continue;
          parent += '["' + split[i] + '"]';
      }
      // Eval out the parent standard
      eval("var parentStandard = jsonStandards"+parent+";");
      // Clicked Notation -- Massage the dots into an array..ish
      var notation = '["'+href.replace(/\./g,'"]["')+'"]';
      // Eval out the standard
      eval("var standard = jsonStandards"+notation+";");

      // Remove active highlight from all of this panels links and add it to this one.
      $('div.panel.'+panel+' a[rel=navlink]').removeClass('active');
      $(this).addClass('active');

      // Update the Header information
      // Set the grade in the panel
      $('div.results.'+panel+' span.strand').html(parentStandard._text);
      // Set the domain in the panel
      $('div.results.'+panel+' span.domain').html(standard._text);

      /** Handle the panels differently based on which one it is.
       * Okay this sucks, but the irony is that the standards arent standardized so we have to handle them completely differently.
       *
       * CCSS.Math ~ Initiative.Framework.Set.Grade.Domain.Cluster.Standard.{Component}
       * CCSS.ELA ~ Initiative.Framework.{Set}.Domain.Grade.Standard.{Component}
       *
       * Initiative : The top level organization that a standar dcan belong to.
       * Framework : Essentially the subject
       * Set : Some subjects have subsets of content, optional in ELA and not used that I can tell.
       * Grade : Grade level
       * Domain : A grouping under each grade of the specific domain content
       * Cluster : A subgrouping in each domain of the underlying standards
       * Standard : The thing students are heald to
       * Component : A substandard that makes up the standards, optional but used in ELA a lot
       *
       * At this time, ELA doesn't have the notion of a cluster but really needs it.
       * See this mess for more information: http://www.corestandards.org/assets/identifiers_feedback_memo.pdf
       *
       */

      // An array of dot notations to dynamically load
      var dynamicLoad = [];

      // Handle CCSS.Math output
      if (panel == '_ccssmath') {
          // Update the standards information in the panel
          $('div.results.'+panel+' div.domains').empty();
          for (i in standard) {
              if (i.charAt(0) == '_') continue;
              for (t in standard[i]) {
                  if (t.charAt(0) == '_') continue;
                  var tmpStandardArrayLocation = notation+'["'+i+'"]["'+t+'"]';
                  var tmpDotNotation = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                  $('<a href="#'+tmpText+'">'+tmpDotNotation+'</a>').appendTo('div.results.'+panel+' div.domains');
              }
          }

          // Update the standards information
          $('div.results.'+panel+' div.content').empty();
          for (i in standard) {
              if (i.charAt(0) == '_') continue;
              var tmpTextContent = '';
              for (t in standard[i]) {
                  if (t == '_text') {
                    var tmpStandardArrayLocation = notation+'["'+i+'"]["'+t+'"]';
                    eval("var tmpStandard = jsonStandards"+tmpStandardArrayLocation+";");
                    tmpTextContent = '<h4>'+tmpStandard+'</h4><ul>' + tmpTextContent;
                  } else if (t.charAt(0) == '_') {
                    // Do nothing with these others
                  } else {
                      var tmpStandardArrayLocation = notation+'["'+i+'"]["'+t+'"]';
                      var tmpDotNotation = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                      var className = tmpDotNotation.replace(/\./g,"_");
                      dynamicLoad.push(tmpDotNotation);
                      eval("var tmpStandard = jsonStandards"+tmpStandardArrayLocation+"['_text'];");
                      tmpTextContent += '<li><strong>'+tmpDotNotation+'</strong>: ' + tmpStandard + '<div class="floater"><div class="inlineResults _'+className+'"></div></div></li>';
                  }
              }
              tmpTextContent += '</ul>';
              $('div.results.'+panel+' div.content').append(tmpTextContent);
          }
      }

      // Handle CCSS.ELA-Literacy output
      if (panel == '_ccsselaliteracy') {
          // Update the standards information in the panel
          $('div.results.'+panel+' div.domains').empty();
          for (t in standard) {
              if (t.charAt(0) == '_') continue;
              var tmpStandardArrayLocation = notation+'["'+t+'"]';
              var tmpText = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
              $('<a href="#'+tmpText+'">'+tmpText+'</a>').appendTo('div.results.'+panel+' div.domains');
          }

          //Update the standards information
          $('div.results.'+panel+' div.content').empty();
          var tmpTextContent = '<ul>';
          for (i in standard) {
              if (i.charAt(0) == '_') continue;
              var tmpStandardArrayLocation = notation+'["'+i+'"]';
              var tmpDotNotation = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
              eval("var tmpStandard = jsonStandards"+tmpStandardArrayLocation+"['_text'];");
              tmpTextContent += '<li><strong>'+tmpDotNotation+'</strong>: ' + tmpStandard + '</li>';

              for (t in standard[i]) {
                  if (t.charAt(0) == '_') continue;
                  var tmpStandardArrayLocation = notation+'["'+i+'"]["'+t+'"]';
                  var tmpDotNotation = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                  var className = tmpDotNotation.replace(/\./g,"_");
                  dynamicLoad.push(tmpDotNotation);
                  eval("var tmpStandard = jsonStandards"+tmpStandardArrayLocation+"['_text'];");
                  tmpTextContent += '<ul><li><strong>'+tmpDotNotation+'</strong>: ' + tmpStandard + '<div class="floater"><div class="inlineResults _'+className+'"></div></div></li></ul>';
              }

          }
          tmpTextContent += '</ul>';
          $('div.results.'+panel+' div.content').append(tmpTextContent);
      }

      // Fire off the dynamic loads
      for (i in dynamicLoad) {
          loadInlineSearchResults(dynamicLoad[i]);
      }

      return false;
  });

  // Add an event to the search text area on hitting return it submits
  $(document).on('keyup', '#form-search-filter', function(e) {
    if (e.keyCode == 13) {
      search($('#form-search-filter').val());
    }
  });

  // If user clicks the X in the search bar or the blue X clear the search
  $(document).on('click', 'div.panel._search button.close', function(e) {
    toggleSearchPanel(false);
    return false;
  });
  $(document).on('click', '#superform div.search button', function(e) {
    toggleSearchPanel(false);
    return false;
  });

  // If user clicks the facets button then show them or hide them
  $(document).on('click', 'div.panel._search button.facets', function(e) {
    toggleSearchFilters();
    return false;
  });
  $(document).on('click', 'div.panel._search button.close-facets', function(e) {
    toggleSearchFilters();
    return false;
  });

  // Set onresize handlers
  $(window).resize(function() {
    setSubject(subject,0);
    setGradeRange(gradeRanges);
    if ($(".accordion").hasClass('ui-accordion')) {
      $(".accordion").accordion("refresh");
    }
  });
});

// Set grade range and the slider
function setGradeRange(ranges) {
    // Allow some or all arguments to be blank
    if (ranges == undefined) ranges = gradeRanges;
    if (ranges.minimum == undefined) ranges.minimum = gradeRanges.minimum;
    if (ranges.maximum == undefined) ranges.maximum = gradeRanges.maximum;
    // Parse to make sure they are ints
    ranges.minimum = parseInt(ranges.minimum);
    ranges.maximum = parseInt(ranges.maximum);
    // Some useful slider information that doesn't change (but could based on browser resize)
    ageRangeSlider = {
        'left' : Math.ceil($('li._0').offset().left + loc_offsets[0].minimum),
        'right' : Math.ceil($('li._12').offset().left + loc_offsets[12].maximum)
    };
    // First set the ranges
    $('div.grade li').removeClass('selected');
    for (i=ranges.minimum;i<=ranges.maximum;i++) {
        $('li._'+i).addClass('selected');
    }
    // Set ranges back to variable
    gradeRanges = ranges;
    // Set them to the form
    $('#form-grade-minimum').attr('value', ranges.minimum);
    $('#form-grade-maximum').attr('value', ranges.maximum);
    // Now position the sliders
    // Some helpers to set width
    var slider_left = Math.ceil($('li._'+ranges.minimum).offset().left + loc_offsets[ranges.minimum].minimum);
    var slider_right = Math.ceil(($('li._'+ranges.maximum).offset().left - slider_left) + loc_offsets[ranges.maximum].maximum);
    // Set the handles locations
    $('.slider-handle-left').offset({ 'left': slider_left + 6 }).html((ranges.minimum == 0)?'K':ranges.minimum).show();
    $('.slider-handle-right').offset({ 'left': slider_right + slider_left - 26 }).html((ranges.maximum == 0)?'K':ranges.maximum).show();
}

// Set the subject and move the cursor accordingly
function setSubject(subject, rate) {
  if (rate == undefined) rate = 500;
  $('div.subjects button').removeClass('selected');
  $('div.subjects button#_'+subject).addClass('selected');
  $('#form-subject').attr('value', subject);

  // different behavior based on if we are searching or not
  if (!$('div.panel._search').is(':visible')) {
    // Transition old panel off
    if (subject == 'ccssmath') {
        $('div.panel._ccsselaliteracy').stop().animate({left:$(document).width()},rate,'easeInOutCubic',function() { });
        $('div.panel._ccssmath').show().animate({left:0},rate,'easeInOutCubic');
        $('div.panel._search').stop().hide();
    } else if (subject == 'ccsselaliteracy') {
        $('div.panel._ccsselaliteracy').show().animate({left:0},rate,'easeInOutCubic');
        $('div.panel._ccssmath').stop().animate({left:-$(document).width()},rate,'easeInOutCubic',function() { });
        $('div.panel._search').stop().hide();
    }
  } else {
    // @TODO Refire the search cause they just changed subject while search was showing
  }
}

// Toggle the visibility of the search panel, OR show/hide it based on bool
function toggleSearchPanel(bool) {
  if (bool == undefined) {
    if ($('div.panel._search').is(':visible')) {
      $('div.panel').stop().hide();
      $("#form-search-filter").val('');
      $('header div.search button').hide();
      setSubject(subject,0);
    } else {
      $('div.panel').stop().hide();
      $('div.panel._search').stop().show();
      $('header div.search button').show();
    }
  } else {
    if (bool) {
      $('div.panel').stop().hide();
      $('div.panel._search').stop().show();
      $('header div.search button').show();
    } else {
      $('div.panel').stop().hide();
      $("#form-search-filter").val('');
      $('header div.search button').hide();
      setSubject(subject,0);
    }
  }
}

// Toggle the visibility of the search mask, OR show/hide it based on bool
function toggleSearchMask(bool) {
  if (bool == undefined) {
    if ($('div.searching-mask').is(':visible')) {
      $('div.searching-mask').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    } else {
      $('div.searching-mask').stop().css({opacity:0}).show().animate({opacity:0.8},500,'easeInOutCubic',function() { });
    }
  } else {
    if (bool) {
      $('div.searching-mask').stop().css({opacity:0}).show().animate({opacity:0.8},500,'easeInOutCubic',function() { });
    } else {
      $('div.searching-mask').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    }
  }
}

function toggleSearchFilters() {
  if($('div._facets').is(':visible')) {
    $('button.close-facets').stop().animate({left:-46},500,'easeInOutCubic',function() { $(this).hide(); });
    $('div._facets').stop().animate({left:-220},500,'easeInOutCubic',function() { $(this).hide(); });
    $('div.results._search').stop().css({left:245}).show().animate({left:20},500,'easeInOutCubic',function() { });
  } else {
    $('button.close-facets').stop().css({left:-46}).show().animate({left:184},500,'easeInOutCubic',function() { });
    $('div._facets').stop().css({left:-220}).show().animate({left:0},500,'easeInOutCubic',function() { });
    $('div.results._search').stop().css({left:20}).show().animate({left:245},500,'easeInOutCubic',function() { });
  }
}

// Here we redraw the search results panel from an xhr.
function renderSearchResults(res) {
  // clear the panel
  $('div.panel._search div.results').empty();

  var items = res.hits;

  for (i in items) {
    if (items[i] == undefined) continue;
    var props = items[i]['_source']['properties'];
    var thumbnail = (props['thumbnailUrl'] != undefined)?props['thumbnailUrl'][0]:'';
    if (thumbnail == '') {
      // Figure out which default image to use based on order
      if ($("#teachersCheckbox").prop('checked')) {
        thumbnail = '/assets/default-image-teacher.png';
      } else if ($("#studentsCheckbox").prop('checked')) {
        thumbnail = '/assets/default-image-students.png';
      } else if ($("#mediaCheckbox").prop('checked')) {
        thumbnail = '/assets/default-image-av.png';
      } else if ($("#pagesCheckbox").prop('checked')) {
        thumbnail = '/assets/default-image-reading.png';
      } else {
        thumbnail = '/assets/default-image-all.png';
      }
    }

    var tmp = $('div.item.hidden').clone();
    $(tmp).removeClass('hidden');
//console.log(thumbnail);
    $(tmp).css('background-image', 'url('+thumbnail+')');
    $(tmp).find('h3').html(props['name'][0]);

    $(tmp).appendTo('div.panel._search div.results');


//        if (items[i] == undefined) continue;
//        var tmp = $('div.item.hidden').clone();
//        $(tmp).attr('data-itemid', items[i]['id']);
//        $(tmp).find('img.thumb').attr('src',items[i]['img']);
//        $(tmp).find('h3').attr('title',items[i]['title']).html(truncateString(items[i]['title'],13));
//        $(tmp).find('h4').html(items[i]['provider']);
//        $(tmp).removeClass('hidden');
//        $(tmp).appendTo('div.results');
  }

//    <div class='item'>
//        <div class='inner'>
//            <img src='/assets/tmp-2.png' />
//            <div>
//                <h3>Chemistry Video</h3>
//                <h4>Provider Name</h4>
//                <hr />
//                <img src='/assets/popularity-pill-on.png' /><img src='/assets/popularity-pill-off.png' /><img src='/assets/popularity-pill-off.png' />
//            </div>
//        </div>
//    </div>

//    console.log(items);
}

// Helper function to truncate the title
function truncateString(string, length) {
  if (string.length <= length + 1) return string;
  return string.substring(0, length-2) + '&hellip;'
}

// Build out the accordion navigation based on which standard
function buildAccordionNavigation(div, req) {

  // Create navigation for CCSS.ELA-Literacy
  if (req == 'ccsselaliteracy') {
    var standard = jsonStandards.CCSS['ELA-Literacy'];
    for (i in standard) {
      if (i.charAt(0) == '_') continue;

      var title = accordionTitle(standard[i]._text);
      var links = "";
      for (s in standard[i]) {
        if (s.charAt(0) == '_') continue;
        var linkText = (standard[i][s]._text != undefined)?standard[i][s]._text:s;
        links += '<p><a href="#CCSS.ELA-Literacy.'+i+'.'+s+'" rel="navlink">' + linkText + '</a></p>';
      }

      $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);
    }

  // Create navigation for CCSS.Math
  } else if (req == 'ccssmath') {

    var standard = jsonStandards.CCSS.Math.Practice;
    var title = accordionTitle(standard._text);
    var linkText = (standard._text != undefined)?standard._text:'undefined';
    var links = '<p><a href="#CCSS.Math.Practice" rel="navlink">' + linkText + '</a></p>';
    $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);

    var standard = jsonStandards.CCSS.Math.Content;



    for (i in standard) {
      if (i.charAt(0) == '_') continue;
      var title = accordionTitle(standard[i]._text);

      var links = "";
      for (s in standard[i]) {
        if (s.charAt(0) == '_') continue;
        var linkText = (standard[i][s]._text != undefined)?standard[i][s]._text:s;
        links += '<p><a href="#CCSS.Math.Content.'+i+'.'+s+'" rel="navlink">' + linkText + '</a></p>';
      }

      $('<h3>' + title + '</h3><div>' + links + '</div>').appendTo(div);
    }

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

// This function fires off the search for each of the inline dotnotations as they are selected and asyncronously adds
// them to the list as they come in.  Complete with pagination, adding "searching" and removing
function loadInlineSearchResults(tmpDotNotation, page, limit) {

  var className = tmpDotNotation.replace(/\./g,"_");
  $('div.inlineResults._'+className).addClass('loading').removeClass('empty').empty();

  // @TODO CHANGE TO FRACTIONS TO GET RESULTS and comment out the first filter below
  var query = '';
  var page = (page != undefined)?page:1;
  var limit = (limit != undefined)?limit:inlineSearchLimit;
  var offset = (page -1) * limit;

  // Set our page and limit on the div
  $('div.inlineResults._'+className).attr('data-page', page);
  $('div.inlineResults._'+className).attr('data-limit', limit);

  var filters = {};
  // Add the filter for this dot notation
    filters['properties.educationalAlignment.properties.targetName['+tmpDotNotation+ ']'] = true;
  // If "Audio / Video / Interactive" is checked add those filters
  if ($("#mediaCheckbox").prop('checked')) {
    filters['properties.learningResourceType[On-Line]'] = true;
    filters['properties.learningResourceType[Audio]'] = true;
    filters['properties.learningResourceType[Video]'] = true;
  }
  // If "Reading & Web Pages" is checked add those filters
  if ($("#pagesCheckbox").prop('checked')) {
    filters['properties.educationalUse[Reading]'] = true;
  }
  // If "For Students" is checked add those filters
  if ($("#studentsCheckbox").prop('checked')) {
    filters['properties.intendedEndUserRole[Student]'] = true;
  }
  // If "For Teachers" is checked add those filters
  if ($("#teachersCheckbox").prop('checked')) {
    filters['properties.intendedEndUserRole[Teacher]'] = true;
  }

  $.ajax({
    type : "POST",
    dataType : 'json',
    url  : "/browser/search",
    data : { query : query, filters : filters, limit : limit, offset : offset },
    success : function(xhr) {
      parseInlineSearchResults(xhr.hits, tmpDotNotation);
    },
    error : function(xhr, txtStatus, errThrown) {
      var className = tmpDotNotation.replace(/\./g,"_");
      $('div.inlineResults._'+className).removeClass('loading');
      $('div.inlineResults._'+className).addClass('error');
      // @TODO Add a refresh link or something..
    }
  });

}

// Parse out the results by drawing the various bitz
function parseInlineSearchResults(results, tmpDotNotation) {
  var className = tmpDotNotation.replace(/\./g,"_");
  $('div.inlineResults._'+className).removeClass('loading');

  // Set our page and limit from the div
  var page = $('div.inlineResults._'+className).attr('data-page');
  var limit = $('div.inlineResults._'+className).attr('data-limit');

  if (results.hits.length == 0) {
    $('div.inlineResults._'+className).addClass('empty');
  } else {
    for(i in results.hits) {
      var props = results.hits[i]['_source']['properties'];
      var thumbnail = '';
      if (props['thumbnailUrl'] != undefined) {
        thumbnail = props['thumbnailUrl'][0]
      } else {

        // Figure out which default image to use based on order
        if ($("#teachersCheckbox").prop('checked')) {
          thumbnail = '/assets/default-image-teacher.png';
        } else if ($("#studentsCheckbox").prop('checked')) {
          thumbnail = '/assets/default-image-students.png';
        } else if ($("#mediaCheckbox").prop('checked')) {
          thumbnail = '/assets/default-image-av.png';
        } else if ($("#pagesCheckbox").prop('checked')) {
          thumbnail = '/assets/default-image-reading.png';
        } else {
          thumbnail = '/assets/default-image-all.png';
        }

      }

      $('<div class="item" style="background-image: url('+thumbnail+');"><div class="content"><h4>' + props['name'][0] + '</h4><h5>Provider Organization</h5></div></div>').appendTo('div.inlineResults._'+className);
    }
    var pagination = '<div class="pagination">';
    pagination += '<a href="#'+tmpDotNotation+'!'+1+'" class="paginatorPage symbol'+((page == 1)?' disabled':'')+'">\u00ab</a>';
    var numPages = Math.ceil(results.total / inlineSearchLimit);
    for (var i = 1; i <= numPages; i++) {
      if (page > 5 && i == 1) {
        pagination += '<a href="#'+tmpDotNotation+'!'+i+'" class="paginatorPage'+((page == i)?' active':'')+'">' + i + '</a> ... ';
      }
      if ((i - 5) < page && (i + 5) > page) {
        pagination += '<a href="#'+tmpDotNotation+'!'+i+'" class="paginatorPage'+((page == i)?' active':'')+'">' + i + '</a>';
      }
      if (page < (numPages - 5) && i == numPages) {
        pagination += ' ... <a href="#'+tmpDotNotation+'!'+i+'" class="paginatorPage'+((page == i)?' active':'')+'">' + i + '</a>';
      }
    }
    pagination += '<a href="#'+tmpDotNotation+'!'+numPages+'" class="paginatorPage symbol'+((page == numPages)?' disabled':'')+'">\u00bb</a>';
    pagination += '</div>'
    $(pagination).appendTo('div.inlineResults._'+className);
  }
}

// Steps through inlineResults and refreshes them based on the class
function refreshInlineSearchResults() {
  $("div.inlineResults").each(function() {
    var tmpDotNotation = $(this).attr('class').replace('inlineResults','').replace('loading','').replace('empty','').replace(/^\s+_/,'').replace(/\s+$/,'').replace('_','.');
    loadInlineSearchResults(tmpDotNotation);
  });
}

// Primary search. Works a lot like inline search but allows the main filter to be defined and doesn't restrict by dotnotation
function search(query, page, limit) {
  if (query == undefined) return;
  var query = query.replace(/^\s+/,'').replace(/\s+$/,'');
  var page = (page != undefined)?page:1;
  var limit = (limit != undefined)?limit:searchLimit;
  var offset = (page -1) * limit;
  // don't allow empty searches
  if (query == '') return;
  // Show the searching mask and panel
  toggleSearchPanel(true);
  toggleSearchMask(true);
  // build our filters
  var filters = {};
  // If "Audio / Video / Interactive" is checked add those filters
  if ($("#mediaCheckbox").prop('checked')) {
    filters['properties.learningResourceType[On-Line]'] = true;
    filters['properties.learningResourceType[Audio]'] = true;
    filters['properties.learningResourceType[Video]'] = true;
  }
  // If "Reading & Web Pages" is checked add those filters
  if ($("#pagesCheckbox").prop('checked')) {
    filters['properties.educationalUse[Reading]'] = true;
  }
  // If "For Students" is checked add those filters
  if ($("#studentsCheckbox").prop('checked')) {
    filters['properties.intendedEndUserRole[Student]'] = true;
  }
  // If "For Teachers" is checked add those filters
  if ($("#teachersCheckbox").prop('checked')) {
    filters['properties.intendedEndUserRole[Teacher]'] = true;
  }
  // POST!
  $.ajax({
    type : "POST",
    dataType : 'json',
    url  : "/browser/search",
    data : { query : query, filters : filters, limit : limit, offset : offset },
    success : function(xhr) {
      toggleSearchMask(false);
      renderSearchResults(xhr.hits);
    },
    error : function(xhr, txtStatus, errThrown) {
      var className = tmpDotNotation.replace(/\./g,"_");
      $('div.inlineResults._'+className).removeClass('loading');
      $('div.inlineResults._'+className).addClass('error');
      // @TODO Add a refresh link or something..
    }
  });

  // if txt is not empty
  // show searching pop over
  // initiate search agax

}