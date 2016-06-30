(function() {
  
  
  /* Begin Discount Autofill Code */
  /* Read the Query String value from the URL */    
  /* Link: http://stackoverflow.com/a/2880929 - Notes: No clue how this regex stuff works. Probably fairy magic.  */
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
    })();
  
    function setupPopup() {
      var button = $('<button>Start Shopping</button>');
      var popup = $('<div class="discount-popup"><h1>YOUR DISCOUNT HAS BEEN APPLIED!</h1> <span class="discount-close">X</span></div>');
      var background = $('<div class="discount-background"></div>');
      popup.append(button);
      $("body").prepend(popup);
      $("body").prepend(background);
      
      background.on('click', function() {
       	popup.remove();
        background.remove();
      });
      button.on('click', function() {
       	popup.remove(); 
        background.remove();
      });
      $('.discount-close').on('click', function() {
       	popup.remove(); 
        background.remove();
      });

    }
  
    function startDiscount() {
      if(urlParams["discount"]) {
        sessionStorage.removeItem("discount");
        sessionStorage.setItem("discount", urlParams["discount"]);
        setupPopup();
      }
      var discount = sessionStorage.getItem("discount");
      if(discount && discount != ('' || undefined || null || 'undefined')) {
        $('a[href="/checkout"]').attr('href', "/checkout?discount="+sessionStorage.getItem("discount"));
      }
    }

  	startDiscount();
   
}());