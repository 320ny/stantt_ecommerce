$( document ).ready(function() {
 
  //DELETE THIS - OLD
  $(".hiw-img-1").mouseover(function() {
    $(".hiw-text").hide();
    $(".hiw-text-1").show();
    $(".hiw-img-1").css("opacity","1");
  });
  
  $(".hiw-img-2").mouseover(function() {
    $(".hiw-text").hide();
    $(".hiw-text-2").show();
    $(".hiw-img-1").css("opacity",".3");
  });
  
  $(".hiw-img-3").mouseover(function() {
    $(".hiw-text").hide();
    $(".hiw-text-3").show();
    $(".hiw-img-1").css("opacity",".3");
  });
  
  $(".hiw-img-4").mouseover(function() {
    $(".hiw-text").hide();
    $(".hiw-text-4").show();
    $(".hiw-img-1").css("opacity",".3");
  });

  
  //NEW - KEEP THIS
  $(".hiw-img-1-new").mouseover(function() {
    $(".hiw-img-1-new").css("opacity","1");
  });
  
  $(".hiw-img-2-new").mouseover(function() {
    $(".hiw-img-1-new").css("opacity",".3");
  });
  
  $(".hiw-img-3-new").mouseover(function() {
    $(".hiw-img-1-new").css("opacity",".3");
  });
  
  
});