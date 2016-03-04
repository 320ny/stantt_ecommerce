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


AppServices.factory('CollarCuff', function() {
  return {
    collar: 'button-down',
    cuff: 'barrel',
    matches: function(co, cu) {
    	return (this.collar == co) && (this.cuff == cu);
    }
  }
});

AppServices.factory('UIService', function() {
  return {
    updateMenuSize: function(size) {
      $('#appstanttsize').remove();
      if (size) {
        $(".secondary-nav").first().append('<div id="appstanttsize"><p>YOUR SIZE IS: <span style="color:#094466;">'+size.toUpperCase()+'</span></p></div>');
      }
    },
    updateShirtVariantSelects: function(size) {
      $(".product-select option:contains(" + size + ")").attr('selected', 'selected');
    },
    updateHiddenSelects: function(name, count) {
      var count = typeof count !== 'undefined' ? count : 0;
      if (name) {
        if ($('[data-option="option1"]').length == 0) {
          var count = count + 1;
          var that = this;
          if(count < 10) {
            setTimeout(function() { that.updateHiddenSelects(name, count) }, 250);
          }
        } else {
          $('[data-option="option1"]').val(name).trigger('change');
        }
      }
    }
  }
});
