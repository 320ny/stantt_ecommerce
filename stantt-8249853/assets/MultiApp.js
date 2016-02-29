SingleApp.config(function($routeProvider) {
  $routeProvider.
  when("/color/:color", 
    {
      reloadOnSearch: false
  	}
  ).
  otherwise({
     redirectTo: "/color/navy-gingham"
  });
});