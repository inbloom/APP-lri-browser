// Now set some stuff on ready
$(function() {
    // Grade Range Variable Scopes
    gradeRanges = { 'minimum': 0, 'maximum': 12 }
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
    // Now turn on all grade items
    setTimeout(function(){ setGradeRangeSlider(gradeRanges); },500);

    // Make Left Handle Draggable
    $('div.slider-handle-left').draggable({
        axis: 'x',
        containment: 'parent',
        drag: function(event, ui) {
            var position = $(this).offset().left - ageRangeSlider.left; 
            for (i in loc_offsets) {
                if (i > gradeRanges.maximum) continue;
                if (position < (loc_offsets[i].leftBoundary+10) && position > (loc_offsets[i].leftBoundary-10)) {
                    setGradeRangeSlider({'minimum':i});
                }
            }
        },
        stop: function(event, ui) {
            setGradeRangeSlider();
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
                    setGradeRangeSlider({'maximum':i});
                }
            }
        },
        stop: function(event, ui) {
            setGradeRangeSlider();
        }
    });

    // Set onresize handlers
    $(window).resize(function() {
        setGradeRangeSlider(gradeRanges);
    });
});

// Set grade range but not slider
function setGradeRange(ranges) {
    $('div.grade li').removeClass('selected');
    for (i=ranges.minimum;i<=ranges.maximum;i++) {
        $('li._'+i).addClass('selected');
    }
    // Set ranges
    gradeRanges = ranges;
}

// Set grade range and the slider
function setGradeRangeSlider(ranges) {
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
    setGradeRange(ranges);
    // Some helpers to set width
    var slider_left = Math.ceil($('li._'+ranges.minimum).offset().left + loc_offsets[ranges.minimum].minimum);
    var slider_right = Math.ceil(($('li._'+ranges.maximum).offset().left - slider_left) + loc_offsets[ranges.maximum].maximum);
    // Set the initial grade slider position
    $('.grade-slider').offset({ 'left': slider_left });
    $('.grade-slider').width(slider_right);
    // Set the handles locations
    $('.slider-handle-left').offset({ 'left': slider_left + 6 });
    $('.slider-handle-right').offset({ 'left': slider_right + slider_left - 26 });
    // Set ranges back so we have them.
    gradeRanges = ranges;
}