$(document).ready(function() {
  $('#nojs').css('visibility', 'hidden');
  $.get('/README.md', function(md) {
    $('#readme').text(md);
  });
});
