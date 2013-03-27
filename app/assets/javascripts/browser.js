// Now set some stuff on ready
$(function() {
    // Some initial values
    gradeRanges = { 'minimum': 0, 'maximum': 12 }
    subject = 'ccssmath';
    
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
         * CCSS.Math ~ Initiative.Framework.Set.Grade.Domain.Cluster.Standard
         * CCSS.ELA ~ Initiative.Framework.Domain.Grade.{Cluster}.Standard.Component
         *
         * Initiative : The top level organization that a standar dcan belong to.
         * Framework : Essentially the subject
         * Set : Some subjects have subsets of content
         * Grade : Grade level
         * Domain : A grouping under each grade of the specific domain content
         * Cluster : A subgrouping in each domain of the underlying standards
         * Standard : The thing students are heald to
         * Component : A substandard that makes up the standards
         *
         * At this time, ELA doesn't have the notion of a cluster but really needs it.
         */

        // Handle CCSS.Math output


        if (panel == '_ccssmath') {
            // Update the standards information in the panel
            $('div.results.'+panel+' div.domains').empty();
            for (i in standard) {
                if (i == '_text') continue;
                for (t in standard[i]) {
                    if (t == '_text') continue;
                    var tmpNotation = notation+'["'+i+'"]["'+t+'"]';
                    var tmpText = tmpNotation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                    $('<a href="#'+tmpText+'">'+tmpText+'</a>').appendTo('div.results.'+panel+' div.domains');
                }
            }

            //Update the standards information
            $('div.results.'+panel+' div.content').empty();
            for (i in standard) {
                if (i == '_text') continue;
                var tmpTextContent = '';
                for (t in standard[i]) {
                    if (t == '_text') {
                        var tmpNotation = notation+'["'+i+'"]["'+t+'"]';
                        eval("var tmpStandard = jsonStandards"+tmpNotation+";");
                        tmpTextContent = '<h4>'+tmpStandard+'</h4><ul>' + tmpTextContent;
                    } else {
                        var tmpNotation = notation+'["'+i+'"]["'+t+'"]';
                        var tmpText = tmpNotation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                        eval("var tmpStandard = jsonStandards"+tmpNotation+"['_text'];");
                        tmpTextContent += '<li><strong>'+tmpText+'</strong>: ' + tmpStandard + '</li>';
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
                if (t == '_text') continue;
                var tmpNotation = notation+'["'+t+'"]';
                var tmpText = tmpNotation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                $('<a href="#'+tmpText+'">'+tmpText+'</a>').appendTo('div.results.'+panel+' div.domains');
            }

            //Update the standards information
            $('div.results.'+panel+' div.content').empty();
            var tmpTextContent = '<ul>';
            for (i in standard) {
                if (i == '_text') continue;
                var tmpNotation = notation+'["'+i+'"]';
                var tmpText = tmpNotation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                eval("var tmpStandard = jsonStandards"+tmpNotation+"['_text'];");
                tmpTextContent += '<li><strong>'+tmpText+'</strong>: ' + tmpStandard + '</li>';

                for (t in standard[i]) {
                    if (t == '_text') continue;
                    var tmpNotation = notation+'["'+i+'"]["'+t+'"]';
                    var tmpText = tmpNotation.replace(/\"\]\[\"/g,'.').replace(/\"\]/g,'').replace(/\[\"/g,'');
                    eval("var tmpStandard = jsonStandards"+tmpNotation+"['_text'];");
                    tmpTextContent += '<ul><li><strong>'+tmpText+'</strong>: ' + tmpStandard + '</li></ul>';
                }

            }
            tmpTextContent += '</ul>';
            $('div.results.'+panel+' div.content').append(tmpTextContent);
        }

        return false;
    });

    // Set onresize handlers
    $(window).resize(function() {
        setSubject(subject,0);
        setGradeRange(gradeRanges);
        $(".accordion").accordion("refresh");
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
}


// Here we redraw the search results panel from an xhr.
function redrawSearchResults(res) {
    // clear the panel
//    $('div.results').empty();
//    var items = res.items;
//
//    for (var i=0;i<12;i++) {
//        if (items[i] == undefined) continue;
//        var tmp = $('div.item.hidden').clone();
//        $(tmp).attr('data-itemid', items[i]['id']);
//        $(tmp).find('img.thumb').attr('src',items[i]['img']);
//        $(tmp).find('h3').attr('title',items[i]['title']).html(truncateString(items[i]['title'],13));
//        $(tmp).find('h4').html(items[i]['provider']);
//        $(tmp).removeClass('hidden');
//        $(tmp).appendTo('div.results');
//    }

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
            if (i == '_text') continue;

            var title = accordionTitle(standard[i]._text);
            var links = "";
            for (s in standard[i]) {
                if (s == '_text') continue;
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
            if (i == '_text') continue;
            var title = accordionTitle(standard[i]._text);

            var links = "";
            for (s in standard[i]) {
                if (s == '_text') continue;
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


