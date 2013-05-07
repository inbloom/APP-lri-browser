
// Here we redraw the search results panel from an xhr.
function renderSearchResults(res, clear) {
  // clear the panel
  if (clear) {
    $('div.panel._search div.results').empty();
    searchOffset = 0;
    searchPage = 1;
  }

  var items = res.hits;

  for (i in items) {
    if (items[i] == undefined) continue;
    var props = items[i]['_source']['properties'];
    var author = (props['author'] == undefined || props['author'][0] == undefined || props['author'][0]['properties'] == undefined)?'':props['author'][0]['properties'];
    var description = (props['description'] == undefined)?'':props['description'][0];
    var dateCreated = (props['dateCreated'] == undefined)?'':props['dateCreated'][0];

    var lrt = (props['learningResourceType'] == undefined)?[]:props['learningResourceType'];
    var eu = (props['educationalUse'] == undefined)?[]:props['educationalUse'];
    var ieur = (props['intendedEndUserRole'] == undefined)?[]:props['intendedEndUserRole'];

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

    var tmp = $('div.searchResult.item.hidden').clone();
    $(tmp).removeClass('searchResult');
    $(tmp).removeClass('hidden');
    $(tmp).css('background-image', 'url('+thumbnail+')');
    $(tmp).find('h3').html(props['name'][0]);
    $(tmp).attr('data-url', props.url[0]);
    $(tmp).click(function(e) {
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
      $(tmp).find('h4').html(author['name'][0]);
    }
    $(tmp).find('div.content').html(description);
    $(tmp).find('div.date').html(dateCreated);

    if ($.inArray('Video', lrt) != -1) $(tmp).find('img.media').addClass('show');
    if ($.inArray('Audio', lrt) != -1) $(tmp).find('img.media').addClass('show');
    if ($.inArray('On-Line', lrt) != -1) $(tmp).find('img.media').addClass('show');
    if ($.inArray('Reading', eu) != -1) $(tmp).find('img.reading').addClass('show');
    if ($.inArray('Student', ieur) != -1) $(tmp).find('img.students').addClass('show');
    if ($.inArray('Teacher', ieur) != -1) $(tmp).find('img.teachers').addClass('show');

    $(tmp).appendTo('div.panel._search div.results');
  }

  adjustItemMargins();
}

// If search is showing, refresh it.
function refreshSearchResults() {
  if ($('div.panel._search').is(':visible')) {
    search($('#form-search-filter').val(), 1, 24);
  }
}

