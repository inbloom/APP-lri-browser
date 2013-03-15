// Now set some stuff on ready
$(function() {
    // Some initial values
    gradeRanges = { 'minimum': 0, 'maximum': 12 }
    subject = 'mathmatics';
    
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
        setSubject(subject);
    },250);

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

    // Make subjects clickable So that it selects between them -- only one can be selected.
    $('div.subjects li a').click(function(e) {
        var a = $(e.target);
        var li = a.parent();
        if (li.hasClass('disabled')) return false;
        setSubject(a.html());
        return false;
    });

    // Initialization of the accordion
    $("#accordion").accordion({
        heightStyle:"fill",
        animate: "easeInOutCubic"
    });

    $(document).on('click', '#_mathmatics', function() {
        subject = 'mathmatics';
        setSubject(subject);
        return false;
    });
    $(document).on('click', '#_languagearts', function() {
        subject = 'languagearts';
        setSubject(subject);
        return false;
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

    // Set onresize handlers
    $(window).resize(function() {
        setGradeRange(gradeRanges);
        $("#accordion").accordion("refresh");
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
function setSubject(subject) {
    $('div.subjects button').removeClass('selected');
    $('div.subjects button#_'+subject).addClass('selected');
    $('#form-subject').attr('value', subject);

    // Transition old panel off

    $('div.panel._'+subject).show();
}


// Here we redraw the search results panel from an xhr.
function redrawSearchResults(res) {
    // clear the panel
    $('div.results').empty();
    var items = res.items;

    for (var i=0;i<12;i++) {
        if (items[i] == undefined) continue;
        var tmp = $('div.item.hidden').clone();
        $(tmp).attr('data-itemid', items[i]['id']);
        $(tmp).find('img.thumb').attr('src',items[i]['img']);
        $(tmp).find('h3').attr('title',items[i]['title']).html(truncateString(items[i]['title'],13));
        $(tmp).find('h4').html(items[i]['provider']);
        $(tmp).removeClass('hidden');
        $(tmp).appendTo('div.results');
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

    console.log(items);
}

// Helper function to truncate the title
function truncateString(string, length) {
    if (string.length <= length + 1) return string;
    return string.substring(0, length-2) + '&hellip;'
}
