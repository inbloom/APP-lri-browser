// Now set some stuff on ready
$(function() {
  // Some initial global values
  gradeRanges = { 'minimum': 0, 'maximum': 12 }
  subject = 'ccssmath';
  inlineSearchLimit = 6;
  searchQuery = '';
  searchFilters = [];
  searchOffset = 0;
  searchLimit = 24;
  searchPage = 1;

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

  // @TODO Remove this and add a function callback to the build Accordion Navigation method to correctly set the first option as desired by client
  setTimeout(function() {
    // Trigger the first element as clicked
    $('._ccssmath.panel h3')[0].click();
    $('._ccssmath.panel a')[0].click();
    $('._ccsselaliteracy.panel h3')[0].click();
    $('._ccsselaliteracy.panel a')[0].click();
  }, 1000);

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
        // Now redraw the left navigation based on the grades allowed
        buildAccordionNavigation($('div.accordion._ccssmath'), 'ccssmath');
        buildAccordionNavigation($('div.accordion._ccsselaliteracy'), 'ccsselaliteracy');
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
        // Now redraw the left navigation based on the grades allowed
        buildAccordionNavigation($('div.accordion._ccssmath'), 'ccssmath');
        buildAccordionNavigation($('div.accordion._ccsselaliteracy'), 'ccsselaliteracy');
      }
  });

  // On click for the mathematics button
  $('#_ccssmath').on('click', function(e) {
    subject = 'ccssmath';
    if ($('div._search').is(':visible')) toggleSearchPanel(false);
    setSubject(subject);
    return false;
  });
  // On click for the language arts button
  $('#_ccsselaliteracy').on('click', function(e) {
    subject = 'ccsselaliteracy';
    if ($('div._search').is(':visible')) toggleSearchPanel(false);
    setSubject(subject);
    return false;
  });

  // Primary filter checkboxes on clicks
  // Refresh the inline results (which might be off screen)
  // and refresh the search results (which will only refresh in visible)
  $('#teachersCheckbox').on('click', function(e) {
    $('#teachersSecondaryCheckbox').prop('checked', e.target.checked);
    refreshInlineSearchResults();
    refreshSearchResults();
  });
  $('#studentsCheckbox').on('click', function(e) {
    $('#studentsSecondaryCheckbox').prop('checked', e.target.checked);
    refreshInlineSearchResults();
    refreshSearchResults();
  });
  $('#pagesCheckbox').on('click', function(e) {
    $('#readingSecondaryCheckbox').prop('checked', e.target.checked);
    refreshInlineSearchResults();
    refreshSearchResults();
  });
  $('#mediaCheckbox').on('click', function(e) {
    $('#audioSecondaryCheckbox').prop('checked', e.target.checked);
    $('#videoSecondaryCheckbox').prop('checked', e.target.checked);
    $('#onlineSecondaryCheckbox').prop('checked', e.target.checked);
    refreshInlineSearchResults();
    refreshSearchResults();
  });

  // Fade out the notification
  $('div.alert-notification a.close').click( function() {
    $('div.alert-notification').fadeOut();
  });

  // Secondary filter checkboxes on clicks
  $('input.secondaryCheckbox').on('click', function(e) {
    refreshSearchResults();

    // If a primary should be unchecked, then do it
    if ($('#audioSecondaryCheckbox').prop('checked') &&
        $('#onlineSecondaryCheckbox').prop('checked') &&
        $('#videoSecondaryCheckbox').prop('checked')) {
      $('#mediaCheckbox').prop('checked', true);
    } else {
      $('#mediaCheckbox').prop('checked', false);
    }
    $('#pagesCheckbox').prop('checked', $('#readingSecondaryCheckbox').prop('checked'));
    $('#studentsCheckbox').prop('checked', $('#studentsSecondaryCheckbox').prop('checked'));
    $('#teachersCheckbox').prop('checked', $('#teachersSecondaryCheckbox').prop('checked'));
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
    // Keep the dot notation version
    var dotNotation = href;
    var parentDotNotation = dotNotation.substr( 0, dotNotation.lastIndexOf('.'));
    // Clicked Notation -- Massage the dots into an array..ish
    var notation = '["'+href.replace(/\./g,'"]["')+'"]';
    // Eval out the standard
    eval("var standard = jsonStandards"+notation+";");

    // Remove active highlight from all of this panels links and add it to this one.
    $('div.panel.'+panel+' a[rel=navlink]').removeClass('active');
    $(this).addClass('active');

    // Update the Header information
    // Set the grade in the panel
    if (parentStandard._text) {
      $('div.results.'+panel+' span.strand').html(parentStandard._text).show().prev().show();
    } else {
      $('div.results.'+panel+' span.strand').html("").hide().prev().hide();
    }
    // Set the domain in the panel
    if (standard._text) {
      $('div.results.'+panel+' span.domain').html(standard._text).show().prev().show();
    } else {
      $('div.results.'+panel+' span.domain').html("").hide().prev().hide();
    }

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
      $('div.results.'+panel+' div.domains').removeClass('hidden');
      $('div.results.'+panel+' h5').removeClass('hidden');
      $('div.results.'+panel+' hr').removeClass('hidden');

      // Update the standards information
      $('div.results.'+panel+' div.content').empty();
      // Math.Practice behaves differently than the rest of math.. of course..
      if (parentDotNotation == 'CCSS.Math.Practice') {
        $('div.results.'+panel+' span.domain').html(dotNotation).show().prev().show();
        $('<a href="#'+dotNotation+'">'+dotNotation+'</a>').appendTo('div.results.'+panel+' div.domains');

        var className = dotNotation.replace(/\./g,"_");
        var tmpTextContent = '<ul><li><strong>'+dotNotation+'</strong>: ' + standard._text + '<div class="floater"><div class="inlineResults _'+className+'" data-hack="0"></div></div></li></ul>';
        $('div.results.'+panel+' div.content').append(tmpTextContent);
        dynamicLoad.push(dotNotation);

      } else {
        for (i in standard) {
          if (i.charAt(0) == '_') continue;
          for (t in standard[i]) {
            if (t.charAt(0) == '_') continue;
            var tmpStandardArrayLocation = notation+'["'+i+'"]["'+t+'"]';
            var tmpDotNotation = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
            $('<a href="#'+tmpText+'">'+tmpDotNotation+'</a>').appendTo('div.results.'+panel+' div.domains');
          }
        }

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
              tmpTextContent += '<li><strong>'+tmpDotNotation+'</strong>: ' + tmpStandard + '<div class="floater"><div class="inlineResults _'+className+'" data-hack="0"></div></div></li>';
            }
          }
          tmpTextContent += '</ul>';
          $('div.results.'+panel+' div.content').append(tmpTextContent);
        }

      }
      if ($('div.results.'+panel+' div.domains').is(':empty')) {
        $('div.results.'+panel+' div.domains').addClass('hidden');
        $('div.results.'+panel+' h5').addClass('hidden');
        $('div.results.'+panel+' hr:first-of-type').addClass('hidden');
      }

    }

    // Handle CCSS.ELA-Literacy output
    if (panel == '_ccsselaliteracy') {
      // Update the standards information in the panel
      $('div.results.'+panel+' div.domains').empty();
      $('div.results.'+panel+' div.domains').removeClass('hidden');
      $('div.results.'+panel+' h5').removeClass('hidden');
      $('div.results.'+panel+' hr').removeClass('hidden');
      for (t in standard) {
          if (t.charAt(0) == '_') continue;
          var tmpStandardArrayLocation = notation+'["'+t+'"]';
          var tmpText = tmpStandardArrayLocation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
          $('<a href="#'+tmpText+'">'+tmpText+'</a>').appendTo('div.results.'+panel+' div.domains');
      }
      if ($('div.results.'+panel+' div.domains').is(':empty')) {
        $('div.results.'+panel+' div.domains').addClass('hidden');
        $('div.results.'+panel+' h5').addClass('hidden');
        $('div.results.'+panel+' hr:first-of-type').addClass('hidden');
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
          tmpTextContent += '<ul><li><strong>'+tmpDotNotation+'</strong>: ' + tmpStandard + '<div class="floater"><div class="inlineResults _'+className+'" data-hack="0"></div></div></li></ul>';
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
  $('#form-search-filter').on('keydown', function(e) {
    if (e.keyCode == 13) {
      search($('#form-search-filter').val());
      return false;
    }
  });

  // If user clicks the X in the search bar or the blue X clear the search
  $('div.panel._search button.close').on('click', function(e) {
    toggleSearchPanel(false);
    return false;
  });
  $('#superform div.search button').on('click', function(e) {
    toggleSearchPanel(false);
    return false;
  });

  // If user clicks the facets button then show them or hide them
  $('div.panel._search button.facets').on('click', function(e) {
    toggleSearchFilters();
    return false;
  });
  $('div.panel._search button.close-facets').on('click', function(e) {
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
    adjustItemMargins();
  });

  // scroll to bottom firing of the search
  searching = false;
  $('section.bottom').scroll(function(e) {
    if ($('._search.panel').is(':visible')) {
      if (!searching && $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        searchOffset = (searchOffset > 0) ? searchOffset : 1;
        searchPage++;
        toggleSearchSpinner(true);
        searching = true;
        $.ajax({
          type : "POST",
          dataType : 'json',
          url  : "/browser/search",
          data : { query : searchQuery, filters : searchFilters, limit : searchLimit, offset : (searchLimit * searchPage)-1 },
          success : function(xhr) {
            searching = false;
            toggleSearchSpinner(false);
            renderSearchResults(xhr.hits, false);
          },
          error : function(xhr, txtStatus, errThrown) {
            searching = false;
            // @TODO what do we do here if something just fails
          }
        });
      }
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
      $('div.slider-mask').hide();
      setSubject(subject,0);
    } else {
      $('div.panel').stop().hide();
      $('div.panel._search').stop().show();
      $('header div.search button').show();
      $('div.slider-mask').show();
    }
  } else {
    if (bool) {
      $('div.panel').stop().hide();
      $('div.panel._search').stop().show();
      $('header div.search button').show();
      $('div.slider-mask').show();
    } else {
      $('div.panel').stop().hide();
      $("#form-search-filter").val('');
      $('header div.search button').hide();
      $('div.slider-mask').hide();
      setSubject(subject,0);
    }
  }
}

// Toggle the visibility of the search mask, OR show/hide it based on bool
// If you flag it as a modal then it will be a dark overlay and wont clear the search pane
function toggleSearchMask(bool,modal) {
  if (modal == undefined) modal == false;
  if (!modal) {
    $('div.searching-mask').unbind();
    $('div.searching-mask').css('background','#fff');
  } else {
    $('div.searching-mask').unbind().click(function() { hideItemModal(); });
    $('div.searching-mask').css('background','#000');
  }

  if (bool == undefined) {
    if ($('div.searching-mask').is(':visible')) {
      $('div.searching-mask').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    } else {
      $('div.searching-mask').stop().css({opacity:0}).show().animate({opacity:0.8},500,'easeInOutCubic',function() {
        if (!modal) {
          $('div.panel._search div.results').empty();
        }
      });
    }
  } else {
    if (bool) {
      $('div.searching-mask').stop().css({opacity:0}).show().animate({opacity:0.8},500,'easeInOutCubic',function() {
        if (!modal) {
          $('div.panel._search div.results').empty();
        }
      });
    } else {
      $('div.searching-mask').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    }
  }
}

// Toggle the visibility of the search spinner, OR show/hide it based on bool
function toggleSearchSpinner(bool) {
  if (bool == undefined) {
    if ($('div.spinner').is(':visible')) {
      $('div.spinner').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    } else {
      $('div.spinner').stop().css({opacity:0}).show().animate({opacity:1},500,'easeInOutCubic',function() { });
    }
  } else {
    if (bool) {
      $('div.spinner').stop().css({opacity:0}).show().animate({opacity:1},500,'easeInOutCubic',function() { });
    } else {
      $('div.spinner').stop().animate({opacity:0},500,'easeInOutCubic',function() { $(this).hide(); });
    }
  }
}

// Toggle the search filters in/out
function toggleSearchFilters() {
  if($('div._facets').is(':visible')) {
    $('button.close-facets').stop().animate({left:-46},500,'easeInOutCubic',function() { $(this).hide(); });
    $('div._facets').stop().animate({left:-220},500,'easeInOutCubic',function() { $(this).hide(); });
    $('div.results._search').stop().css({left:245}).show().animate({left:20},500,'easeInOutCubic',function() {
      adjustItemMargins();
    });
  } else {
    $('button.close-facets').stop().css({left:-46}).show().animate({left:184},500,'easeInOutCubic',function() { });
    $('div._facets').stop().css({left:-220}).show().animate({left:0},500,'easeInOutCubic',function() { });
    $('div.results._search').stop().css({left:20}).show().animate({left:245},500,'easeInOutCubic',function() {
      adjustItemMargins();
    });
  }
}


// Helper function to truncate the title
function truncateString(string, length) {
  if (string.length <= length + 1) return string;
  return string.substring(0, length-2) + '&hellip;'
}




