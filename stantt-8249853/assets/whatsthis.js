$( document ).ready(function() {
 
  $(".whatsthis").hover(function() {
    $(".explanation").toggle();
  });

  $(".whatsthis2").hover(function() {
    $(".explanation2").toggle();
  });

  $(".explanation1").hover(function() {
    $(".explanation1-text").toggle();
  });
  
  $(".explanation5").hover(function() {
    $(".explanation5-text").toggle();
  });

});