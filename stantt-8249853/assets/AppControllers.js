var StanttAppControllers = angular.module('AppControllers2', []);

StanttAppControllers.controller('MobileMeasurementsController', function($scope, StanttSizeService, StanttSizeService) {
  $scope.step = 0;
  $scope.measurements = StanttSizeService.measurements;
  $scope.stanttSize = StanttSizeService.stanttSize;

  $scope.goToStep = function(step) {
    $scope.step = step;
  }
});

StanttAppControllers.controller('CollarCuffController', function($scope, $location, CollarCuff) {

  $scope.collarCuff = CollarCuff;

  $scope.changeCollar = function(base_handle, newCollar) {
    CollarCuff.collar = newCollar;
  }

  $scope.changeCuff = function(base_handle, newCuff) {
    CollarCuff.cuff = newCuff;
  }

});

StanttAppControllers.controller('ShirtProductPageController', function($scope, $routeParams, $location, $timeout, StanttSizeService, Customer, CollarCuff) {

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
    }
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

StanttAppControllers.controller('ShirtSizingController', function($scope, $http, $timeout, StanttSizeService, Customer, UIService) {

  $scope.measurements = StanttSizeService.measurements;
  $scope.stanttSize = StanttSizeService.stanttSize;
  $scope.httpWorking = false;
  if ($scope.stanttSize.id)
  	$scope.showInputs = false;
  else
    $scope.showInputs = true;

  $scope.findMySize = function() {
    console.log("find size");
    if ($scope.measurementsValid()) {
      $scope.httpWorking = true;
      ga('send', 'event', 'app', 'used', 'find size');
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
      UIService.updateShirtVariantSelects($scope.stanttSize.name);
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


StanttAppControllers.controller('LocationController', function($scope, LocalStorage) {
  $scope.stanttLocation = "";

  var location = LocalStorage.getItem("stanttLocation");
  console.log("Location get from LS:", location);
  if (location) {
    $scope.stanttLocation = location;
  }

});
