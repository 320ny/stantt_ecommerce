// SingleApp
"use strict";

var SingleApp;

SingleApp = angular.module('SingleApp', [
  'ngRoute', 
  'AppControllers',
  'AppServices'
]);

// For Express Checkout
SingleApp.config(function($routeProvider) {
  $routeProvider.
  when("/color/:color", 
    {
      reloadOnSearch: false
  	}
  )
});

// CONTROLLERS 

var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('CollarCuffController', function($scope, $location, CollarCuff) {

  $scope.changeCollar = function(base_handle, newCollar) {
    CollarCuff.collar = newCollar;
  }
  
  $scope.changeCuff = function(base_handle, newCuff) {
    CollarCuff.cuff = newCuff;
  }
  
});

  
AppControllers.controller('AutoSizeLoadURLController', function($scope, StanttSizeService, UIService) {
  
  function loadSizeFromUrl() {
  	var size, sizestring = window.location.search.split("size=")[1]
    if (sizestring)
      size = sizestring.split('&')[0];
    
     console.log(size)
    if (size && !(size.toLowerCase().indexOf("found") > -1)) {
      size = decodeURIComponent(size);
      StanttSizeService.updateSize(true, 100, size);
      UIService.updateMenuSize(size);
    }
  }
  
  loadSizeFromUrl();
});

