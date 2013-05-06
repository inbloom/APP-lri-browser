
// This function fires off the search for each of the inline dotnotations as they are selected and asyncronously adds
// them to the list as they come in.  Complete with pagination, adding "searching" and removing
function loadInlineSearchResults(tmpDotNotation, page, limit) {

  var className = tmpDotNotation.replace(/\./g,"_");
  $('div.inlineResults._'+className).addClass('loading').removeClass('empty').empty();

  var query = '';
  var page = (page != undefined)?page:1;
  var limit = (limit != undefined)?limit:inlineSearchLimit;
  var offset = (page -1) * limit;

  // Set our page and limit on the div
  $('div.inlineResults._'+className).attr('data-page', page);
  $('div.inlineResults._'+className).attr('data-limit', limit);

  // This is a one up serialization hack that keeps us from writing the wrong search result
  var hack = parseInt($('div.inlineResults._'+className).attr('data-hack')) + 1;
  $('div.inlineResults._'+className).attr('data-hack', hack);

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
    data : { query : query, filters : filters, limit : limit, offset : offset, hack : hack},
    success : function(xhr) {
      var className = tmpDotNotation.replace(/\./g,"_");
      if (xhr.hack == $('div.inlineResults._'+className).attr('data-hack')) {
        parseInlineSearchResults(xhr.hits, tmpDotNotation);
      }
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
      var author = (props['author'] == undefined || props['author'][0] == undefined || props['author'][0]['properties'] == undefined)?'':props['author'][0]['properties'];
      var lrt = (props['learningResourceType'] == undefined)?[]:props['learningResourceType'];
      var eu = (props['educationalUse'] == undefined)?[]:props['educationalUse'];
      var ieur = (props['intendedEndUserRole'] == undefined)?[]:props['intendedEndUserRole'];

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

      if ($('div.inlineResults._'+className).length > 0) {

        var tmp = $('div.inlineResult.item.hidden').clone();
        $(tmp).removeClass('inlineResult');
        $(tmp).removeClass('hidden');
        $(tmp).css('background-image', 'url('+thumbnail+')');
        $(tmp).find('h4').html(props['name'][0]);
        $(tmp).attr('data-url', props.url[0]);
        $(tmp).click(function() {
          var url = $(this).attr('data-url');
          window.open("/browser/link?url=" + url, '_blank');
          return false;
        });

        $(tmp).find('a.info').click(function(e) {
          toggleSearchMask(true, true);
          showItemModal(e.target);
          return false;
        }).attr('data-item',JSON.stringify(props));

        if (author['name'] != undefined) {
          $(tmp).find('h5').html(author['name'][0]);
        }

        if ($.inArray('video', lrt) != -1) $(tmp).find('img.media').addClass('show');
        if ($.inArray('audio', lrt) != -1) $(tmp).find('img.media').addClass('show');
        if ($.inArray('on-line', lrt) != -1) $(tmp).find('img.media').addClass('show');
        if ($.inArray('reading', eu) != -1) $(tmp).find('img.reading').addClass('show');
        if ($.inArray('students', ieur) != -1) $(tmp).find('img.students').addClass('show');
        if ($.inArray('teachers', ieur) != -1) $(tmp).find('img.teachers').addClass('show');

        $(tmp).appendTo('div.inlineResults._'+className);

      }
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
    var tmpDotNotation = $(this).attr('class').replace('inlineResults','').replace('loading','').replace('empty','').replace(/^\s+_/,'').replace(/\s+$/,'').replace(/_/g,'.');
    loadInlineSearchResults(tmpDotNotation);
  });
}