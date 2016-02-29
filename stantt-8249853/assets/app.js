// App
"use strict";

var App;

App = angular.module('App', [
  'ngRoute', 
  'AppControllers',
  'AppServices'
]);

// ROUTING

App.config(function($routeProvider) {
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

// CONTROLLERS 

var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('CustomerAccountController', function($scope, Customer, StanttSizeService) {

  Customer.detectCustomer();
  
  if (Customer.sizeRequiresSync()) {
    Customer.updateMetaFields();
	Customer.updateAccountFields();
  }

  
});

AppControllers.controller('RegistrationController', function($scope, $location, Customer, StanttSizeService) {
  
  $scope.sizeService = StanttSizeService;
  
  var storeData = function() {
     var search = $location.search();
  	 var measurements = {
    	chest: search.chest,
    	waist: search.waist,
    	sleeve: search.sleeve,
    	unit: 'in'
     };
     var size = {
    	available: true,
   		id: search.size_id,
    	name: search.size_name
     };
    StanttSizeService.measurements = measurements;
    StanttSizeService.stanttSize = size;
    StanttSizeService.storeMeasurements();
    StanttSizeService.storeSize();
  };
  
  var detectMeasurements = function () {
    var s = $location.search();
  	if(s.chest && s.waist && s.sleeve && s.size_id && s.size_name)
    	storeData();
  };
  
  detectMeasurements();
  
});

AppControllers.controller('ShirtController', function($scope, $routeParams, $location, $timeout, StanttSizeService, Customer) {
  
  $scope.activeShirt = '';
  $scope.sizingStep = undefined;
  $scope.stanttSize = StanttSizeService.stanttSize;
  $scope.customer = Customer;
  
  $scope.render = function(){
  	$scope.activeShirt = $routeParams.color;
    Customer.detectCustomer();
  };
  
  $scope.changeSizingStep = function(step, event) {
    /*
    if(step){
		document.getElementById('sizing-modal-background').add('.active');
    }
    else{
		document.getElementById('sizing-modal-background').remove('.active');
    }
    */
    $location.search('sizingStep', step);
    if (step)
    	ga('send', 'event', 'Shirts Sizing Modal', 'View', 'Step ' + step);
    
    StanttSizeService.storeMeasurements();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
      $("body").scrollTop(0);
    
    $timeout(function() {
      if (step == 2)
        $("#chest-input").select();
      else if (step == 3)
        $("#waist-input").select();
      else if (step == 4)
        $("#sleeve-input").select();
    }, 50, false);
	
  };
  
  $scope.render();
  
  $scope.$on("$routeChangeSuccess", function($currentRoute, $previousRoute){
 	// Update the rendering.
    $scope.render();
  });
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

AppControllers.controller('SizingController', function($scope, $http, StanttSizeService, Customer) {
  
  $scope.measurements = StanttSizeService.measurements;  
  $scope.stanttSize = StanttSizeService.stanttSize;
 
  $scope.calculateStanttSize = function() {
    var m = $scope.measurements;
    if (m.chest.toString().length > 1 && m.waist.toString().length > 1 && m.sleeve.toString().length > 1) {
      findActiveSize(m.chest, m.waist, m.sleeve, m.unit);
      // Update local storage
      StanttSizeService.storeMeasurements();
    }
  };
  
  $scope.updateHiddenSelects = function() {
    var name = $scope.stanttSize.name;
    // Update hidden selects
    $('[data-option="option1"]').val(name).trigger('change');
  };
  
  $scope.showStanttSize = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.calculateStanttSize();
    $scope.changeSizingStep(5);
  };
  
  
  // private 
  
  var findActiveSize = function(chest, waist, sleeve, unit) {
    
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
          //StanttSizeService.updateSize(true, data.name);
        }
        $scope.updateHiddenSelects();
        Customer.updateMetaFields();
      });       
        
  };
  
  
  var convertCmToInches = function(cm) {
    var inches = parseFloat(cm) / 2.54;
    return inches.toFixed(2);
  };
  
  $scope.calculateStanttSize();
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


// DIRECTIVES

App.directive('sizeNotFoundForm', function($http, StanttSizeService, Customer) {
  return {
    restrict: 'A',
    template: "<div class='form-size-wrapper no-match'>" +
                "<div ng-show='!submitted'>" +
                  "<p>This is just the beginning and we are making improvements every day. If you would like to be notified when your size becomes available, please provide your email address below:</p>" +
                  "<label for='available-email'>EMAIL</label><input id='available-email' ng-model='email' type='text' highlight-me>" +
                  "<button ng-click='submitForm()'>LET ME KNOW</button>" +
                "</div>" +
                "<div ng-show='submitted' class='no-size-thankyou'>" +
                  "<h3>THANK YOU</h3>" +
                  "<hr>" +
    			  "<p>Your information has been saved.</p>" +
                  "<a class='button-5' href='/collections/shirts'>CONTINUE SHOPPING</a>" +
                "</div>" +
    		  "</div>",
    controller: function($scope) {
      $scope.email = Customer.email || '';
      $scope.submitted = false;
      
      $scope.submitForm = function() {
        var m = StanttSizeService.measurements;
        var data = {
          "contact[name]": Customer.name || '',
          "form_type": "contact",
          "contact[email]": $scope.email,
          "contact[comments]": 'Measurements => Chest: '+ m.chest +' Waist: '+ m.waist +
          ' Sleeve: '+ m.sleeve +' Units: '+ m.unit
        };
        $http({
          method: 'POST',
          url: "/contact",
          data: $.param(data),
          headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        });
        $scope.submitted = true;
      };
      
    },
    link: function(scope, element) {
    }
  };
});

App.directive('sendTapeMeasureForm', function($http, Customer) {
  return {
    restrict: 'A',
    template: "<div class='form-size-wrapper'>" +
                "<div ng-show='!submitted'>" +
                  "<p>Provide us your email and we will let you know when your size is available</p>" +
                  "<label>Email</label><input ng-model='email' type='text'>" +
                  "<button ng-click='submitForm()'>LET ME KNOW</button>" +
                "</div>" +
                "<div ng-show='submitted'>" +
                  "<h3>THANK YOU</h3>" +
    			  "<p>Your information has been saved.</p>" +
                "</div>" +
    		  "</div>",
    controller: function($scope) {
      $scope.email = Customer.email || '';
      $scope.submitted = false;
      
      $scope.submitForm = function() {
        var m = StanttSizeService.measurements;
        var data = {
          "contact[name]": Customer.name || '',
          "form_type": "contact",
          "contact[email]": $scope.email,
          "contact[comments]": 'Measurements => Chest: '+ m.chest +' Waist: '+ m.waist +
          ' Sleeve: '+ m.sleeve +' Units: '+ m.unit
        };
        $http({
          method: 'POST',
          url: "/contact",
          data: $.param(data),
          headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        });
        $scope.submitted = true;
      };
      
    },
    link: function(scope, element) {
    }
  };
});

App.directive('highlightMe', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element[0].select();
        }, 50, false);
      }
    };
  });