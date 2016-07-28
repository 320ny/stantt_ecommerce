// StanttApp
"use strict";

var StanttApp;

StanttApp = angular.module('StanttApp', [
  'ngRoute',
  'StanttAppControllers',
  'StanttAppControllers2',
  'StanttAppServices'
]);

// For Express Checkout
StanttApp.config(function($routeProvider) {
  $routeProvider.
  when("/color/:color",
    {
      reloadOnSearch: false
  	}
  )
});

// CONTROLLERS
var StanttAppControllers = angular.module('StanttAppControllers', []);

StanttAppControllers.controller('AutoSizeLoadURLController', function($scope, StanttSizeService, UIService, LocalStorage) {

  function loadSizeFromUrl() {
  	var size, sizestring = window.location.search.split("size=")[1]
    if (sizestring)
      size = sizestring.split('&')[0];

    if (size && !(size.toLowerCase().indexOf("found") > -1)) {
      size = decodeURIComponent(size);
      StanttSizeService.updateSize(true, 100, size);
      UIService.updateMenuSize(size);
      UIService.updateShirtVariantSelects($scope.stanttSize.name);
    }
  }

  function loadLocationFromUrl() {
    var location, locationstring = window.location.search.split("location=")[1]
    if (locationstring) {
      location = decodeURIComponent(locationstring.split('&')[0]);
      LocalStorage.setItem('stanttLocation', location);
    }
  }

  loadLocationFromUrl();
  loadSizeFromUrl();
});

StanttAppControllers.controller('ShirtController', function($scope, $routeParams, $location, $timeout, StanttSizeService, Customer, CollarCuff) {

  $scope.collarCuff = CollarCuff
  $scope.sizingStep = undefined;
  $scope.stanttSize = StanttSizeService.stanttSize;
  $scope.measurements = StanttSizeService.measurements;
  $scope.customer = Customer;

  // For Express Checkout
  $scope.activeShirt = 'black';
  $scope.$on('$routeChangeSuccess', function() {
    $scope.activeShirt = $routeParams.color;
  });

  $scope.render = function(){
    Customer.detectCustomer();
  };


  $scope.changeSizingStep = function(step, event) {
    $location.search('sizingStep', step);

    StanttSizeService.storeMeasurements();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!(step == 'direct' || step == undefined)) {
      $("body").scrollTop(100);
    }å
  };

  $scope.render();

  $scope.$on("$locationChangeSuccess", function() {
    if($location.search().sizingStep) {
      $scope.sizingStep = $location.search().sizingStep;
    } else {
      $scope.sizingStep = undefined;
    }
  });

  $scope.changeMainImage = function(handle, src) {
    $("#product-image-"+handle+" img").attr('src', src);
  }

});

StanttAppControllers.controller('SizingController', function($scope, $http, $timeout, StanttSizeService, Customer, UIService) {

  $scope.measurements = StanttSizeService.measurements;
  $scope.stanttSize = StanttSizeService.stanttSize;
  $scope.httpWorking = false;
  if ($scope.stanttSize.id)
  	$scope.showInputs = false;
  else
    $scope.showInputs = true;


  $('#thankyou_return_url').val(window.location.pathname+window.location.search+'#?sizingStep=save');


  $scope.findMySize = function() {
    if ($scope.measurementsValid()) {
      ga('send', 'event', 'app', 'used', 'find size');
      $scope.httpWorking = true;
      $timeout(function() {
        $scope.calculateStanttSize(true);
      }, 800, true);
    } else {
      alert("Please provide all 3 size inputs");
    }
  }

  $scope.calculateStanttSize = function(findMySize) {
    var m = $scope.measurements;
    if ((findMySize && $scope.measurementsValid()) || ($scope.measurementsValid() && !$scope.stanttSize.name)) {
      findActiveSize(m.chest, m.waist, m.sleeve, m.unit);
      // Update local storage
      StanttSizeService.storeMeasurements();
    } else if ($scope.stanttSize.name) {
    	UIService.updateHiddenSelects($scope.stanttSize.name);
        UIService.updateMenuSize($scope.stanttSize.name);
    }

  };

  $scope.showStanttSize = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.calculateStanttSize();
    $scope.changeSizingStep(5);
  };



  $scope.measurementsValid = function() {
    var m = $scope.measurements;
    return (m.chest.toString().length > 1 && m.waist.toString().length > 1 && m.sleeve.toString().length > 1);
  };

    // private


  var findActiveSize = function(chest, waist, sleeve, unit) {
    $scope.httpWorking = true;

    if (unit == 'cm') {
      var chest  = convertCmToInches(chest);
      var waist  = convertCmToInches(waist);
      var sleeve = convertCmToInches(sleeve);
    };
	var params = "callback=JSON_CALLBACK&chest="+ chest +"&waist="+ waist +"&arm="+ sleeve;
    $http.jsonp("https://app.stantt.com/sizing/size/find?" + params)
      .success(function(data, status, headers, config, statusText) {
        if (data.error) {
          StanttSizeService.updateSize(true, 0, data.error);
        } else {
          StanttSizeService.updateSize(true, data.id, data.name);
        }
        UIService.updateHiddenSelects($scope.stanttSize.name);
        UIService.updateShirtVariantSelects($scope.stanttSize.name);
        UIService.updateMenuSize($scope.stanttSize.name);
      	$scope.showInputs = false;
      	$scope.httpWorking = false;
        Customer.updateMetaFields();
      });

  };


  var convertCmToInches = function(cm) {
    var inches = parseFloat(cm) / 2.54;
    return inches.toFixed(2);
  };

  $scope.calculateStanttSize();
});

StanttAppControllers.controller('DirectSizeInputController', function($scope, $http, StanttSizeService, UIService, Customer) {
  $scope.inputSize = "";
  $scope.showDirectInput = false;
  $scope.showModal = false;


  $scope.loadSize = function(size) {
    var params = "callback=JSON_CALLBACK&size="+ size;
    $http.jsonp("https://app.stantt.com/sizing/size/load?" + params)
      .success(function(data, status, headers, config, statusText) {
      	StanttSizeService.updateSize(true, data.id, data.name);
      	UIService.updateHiddenSelects($scope.stanttSize.name);
        UIService.updateShirtVariantSelects($scope.stanttSize.name);
      	UIService.updateMenuSize($scope.stanttSize.name);
      	$scope.$parent.showInputs = false;
        Customer.updateMetaFields();
      	$("body").scrollTop(100);
		console.log("Updating size to ", data.name)
      })
      .error(function(data) {
      	alert("Sorry but that is not a correct size name.");
      });
  }

  $scope.showHideInputs = function() {
  	 $scope.showDirectInput = !$scope.showDirectInput;
  }

});


// DIRECTIVES
StanttApp.directive('highlightMe', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element[0].select();
        }, 50, false);
      }
    };
  });
