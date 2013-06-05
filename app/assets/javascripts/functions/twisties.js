
$(function() {
  $(document).on('click', '.twisty', function(e) {
    $(e.target).siblings().removeClass('open');
    $(e.target).addClass('open');
  })
});