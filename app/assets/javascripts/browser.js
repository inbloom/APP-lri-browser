// Now set some stuff on ready
$(function() {
    // Some initial values
    gradeRanges = { 'minimum': 0, 'maximum': 12 }
    subject = 'math';
    
    // Some position helpers K-12
    loc_offsets = {
        0 : {'minimum':-27,'maximum':39, 'leftBoundary': 10, 'rightBoundary': 43},
        1 : {'minimum':-27,'maximum':39, 'leftBoundary': 43, 'rightBoundary': 75},
        2 : {'minimum':-27,'maximum':39, 'leftBoundary': 75, 'rightBoundary': 107},
        3 : {'minimum':-27,'maximum':39, 'leftBoundary': 107, 'rightBoundary': 139},
        4 : {'minimum':-27,'maximum':39, 'leftBoundary': 139, 'rightBoundary': 171},
        5 : {'minimum':-27,'maximum':39, 'leftBoundary': 171, 'rightBoundary': 203},
        6 : {'minimum':-27,'maximum':39, 'leftBoundary': 203, 'rightBoundary': 235},
        7 : {'minimum':-27,'maximum':39, 'leftBoundary': 235, 'rightBoundary': 267},
        8 : {'minimum':-27,'maximum':39, 'leftBoundary': 267, 'rightBoundary': 299},
        9 : {'minimum':-27,'maximum':39, 'leftBoundary': 299, 'rightBoundary': 331},
        10 : {'minimum':-27,'maximum':46, 'leftBoundary': 331, 'rightBoundary': 371},
        11 : {'minimum':-27,'maximum':46, 'leftBoundary': 371, 'rightBoundary': 411},
        12 : {'minimum':-27,'maximum':46, 'leftBoundary': 411, 'rightBoundary': 455}
    }

    // Now turn on the UI and set defaults
    setTimeout(function(){
        setGradeRange(gradeRanges);
        setSubject(subject);
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

    // Make subjects clickable So that it selects between them -- only one can be selected.
    $('div.subjects li a').click(function(e) {
        var a = $(e.target);
        var li = a.parent();
        if (li.hasClass('disabled')) return false;
        setSubject(a.html());
        return false;
    });

    // Click to open/close the featured stuff
    $('div.divider a').click(function(e) {
        var a = $(e.target);
        if (a.hasClass('closed')) {
            $('div.featured').animate({ height: 'show' }, 600, 'easeInOutCubic', function() {
                a.removeClass('closed');
            });
        } else {
            $('div.featured').animate({ height: 'hide' }, 600, 'easeInOutCubic', function() {
                $.cookie('hideFeatured', true);
                $.removeCookie('showFeatured');
                a.addClass('closed');
            });
        }
    });
    // Set state of featured slider with cookie
    if ($.cookie('hideFeatured') == "true") {
        $('div.featured').hide();
        $('div.divider a').addClass('closed');
    }

    // Initialization of the accordion
    $("#accordion").accordion({
        heightStyle:"fill",
        animate: "easeInOutCubic"
    });

    // Make items that aren't landing zones draggable using a live event!
    $(document).on("mouseover", 'div.item:not(.landingzone):not(.collected)', function() {
        $(this).draggable({
            helper: 'clone',
            opacity: 0.7,
            revert: 'invalid'
        });
    });
    // Setup landing zones
    $('div.item.landingzone').droppable({
        hoverClass: 'hovering',
        drop: function(e,u) {
            // @TODO Test to see if the dragged item exists in collections already
            var clone = u.draggable.clone().addClass('collected').hide().prependTo('div.collections span.zone');
            clone.animate({height:'show'}, 600, 'easeInOutCubic', function() {
                collectItem(this);
            });
            $('div.collections span.zone div.item:nth-child(4)').animate({height:'hide'}, 600, 'easeInOutCubic', function() {
                $(this).remove();
            });
        }
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
    // Set the initial grade slider position
    $('.grade-slider').offset({ 'left': slider_left });
    $('.grade-slider').width(slider_right);
    // Set the handles locations

    $('.slider-handle-left').offset({ 'left': slider_left + 6 }).show();
    $('.slider-handle-right').offset({ 'left': slider_right + slider_left - 26 }).show();
}

// Set the subject and move the cursor accordingly
function setSubject(subject) {
    if ($('div.subjects li._'+subject).length == 1) {
        $('div.subjects li').removeClass('selected');
        $('div.subjects li._'+subject).addClass('selected');
        $('#form-subject').attr('value', subject);

        var tWidth = $('div.subjects li._'+subject).width();
        var tLeft = $('div.subjects li._'+subject).offset().left;
        var tCenter = tLeft + (tWidth /2);
        var cPosition = tCenter - ($('div.subject-cursor').width()/2) + 3;

        $('div.subject-cursor').animate({'left': cPosition}, 300, 'easeInOutCubic', function() {
            $('div.subject-cursor').show();
        });
    }
}

// Set object to the server as being saved in a collection
function collectItem(item) {
    // Here we will send to the server the item id we are saving.
    // We need to get an updated pagination here and send that back tot he collections div.
    console.log(item);
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