AppControllers.controller('ShirtController', function($scope, $routeParams, $location, $timeout, StanttSizeService, Customer, CollarCuff) {
  
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
    if (step)
    	ga('send', 'event', 'Shirts Sizing Modal', 'View', 'Step ' + step);
    
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

AppControllers.controller('SizingController', function($scope, $http, $timeout, StanttSizeService, Customer, UIService) {
  
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
    $http.jsonp("http://app.stantt.com/sizing/size/find?" + params)
      .success(function(data, status, headers, config, statusText) {
        if (data.error) {
          StanttSizeService.updateSize(true, 0, data.error);   
        } else { 
          StanttSizeService.updateSize(true, data.id, data.name);
        }
        UIService.updateHiddenSelects($scope.stanttSize.name);
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

AppControllers.controller('DirectSizeInputController', function($scope, $http, StanttSizeService, UIService, Customer) {
  $scope.inputSize = "";
  $scope.showDirectInput = false;
  $scope.showModal = false;
  
  
  $scope.loadSize = function(size) {
    var params = "callback=JSON_CALLBACK&size="+ size;
    $http.jsonp("http://app.stantt.com/sizing/size/load?" + params)
      .success(function(data, status, headers, config, statusText) {
      	StanttSizeService.updateSize(true, data.id, data.name);
      	UIService.updateHiddenSelects($scope.stanttSize.name);
      	UIService.updateMenuSize($scope.stanttSize.name);
      	$scope.$parent.showInputs = false;
        Customer.updateMetaFields();
      	$("body").scrollTop(100);
      
      })
      .error(function(data) {
      	alert("Sorry but that is not a correct size name.");  
      });    
  }
  
  $scope.showHideInputs = function() {
  	 $scope.showDirectInput = !$scope.showDirectInput;
  }
    
});


// SERVICES

var AppServices = angular.module('AppServices', []);

AppServices.factory('Customer', function($http, StanttSizeService) {
  return {
    id: undefined,
    loggedIn: false,
    detectCustomer: function() {
      var id = $("[data-customer-id]").first().data('customer-id');
      var name = $("[data-customer-name]").first().data('customer-name');
      var email = $("[data-customer-email]").first().data('customer-email');
      var sizeId = $("[data-customer-size-id]").first().data('customer-size-id');
      var sizeName = $("[data-customer-size-name]").first().data('customer-size-name');
      var chest = $("[data-customer-measurement-chest]").first().data('customer-measurement-chest');
      var waist = $("[data-customer-measurement-waist]").first().data('customer-measurement-waist');
      var sleeve = $("[data-customer-measurement-sleeve]").first().data('customer-measurement-sleeve');
      var unit = $("[data-customer-measurement-unit]").first().data('customer-measurement-unit');
      if (id) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.loggedIn = true;
      }
      if (sizeId)
        StanttSizeService.stanttSize.id = sizeId;
      if (sizeName)
        StanttSizeService.stanttSize.name = sizeName;
      if (chest)
        StanttSizeService.measurements.chest = chest;
      if (waist)
        StanttSizeService.measurements.waist = waist;
      if (sleeve)
        StanttSizeService.measurements.sleeve = sleeve;
      if (unit)
        StanttSizeService.measurements.unit = unit;
      StanttSizeService.storeSize();
      StanttSizeService.storeMeasurements();
    },
    sizeRequiresSync: function() {
      var sizeName = $("[data-customer-size-name]").first().data('customer-size-name');
      if (!sizeName && StanttSizeService.stanttSize.name)
        return true;
      else
        return false;
    },
    updateAccountFields: function() {
      $('#customer-measurement-chest').text(StanttSizeService.measurements.chest);
      $('#customer-measurement-waist').text(StanttSizeService.measurements.waist);
      $('#customer-measurement-sleeve').text(StanttSizeService.measurements.sleeve);
      $('#customer-size-name').text(StanttSizeService.stanttSize.name);
    },
    updateMetaFields: function() {
      if (this.loggedIn) {
        var m = StanttSizeService.measurements;
        var s = StanttSizeService.stanttSize;
        var data = {
          "customer[id]": this.id.toString(),
          "metafield[Measurement.chest]": m.chest,
          "metafield[Measurement.waist]": m.waist,
          "metafield[Measurement.sleeve]": m.sleeve,
          "metafield[Measurement.unit]": m.unit,
          "metafield[Size.code]": s.id,
          "metafield[Size.name]": s.name
        };
        $http.post('/a/custmeta', $.param(data),
          {"headers" : {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        });
      }
    }
  }
});

AppServices.factory('StanttSizeService', function(LocalStorage) {
  var defaultMeasurements = {
    chest: '',
    waist: '',
    sleeve: '',
    unit: 'in'
  };
  var defaultStanttSize = {
    available: undefined,
   	id: undefined,
    name: ''
  };
    
  return {
    measurements: LocalStorage.fetchItem('stanttMeasurements', defaultMeasurements),
    stanttSize: LocalStorage.fetchItem('stanttSize', defaultStanttSize),
    updateSize: function(available, id, name) {
    //updateSize: function(available, name) {
      this.stanttSize.available = available;
      this.stanttSize.id = id;
      this.stanttSize.name = name;
      this.storeSize();
    },
    storeSize: function () {
      // Save to local storage
      LocalStorage.setItem('stanttSize', this.stanttSize);
    },
    storeMeasurements: function() {
      LocalStorage.setItem('stanttMeasurements', this.measurements);
    }
  };
});

AppServices.factory('LocalStorage', function($window) {
  return {
    setItem: function(key, value) {
      var string = JSON.stringify(value);
      return $window.localStorage && $window.localStorage.setItem(key, string);
    },
    getItem: function(key) {
      var string = $window.localStorage && $window.localStorage.getItem(key);
      return JSON.parse(string);
    },
    fetchItem: function(key, defaultItem) {
      var item = this.getItem(key);
      if (item)
        return item;
      else
        return defaultItem;
    }
  };
});

AppServices.factory('UIService', function() {
  return {
    updateMenuSize: function(size) {
      $('#appstanttsize').remove();
      if (size) {
        $(".secondary-nav").first().append('<div id="appstanttsize"><p>YOUR SIZE IS: <span style="color:#094466;">'+size.toUpperCase()+'</span></p></div>'); 
      }      
    },
    updateHiddenSelects: function(name) {
      if (name) {
        if ($('[data-option="option1"]').length == 0) {
          var that = this;
          setTimeout(function() { that.updateHiddenSelects(name) }, 250);
        } else {
          $('[data-option="option1"]').val(name).trigger('change');
        }        
      }
    }
  }
});

AppServices.factory('CollarCuff', function() {
  return {
    collar: 'button-down',
    cuff: 'barrel',
    matches: function(co, cu) {
    	return (this.collar == co) && (this.cuff == cu); 
    }
  }
});


// DIRECTIVES


SingleApp.directive('highlightMe', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element[0].select();
        }, 50, false);
      }
    };
  });


SingleApp.controller('ExpressCheckoutMenu', function($scope, $http) {
  $scope.showMenu = false;
  $scope.menuLinks = [
     {name: 'All Products', url: '/collections/express-all'},
     {name: 'Flannel ', url: '/collections/express-flannels'},
     {name: 'Gift Cards', url: '/collections/express-gift-cards'},
     {name: 'Manhattan', url: '/collections/express-manhattan'},
     {name: 'Highlinee', url: '/collections/express-highline'}
   ];
  
  $scope.toggleMenu = function() {
    $scope.showMenu = !$scope.showMenu;
  }
});