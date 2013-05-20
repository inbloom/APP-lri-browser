
// Pop the modal for the target.. the data is stored on the target
function showItemModal(target) {
  var item = JSON.parse($(target).attr('data-item'));

  var thumbnail = '';
  if (item['thumbnailUrl'] != undefined) {
    thumbnail = item['thumbnailUrl'][0]
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

console.log(item);


  var lrt = (item['learningResourceType'] == undefined)?[]:item['learningResourceType'];
  var eu = (item['educationalUse'] == undefined)?[]:item['educationalUse'];
  var ieur = (item['intendedEndUserRole'] == undefined)?[]:item['intendedEndUserRole'];
  var author = (item['author'] == undefined || item['author'][0] == undefined || item['author'][0]['properties'] == undefined)?'':item['author'][0]['properties'];
  var description = (item['description'] == undefined)?'':item['description'][0];
  var dateCreated = (item['dateCreated'] == undefined)?'':item['dateCreated'][0];
  var alignments = (item['educationalAlignment'] == undefined?[]:item['educationalAlignment']);

  $('#itemModal').css('background-image', 'url('+thumbnail+')');
  $('#itemModal').find('h3').html(item['name'][0]);
  $('#itemModal').find('div.content').html(description);
  $('#itemModal').find('div.date').html(dateCreated);
  if (author['name'] != undefined) {
    $('#itemModal').find('h4').html(author['name'][0]);
  }
  $('#itemModal').find('div.standards ul').empty();
  for(a in alignments) {
    if (alignments[a].properties != undefined && alignments[a].properties.targetName[0] != undefined) {
      $('#itemModal').find('div.standards ul').append('<li>'+alignments[a].properties.targetName[0]+'</li>');
    }
  }

  if ($.inArray('Video', lrt) != -1) $('#itemModal').find('img.media').addClass('show');
  if ($.inArray('Audio', lrt) != -1) $('#itemModal').find('img.media').addClass('show');
  if ($.inArray('On-Line', lrt) != -1) $('#itemModal').find('img.media').addClass('show');
  if ($.inArray('Reading', eu) != -1) $('#itemModal').find('img.reading').addClass('show');
  if ($.inArray('Student', ieur) != -1) $('#itemModal').find('img.students').addClass('show');
  if ($.inArray('Teacher', ieur) != -1) $('#itemModal').find('img.teachers').addClass('show');

  $('#itemModal').find('a.go').attr('href', "/browser/link?url=" + item.url[0], '_blank');
  $('#itemModal').find('a.go').unbind().click(function(e) {
    window.open("/browser/link?url=" + item.url[0], '_blank');
    $('#itemModal').fadeOut();
    toggleSearchMask(false);
    return false;
  });

  $('#itemModal').find('a.link').attr('href', "/browser/link?url=" + item.url[0]);
  $('#itemModal').find('a.link').html((item.url[0].length > 45)?(item.url[0].substring(0,45)+'...'):item.url[0]);

  $('#itemModal').find('a.bookmark').attr('href', "/browser/link?url=" + item.url[0]);
  $('#itemModal').find('a.bookmark').attr('rel', item['name'][0]);
  $('#itemModal').find('a.bookmark').unbind().click(function(e) {
    pushParadata(
        'email',
        "http://browser.inbloom.org/browser/link?url=" + item.url[0]
    );
    alert('Please press CTRL-D to add bookmark');
    return false;
  });

  $('#itemModal').find('a.email').attr('href', "mailto:?subject=Shared Browser Resource&body=http://browser.inbloom.org/browser/link?url=" + item.url[0]);
  $('#itemModal').find('a.email').attr('target', '_blank');
  $('#itemModal').find('a.email').attr('rel', item['name'][0]);
  $('#itemModal').find('a.email').click(function(e) {

    pushParadata(
        'email',
        "http://browser.inbloom.org/browser/link?url=" + item.url[0]
    );
  });

  $('#itemModal').find('a.heart').attr('href', "/browser/link?url=" + item.url[0]);
  $('#itemModal').find('a.heart').attr('rel', item['name'][0]);
  $('#itemModal').find('a.heart').click(function(e) {

    pushParadata(
        'email',
        "http://browser.inbloom.org/browser/link?url=" + item.url[0]
    );
    // @todo: change heart color
    return false;
  });

  // METADATA

  var metadata = (item['publisher'] == undefined || item['publisher'][0] == undefined)?'':item['publisher'][0]['properties']['name'];
  if (metadata == '') {
    $('#itemModal').find('div.metadata li.publisher').hide();
  } else {
    $('#itemModal').find('div.metadata li.publisher').show().find('span').html(metadata);
  }

  // Language
  var metadata = (item['inLanguage'] == undefined)?'':item['inLanguage'];
  if (metadata == '') {
    $('#itemModal').find('div.metadata li.language').hide();
  } else {
    metadata = metadata.join(', ');
    metadata = metadata.replace(/en-US/g,'English');
    metadata = metadata.replace(/es-ES/g,'Spanish');
    $('#itemModal').find('div.metadata li.language').show().find('span').html(metadata);
  }

  updateMetadata('topic', item);
  updateMetadata('useRightsUrl', item);
  updateMetadata('isBasedOnUrl', item);
  updateMetadata('intendedEndUserRole', item);
  updateMetadata('typicalAgeRange', item);
  updateMetadata('educationalUse', item);
  updateMetadata('learningResourceType', item);
  updateMetadata('interactivityType', item);
  updateMetadata('mediaType', item);
  updateMetadata('groupType', item);

  $('#itemModal').find('div.metadata li.twisty')[0].click();

  $('#itemModal').fadeIn();
}

// Hide the modal
function hideItemModal() {
  $('#itemModal').fadeOut();
  toggleSearchMask(false);
  return false;
}

function updateMetadata(key, item) {
  var metadata = (item[key] == undefined)?'':item[key];
  if (metadata == '') {
    $('#itemModal').find('div.metadata li.'+key).hide();
  } else {
    $('#itemModal').find('div.metadata li.'+key).show().find('span').html(metadata.join(', '));
  }
}

