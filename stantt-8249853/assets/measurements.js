$( document ).ready(function() {
 
  $(".input2-whatsthis").mouseover(function() {
    $(".input2-explanation").css('visibility','visible');
  });
  
  $(".input2-whatsthis").mouseout(function() {
    $(".input2-explanation").css('visibility','hidden');
  });
  
  $(".input3-whatsthis").mouseover(function() {
    $(".input3-explanation").css('visibility','visible');
  });
  
  $(".input3-whatsthis").mouseout(function() {
    $(".input3-explanation").css('visibility','hidden');
  });

});