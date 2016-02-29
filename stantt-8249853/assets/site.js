
/*
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
Table of Contents
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    - Theme View
        - Header View
            - Navigation View
                - Mobile navigation View
                - Mega navigation View
        - Template View
            - QuickShop View
            - Index View
                - Slideshow View
            - Collection View
            - List Collections View
            - Product View
            - Cart View
            - Page View
            - The404View
            - Blog View

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/


(function() {
  var AccountView, BODY, CartView, CollectionView, HeaderView, IndexView, ListCollectionsView, MegaNavigationView, MobileNavigationView, NavigationView, ProductView, QuickShopView, RTEView, SlideshowView, TOUCH, ThemeView, WINDOW,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    return new ThemeView();
  });

  WINDOW = $(window);

  BODY = $('body');

  TOUCH = $('html').hasClass('touch');

  ThemeView = (function(_super) {

    __extends(ThemeView, _super);

    function ThemeView() {
      return ThemeView.__super__.constructor.apply(this, arguments);
    }

    ThemeView.prototype.el = BODY;

    ThemeView.prototype.events = {
      'focus .field': 'removeErrors'
    };

    ThemeView.prototype.initialize = function() {
      var rte, _i, _len, _ref;
      this.customerPage = this.$el.attr('class').indexOf('customer') > 0;
      if (navigator.userAgent.indexOf('MSIE 10.0') > 0) {
        $('html').addClass('ie10');
      }
      if ($('html').hasClass('lt-ie10')) {
        this.inputPlaceholderFix();
      }
      new HeaderView();
      _ref = $('.rte');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rte = _ref[_i];
        new RTEView({
          el: $(rte)
        });
      }
      new QuickShopView();
      if (BODY.hasClass('template-index')) {
        new IndexView({
          el: this.$el
        });
      }
      if (BODY.hasClass('template-collection')) {
        new CollectionView({
          el: this.$el
        });
      }
      if (BODY.hasClass('template-list-collections')) {
        new ListCollectionsView({
          el: this.$el
        });
      }
      if (BODY.hasClass('template-product')) {
        new ProductView({
          el: this.$el
        });
      }
      if (BODY.hasClass('template-cart')) {
        new CartView({
          el: this.$el
        });
      }
      if ($('.content-area').hasClass('customer')) {
        return new AccountView({
          el: this.$el
        });
      }
    };

    ThemeView.prototype.removeErrors = function(e) {
      var field;
      field = $(e.currentTarget);
      return field.removeClass('error');
    };

    ThemeView.prototype.inputPlaceholderFix = function() {
      var input, placeholders, text, _i, _len;
      placeholders = $('[placeholder]');
      for (_i = 0, _len = placeholders.length; _i < _len; _i++) {
        input = placeholders[_i];
        input = $(input);
        if (!(input.attr('value').length > 0)) {
          text = input.attr('placeholder');
          input.attr('value', text);
          input.data('original-text', text);
        }
      }
      placeholders.focus(function() {
        input = $(this);
        if (input.val() === input.data('original-text')) {
          return input.val('');
        }
      });
      return placeholders.blur(function() {
        input = $(this);
        if (input.val().length === 0) {
          return input.val(input.data('original-text'));
        }
      });
    };

    return ThemeView;

  })(Backbone.View);

  HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.el = $('.main-header');

    HeaderView.prototype.events = {
      'click .tools .search': 'toggleSearch',
      'blur .search-wrap.full .search-input': 'toggleSearch',
      'click .compact .search': 'toggleMobileSearch',
      'blur .compact .search-input': 'toggleMobileSearch',
      'click .mini-cart-wrap': 'toggleMiniCart',
      'click .mini-cart.active': 'stopProp'
    };

    HeaderView.prototype.initialize = function() {
      var _this = this;
      this.tools = $('.tools');
      this.branding = $('.store-title, .logo');
      this.searchWrap = $('.search-wrap.full');
      this.mobileSearchWrap = $('.search-outer-wrap');
      this.searchInput = $('.search-input');
      this.miniCart = $('.mini-cart');
      this.branding.imagesLoaded(function() {
        return _this.positionHeaderTools();
      });
      $('body').click(function(e) {
        if (_this.miniCart.hasClass('active')) {
          _this.miniCart.hide().removeClass('active');
          return _this.miniCart.parent().removeClass('active');
        }
      });
      WINDOW.resize(function() {
        _this.resize();
        return _this.positionHeaderTools();
      });
      return new NavigationView({
        el: this.$el
      });
    };

    HeaderView.prototype.stopProp = function(e) {
      return e.stopPropagation();
    };

    HeaderView.prototype.resize = function() {
      if (WINDOW.width() < 720) {
        return this.searchWrap.hide();
      }
    };

    HeaderView.prototype.positionHeaderTools = function() {
      var offset;
      offset = (this.branding.outerHeight() - this.tools.height()) / 2;
      this.tools.css({
        marginTop: offset + 4,
        visibility: 'visible'
      });
      return this.searchWrap.css({
        marginTop: offset + 1,
        visibility: 'visible',
        'min-width': this.tools.outerWidth()
      });
    };

    HeaderView.prototype.toggleSearch = function() {
      if (this.searchWrap.hasClass('active')) {
        this.searchWrap.hide().removeClass('active');
        this.searchInput.val('');
      } else {
        this.searchWrap.show().addClass('active');
        this.searchInput.focus();
        this.miniCart.hide().removeClass('active');
        this.miniCart.parent().removeClass('active');
      }
      return false;
    };

    HeaderView.prototype.toggleMobileSearch = function() {
      var offset;
      if (this.mobileSearchWrap.hasClass('active')) {
        this.mobileSearchWrap.hide().removeClass('active');
        return this.searchInput.val('');
      } else {
        this.mobileSearchWrap.show().addClass('active');
        offset = this.mobileSearchWrap.find('.search-wrap').outerHeight() / -2;
        this.mobileSearchWrap.find('.search-wrap').css({
          marginTop: offset
        });
        this.searchInput.focus();
        return $('.mobile-dropdown').trigger('close-mobile-nav');
      }
    };

    HeaderView.prototype.toggleMiniCart = function(e) {
      var button;
      button = this.miniCart.parent();
      if (this.miniCart.hasClass('active')) {
        this.miniCart.hide().removeClass('active');
        button.removeClass('active');
      } else {
        this.miniCart.show().addClass('active');
        button.addClass('active');
      }
      return e.stopPropagation();
    };

    return HeaderView;

  })(Backbone.View);

  NavigationView = (function(_super) {

    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.events = {
      'mouseenter .dropdown': 'establishTierDirection',
      'mouseleave .dropdown': 'replaceTrailingDivider',
      'mouseenter .has-mega-nav': 'toggleMegaNav'
    };

    NavigationView.prototype.initialize = function() {
      var navItem, _i, _len, _ref,
        _this = this;
      this.navigation = $('.main-header nav.full');
      this.megaNavButton = this.navigation.find('.has-mega-nav');
      this.mainMenuNavItems = this.navigation.find('> ul > .nav-item');
      this.multiLine = false;
      this.requiredRoom = 0;
      _ref = this.mainMenuNavItems;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        navItem = _ref[_i];
        navItem = $(navItem);
        this.requiredRoom += navItem.outerWidth();
      }
      new MobileNavigationView();
      new MegaNavigationView();
      this.formatFullNavigation();
      return WINDOW.resize(function() {
        return _this.resize();
      });
    };

    NavigationView.prototype.replaceTrailingDivider = function(e) {
      var previousNavItem;
      previousNavItem = ($(e.currentTarget)).prev();
      return previousNavItem.removeClass('hide-divider');
    };

    NavigationView.prototype.resize = function() {
      return this.formatFullNavigation();
    };

    NavigationView.prototype.formatFullNavigation = function() {
      var availableRoom;
      availableRoom = this.navigation.width();
      if (this.requiredRoom >= availableRoom) {
        this.navigation.addClass('compress');
        if (this.navigation.height() > 100) {
          this.multiLine = true;
          return this.navigation.addClass('multi-line');
        } else {
          this.navigation.removeClass('multi-line');
          return this.multiLine = false;
        }
      } else {
        this.navigation.removeClass('compress');
        this.navigation.removeClass('multi-line');
        return this.multiLine = false;
      }
    };

    NavigationView.prototype.establishTierDirection = function(e) {
      var availableRoom, childWidth, children, dropdown, positionLeft, previousNavItem, requiredRoom, secondaryChildren, tertiaryChildren;
      previousNavItem = ($(e.currentTarget)).prev();
      previousNavItem.addClass('hide-divider');
      $('.mega-nav').trigger('dismissMegaNav');
      dropdown = $(e.currentTarget);
      children = dropdown.find('.child');
      secondaryChildren = children.filter('.secondary');
      tertiaryChildren = children.filter('.tertiary');
      childWidth = dropdown.find('.dropdown-wrap').outerWidth();
      positionLeft = dropdown.position().left;
      requiredRoom = tertiaryChildren.length > 0 ? 3 * childWidth : 2 * childWidth;
      availableRoom = this.navigation.width() - positionLeft - dropdown.outerWidth();
      if (requiredRoom > availableRoom) {
        return children.removeClass('right').addClass('left');
      } else {
        return children.removeClass('left').addClass('right');
      }
    };

    NavigationView.prototype.toggleMegaNav = function(e) {
      var previousNavItem;
      if ($(e.currentTarget).hasClass('active')) {
        return;
      }
      previousNavItem = this.megaNavButton.prev();
      if (previousNavItem.hasClass('hide-divider')) {
        previousNavItem.removeClass('hide-divider');
      } else {
        previousNavItem.addClass('hide-divider');
      }
      $('.mega-nav').trigger('toggleMegaNav');
      return false;
    };

    return NavigationView;

  })(Backbone.View);

  MobileNavigationView = (function(_super) {

    __extends(MobileNavigationView, _super);

    function MobileNavigationView() {
      return MobileNavigationView.__super__.constructor.apply(this, arguments);
    }

    MobileNavigationView.prototype.el = $('.mobile-dropdown');

    MobileNavigationView.prototype.events = {
      'click .dropdown > a': 'toggleExpand',
      'close-mobile-nav': 'closeMobileNav'
    };

    MobileNavigationView.prototype.initialize = function() {
      var _this = this;
      this.mobileDropdownButton = $('.compact .dropdown');
      this.mobileDropdown = $('.mobile-dropdown');
      if (!TOUCH) {
        return $('.compact .dropdown').on('click', function() {
          return _this.toggleMobileNav();
        });
      } else {
        return $('.compact .nav-item.dropdown').on('touchend', function() {
          return _this.toggleMobileNav();
        });
      }
    };

    MobileNavigationView.prototype.openMobileNav = function() {
      this.mobileDropdownButton.addClass('active');
      return this.mobileDropdown.show();
    };

    MobileNavigationView.prototype.closeMobileNav = function() {
      this.mobileDropdownButton.removeClass('active');
      return this.mobileDropdown.hide();
    };

    MobileNavigationView.prototype.toggleMobileNav = function() {
      if (this.mobileDropdownButton.hasClass('active')) {
        return this.closeMobileNav();
      } else {
        return this.openMobileNav();
      }
    };

    MobileNavigationView.prototype.toggleExpand = function(e) {
      var button, childList, listItem;
      button = ($(e.currentTarget)).parent();
      listItem = button.closest('li.list-item');
      childList = button.find('> .list');
      listItem.toggleClass('expanded');
      childList.toggle();
      return false;
    };

    return MobileNavigationView;

  })(Backbone.View);

  MegaNavigationView = (function(_super) {

    __extends(MegaNavigationView, _super);

    function MegaNavigationView() {
      return MegaNavigationView.__super__.constructor.apply(this, arguments);
    }

    MegaNavigationView.prototype.el = $('.mega-nav');

    MegaNavigationView.prototype.initialize = function() {
      var listCount,
        _this = this;
      this.navContainer = $('nav.full');
      this.nav = $('.mega-nav');
      this.megaNavWrap = this.nav.find('.mega-nav-wrap');
      this.navTrigger = $('.has-mega-nav');
      this.mainList = this.$el.find('.main-list');
      this.expandedList = this.$el.find('.expanded-list');
      this.categoriesList = this.$el.find('.category-list');
      this.backButton = this.$el.find('.back');
      listCount = this.mainList.find('.list').length;
      if (listCount === 1) {
        listCount = 'one-col';
      }
      if (listCount === 2) {
        listCount = 'two-col';
      }
      if (listCount === 3) {
        listCount = 'three-col';
      }
      this.mainList.find('.list').addClass(listCount);
      this.nav.css({
        height: this.megaNavWrap.height()
      });
      WINDOW.resize(function() {
        return _this.resize();
      });
      return $('.has-mega-nav, .mega-nav').mouseleave(function(e) {
        return _this.closeMegaNav(e);
      });
    };

    MegaNavigationView.prototype.events = {
      'toggleMegaNav': 'toggle',
      'dismissMegaNav': 'dismiss',
      'click .show-more': 'goDeepWithin',
      'click .has-category': 'goDeepWithin',
      'click .back': 'reset'
    };

    MegaNavigationView.prototype.resize = function() {
      this.nav.css({
        height: this.megaNavWrap.height()
      });
      if (WINDOW.width() < 720) {
        return this.dismiss();
      } else if (this.navTrigger.hasClass('active')) {
        return this.invoke();
      }
    };

    MegaNavigationView.prototype.toggle = function() {
      if (this.navTrigger.hasClass('active')) {
        this.dismiss();
      } else {
        this.invoke();
      }
      return false;
    };

    MegaNavigationView.prototype.invoke = function() {
      var offset;
      offset = Math.floor(this.navContainer.position().top + this.navTrigger.position().top + this.navTrigger.outerHeight());
      this.navTrigger.addClass('active');
      return this.nav.css('top', offset);
    };

    MegaNavigationView.prototype.dismiss = function() {
      this.navTrigger.removeClass('active');
      this.navTrigger.prev().removeClass('hide-divider');
      return this.nav.css('top', '-9999px');
    };

    MegaNavigationView.prototype.closeMegaNav = function(e) {
      if ($(e.currentTarget).hasClass('has-mega-nav')) {
        if (!($(e.relatedTarget).hasClass('.mega-nav') || $(e.relatedTarget).closest('.mega-nav').length)) {
          return this.dismiss();
        }
      } else if ($(e.currentTarget).hasClass('mega-nav')) {
        if (!($(e.currentTarget).hasClass('has-mega-nav') || $(e.relatedTarget).parent().hasClass('has-mega-nav'))) {
          return this.dismiss();
        }
      }
    };

    MegaNavigationView.prototype.goDeepWithin = function(e) {
      var category, link, list, newHeight, origin, target, targetList,
        _this = this;
      link = $(e.currentTarget);
      origin = link.closest('ul.mega-nav-list');
      if (link.hasClass('show-more')) {
        list = link.closest('ul.list-wrap').data('list');
        target = this.expandedList;
        targetList = target.find("li[data-list='" + list + "']");
        this.categoriesList.hide();
        this.expandedList.show().find('.list').removeClass('active');
        target.find('.back').data('target', 'main-list');
      } else if (link.hasClass('has-category')) {
        category = ($(e.currentTarget)).data('category');
        target = this.categoriesList;
        targetList = target.find("li[data-category='" + category + "']");
        if (origin.hasClass('main-list')) {
          this.expandedList.hide();
          this.categoriesList.show().find('.list').removeClass('active');
          target.find('.back').data('target', 'main-list');
        } else {
          this.categoriesList.show().find('.list').removeClass('active');
          target.find('.back').data('target', 'expanded-list');
        }
      }
      targetList.addClass('active');
      if (target.hasClass('expanded-list')) {
        target.find('.back').data('origin', 'expanded-list');
      } else {
        target.find('.back').data('origin', 'category-list');
      }
      newHeight = target.height();
      if (newHeight > origin.height()) {
        this.nav.animate({
          height: target.height()
        });
      }
      this.megaNavWrap.animate({
        top: '-=' + origin.height()
      }, function() {
        return target.find('.back').fadeIn(150);
      });
      return false;
    };

    MegaNavigationView.prototype.reset = function(e) {
      var backButton, origin, target;
      backButton = $(e.currentTarget);
      target = $("." + (backButton.data('target')));
      origin = $("." + (backButton.data('origin')));
      backButton.fadeOut(150);
      this.nav.animate({
        height: target.height()
      });
      this.megaNavWrap.animate({
        top: '+=' + target.height()
      });
      if (backButton.data('origin') === 'category-list') {
        backButton.data('target', 'main-list');
        return backButton.data('origin', 'expanded-list');
      }
    };

    return MegaNavigationView;

  })(Backbone.View);

  IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      return IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.initialize = function() {
      var _this = this;
      setTimeout((function() {
        return _this.verticallyAlign();
      }), 500);
      WINDOW.resize(function() {
        return _this.verticallyAlign();
      });
      return new SlideshowView();
    };

    IndexView.prototype.verticallyAlign = function() {
      var collection, label, labels, _i, _len, _ref, _results;
      _ref = $('.collection');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        collection = _ref[_i];
        labels = ($(collection)).find('h2');
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = labels.length; _j < _len1; _j++) {
            label = labels[_j];
            _results1.push(($(label)).css({
              marginTop: ($(label)).height() / -2
            }).removeClass('preload'));
          }
          return _results1;
        })());
      }
      return _results;
    };

    return IndexView;

  })(Backbone.View);

  RTEView = (function(_super) {

    __extends(RTEView, _super);

    function RTEView() {
      return RTEView.__super__.constructor.apply(this, arguments);
    }

    RTEView.prototype.events = {
      'click .tabs li': 'switchTabs'
    };

    RTEView.prototype.initialize = function() {
      var _this = this;
      this.rte = this.$el;
      this.setupTabs();
      this.setupImages();
      this.setupVideos();
      this.mobilifyTables();
      return WINDOW.resize(function() {
        _this.setupVideos();
        return _this.mobilifyTables();
      });
    };

    RTEView.prototype.setupImages = function() {
      var images;
      images = this.rte.find('p > img');
      return images.imagesLoaded(function() {
        var image, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          image = $(image);
          _results.push(image.wrap('<div class="image-wrap">'));
        }
        return _results;
      });
    };

    RTEView.prototype.setupVideos = function() {
      var aspectRatio, contentWidth, video, videos, _i, _len, _results;
      videos = this.rte.not(".special").find('iframe, embed, object');
      contentWidth = this.rte.width();
      _results = [];
      for (_i = 0, _len = videos.length; _i < _len; _i++) {
        video = videos[_i];
        video = $(video);
        aspectRatio = video.height() / video.width();
        _results.push(video.css({
          width: contentWidth,
          height: contentWidth * aspectRatio,
          visibility: 'visible'
        }));
      }
      return _results;
    };

    RTEView.prototype.switchTabs = function(e) {
      var aspectRatio, content, contentWidth, position, tab, tabContainer, tabContentContainer, video, videos, _i, _len;
      tab = $(e.currentTarget);
      tabContainer = tab.parent();
      tabContentContainer = tabContainer.next();
      position = tab.index();
      content = tabContentContainer.find('> li').eq(position);
      tabContainer.find('> li').removeClass('active');
      tabContentContainer.find('> li').removeClass('active');
      tab.addClass('active');
      content.addClass('active');
      videos = content.find('iframe, embed, object');
      contentWidth = content.width();
      for (_i = 0, _len = videos.length; _i < _len; _i++) {
        video = videos[_i];
        video = $(video);
        aspectRatio = video.height() / video.width();
        video.css({
          width: contentWidth,
          height: contentWidth * aspectRatio,
          visibility: 'visible'
        });
      }
      return false;
    };

    RTEView.prototype.setupTabs = function() {
      var tabs, tabsContent;
      tabs = this.rte.find('.tabs');
      tabsContent = this.rte.find('.tabs-content');
      if (this.rte.find(':first-child').hasClass('tabs')) {
        this.rte.parent().addClass('no-border');
      }
      tabs.find('li:first').addClass('active');
      return tabsContent.find('li:first').addClass('active');
    };

    RTEView.prototype.mobilifyTables = function() {
      return this.$('table').mobileTable();
    };

    return RTEView;

  })(Backbone.View);

  ProductView = (function(_super) {

    __extends(ProductView, _super);

    function ProductView() {
      return ProductView.__super__.constructor.apply(this, arguments);
    }

    ProductView.prototype.initialize = function() {
      var _this = this;
      this.productArea = $('#product-area');
      this.fullscreenViewer = $('.fullscreen-product-viewer');
      this.fullscreenModal = this.fullscreenViewer.find('.modal');
      this.thumbsCount = this.productArea.find('.thumb').length;
      this.selectedThumbIndex = 0;
      this.setupVariants();
      //this.productArea.find('.showcase .container').spin('small');
      this.fullscreenViewer.find('.showcase .container').spin('small');
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      return WINDOW.resize(function() {
        return _this.resize();
      });
    };

    ProductView.prototype.events = {
      'click #product-area .thumb': 'determineSelectedThumb',
      'click .modal-wrap .thumb': 'determineSelectedThumb',
      'click .toggle-fullview': 'openFullview',
      'click .fullscreen-product-viewer': 'closeFullview',
      'click .fullscreen-product-viewer .modal': 'stopProp',
      'click .submit.disabled': 'disableSubmit',
      'click .modal-wrap .close': 'closeFullview'
    };

    ProductView.prototype.resize = function() {
      this.formatTheModal();
      return this.resizeShowcase();
    };

    ProductView.prototype.stopProp = function(e) {
      return e.stopPropagation();
    };

    ProductView.prototype.disableSubmit = function() {
      return false;
    };

    ProductView.prototype.setupVariants = function() {
      var label, labels, width, _i, _len;
      labels = this.productArea.find('.selector-wrapper > label');
      if (labels.length > 1) {
        width = 0;
        for (_i = 0, _len = labels.length; _i < _len; _i++) {
          label = labels[_i];
          if (($(label)).width() > width) {
            width = ($(label)).width();
          }
        }
        labels.width(width);
      }
      return this.productArea.find('.single-option-selector').sexyDrop({
        autoWidth: false
      });
    };

    ProductView.prototype.resizeShowcase = function() {
      var container, imgHeight;
      container = this.productArea.find('.container');
      imgHeight = container.find('img').height();
      return container.height(imgHeight);
    };

    ProductView.prototype.openFullview = function(e) {
      var _this = this;
      BODY.css({
        'overflow': 'hidden'
      });
      this.fullscreenViewer.show();
      this.formatTheModal();
      if (!$('html').hasClass('lt-ie9')) {
        this.fullscreenViewer.fadeTo(300, 1, function() {
          _this.parent = _this.fullscreenModal;
          if (_this.thumbsCount > 0) {
            return _this.updateProductShowcase();
          }
        });
      } else {
        this.parent = this.fullscreenModal;
        if (this.thumbsCount > 0) {
          this.updateProductShowcase();
        }
      }
      $(document).bind('keyup', function(e) {
        if (e.keyCode === 27) {
          return _this.closeFullview();
        }
      });
      return false;
    };

    ProductView.prototype.closeFullview = function(e) {
      var _this = this;
      if (!(e != null) || e.target === e.currentTarget) {
        if (!$('html').hasClass('lt-ie9')) {
          this.fullscreenViewer.fadeTo(300, 0, function() {
            _this.parent = _this.productArea;
            if (_this.thumbsCount > 0) {
              _this.updateProductShowcase();
            }
            _this.fullscreenViewer.hide();
            return BODY.css({
              'overflow': 'auto'
            });
          });
        } else {
          this.parent = this.productArea;
          if (this.thumbsCount > 0) {
            this.updateProductShowcase();
          }
          this.fullscreenViewer.hide();
          BODY.css({
            'overflow': 'auto'
          });
        }
        return $(document).unbind('keyup');
      }
    };

    ProductView.prototype.formatTheModal = function() {
      var container, imgHeight,
        _this = this;
      container = this.fullscreenModal.find('.container');
      imgHeight = container.find('img').height();
      container.height(imgHeight);
      this.scroller = this.fullscreenViewer.find('.pager').antiscroll({
        autoHide: false
      }).data('antiscroll');
      this.fullscreenViewer.find('.pager').height(imgHeight).one(this.transitionend, function(e) {
        return _this.scroller.refresh();
      });
      return container.imagesLoaded(function() {
        return _this.verticallyAlignModal();
      });
    };

    ProductView.prototype.verticallyAlignModal = function(imageHeight) {
      var modalHeight, offset, windowHeight;
      windowHeight = WINDOW.height();
      if (imageHeight) {
        modalHeight = imageHeight + 118;
      } else {
        modalHeight = this.fullscreenModal.outerHeight();
      }
      if (windowHeight <= modalHeight) {
        return this.fullscreenModal.css({
          'margin-top': 0
        });
      } else {
        offset = (windowHeight - modalHeight) / 2;
        this.fullscreenModal.css({
          'margin-top': offset
        });
        return window.setTimeout(function() {
          return $('.fullscreen-product-viewer .modal').addClass('transitions-are-go');
        }, 50);
      }
    };

    ProductView.prototype.determineSelectedThumb = function(e) {
      this.selectedThumbIndex = ($(e.currentTarget)).index();
      if (this.fullscreenViewer.is(":visible")) {
        this.parent = this.$('.modal-wrap');
      } else {
        this.parent = this.productArea;
      }
      return this.updateProductShowcase();
    };

    ProductView.prototype.updateProductShowcase = function() {
      var activeThumb, animationSpeed, img, selectedImg, selectedThumb, showcaseContainer, showcaseImage, showcaseWrap, src,
        _this = this;
      showcaseContainer = this.parent.find('.showcase .container');
      showcaseWrap = showcaseContainer.find('.wrap');
      showcaseImage = showcaseContainer.find('img');
      showcaseContainer.height(showcaseImage.height());
      activeThumb = this.parent.find('.thumb.active');
      selectedThumb = this.parent.find('.thumb').eq(this.selectedThumbIndex);
      selectedImg = selectedThumb.find('img');
      src = selectedImg.data('high-res-url');
      if (this.selectedThumbIndex !== activeThumb.index()) {
        img = new Image();
        img.src = src;
        img = $(img);
        animationSpeed = 200;
        return showcaseWrap.fadeTo(animationSpeed, 0, function() {
          showcaseImage.remove();
          return img.imagesLoaded(function() {
            showcaseWrap.append(img);
            showcaseContainer.animate({
              height: img.height()
            }, animationSpeed, 'linear', function() {
              activeThumb.removeClass('active');
              selectedThumb.addClass('active');
              return showcaseWrap.fadeTo(animationSpeed, 1);
            });
            if (_this.fullscreenViewer.is(":visible")) {
              _this.verticallyAlignModal(img.height());
              return _this.fullscreenViewer.find('.pager').height(img.height()).one(_this.transitionend, function(e) {
                return _this.scroller.refresh();
              });
            }
          });
        });
      }
    };

    return ProductView;

  })(Backbone.View);

  CartView = (function(_super) {

    __extends(CartView, _super);

    function CartView() {
      return CartView.__super__.constructor.apply(this, arguments);
    }

    CartView.prototype.events = {
      'change .quantity .field': 'updateQuantity',
      'change .instructions textarea': 'saveNote'
    };

    CartView.prototype.initialize = function() {
      var _this = this;
      this.textarea = $('.instructions textarea');
      this.mobileInstructions = $('.mobile.instructions');
      this.standardInstructions = $('.standard.instructions');
      $('.styled-select').sexyDrop();
      this.breakpointFixes();
      return WINDOW.resize(function() {
        return _this.breakpointFixes();
      });
    };

    CartView.prototype.breakpointFixes = function() {
      if (WINDOW.width() < 720) {
        return this.mobileInstructions.append(this.textarea);
      } else {
        return this.standardInstructions.append(this.textarea);
      }
    };

    CartView.prototype.updateQuantity = function(e) {
      var id, input, quantity, url;
      input = $(e.currentTarget);
      quantity = input.val();
      id = input.data('id');
      url = "/cart/change/" + id + "?quantity=" + quantity;
      return window.location = url;
    };

    CartView.prototype.saveNote = function() {
      var newNote;
      newNote = $('.instructions textarea').val();
      return Shopify.updateCartNote(newNote, function(cart) {});
    };

    return CartView;

  })(Backbone.View);

  ListCollectionsView = (function(_super) {

    __extends(ListCollectionsView, _super);

    function ListCollectionsView() {
      return ListCollectionsView.__super__.constructor.apply(this, arguments);
    }

    ListCollectionsView.prototype.initialize = function() {
      var _this = this;
      setTimeout((function() {
        return _this.verticallyAlign();
      }), 500);
      return WINDOW.resize(function() {
        return _this.verticallyAlign();
      });
    };

    ListCollectionsView.prototype.verticallyAlign = function() {
      var collection, label, labels, _i, _len, _ref, _results;
      _ref = $('.collection');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        collection = _ref[_i];
        labels = ($(collection)).find('h2');
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = labels.length; _j < _len1; _j++) {
            label = labels[_j];
            _results1.push(($(label)).css({
              marginTop: ($(label)).height() / -2
            }).removeClass('preload'));
          }
          return _results1;
        })());
      }
      return _results;
    };

    return ListCollectionsView;

  })(Backbone.View);

  CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.initialize = function() {
      var _this = this;
      this.titleContainer = $('.page-title');
      this.title = this.titleContainer.find('.label');
      this.tagsWrap = $('.tags-wrap');
      this.tags = this.tagsWrap.find('.tags');
      ($('.tags-dropdown')).sexyDrop();
      this.tagsWrap.removeClass('preload');
      this.formatTags();
      return WINDOW.resize(function() {
        return _this.formatTags();
      });
    };

    CollectionView.prototype.formatTags = function() {
      var availableRoom, dropdown, tagsWidth, titleContainerWidth, titleWidth;
      dropdown = this.tagsWrap.find('.pxuSexyDropWrapper');
      titleWidth = this.title.width();
      tagsWidth = this.tags.outerWidth(true);
      titleContainerWidth = this.titleContainer.width();
      availableRoom = titleContainerWidth - titleWidth;
      if (WINDOW.width() >= 720) {
        if (tagsWidth > availableRoom) {
          this.tags.hide();
          return dropdown.show();
        } else {
          this.tags.show();
          return dropdown.hide();
        }
      } else {
        this.tags.hide();
        return dropdown.show();
      }
    };

    return CollectionView;

  })(Backbone.View);

  QuickShopView = (function(_super) {

    __extends(QuickShopView, _super);

    function QuickShopView() {
      return QuickShopView.__super__.constructor.apply(this, arguments);
    }

    QuickShopView.prototype.el = $('.quick-shop');

    QuickShopView.prototype.events = {
      'click': 'close',
      'click .close-modal': 'close',
      'click .quick-shop-content .thumb': 'updateQuickShopShowcase',
      'click .submit:not(.disabled)': 'addToCart'
    };

    QuickShopView.prototype.initialize = function() {
      var _this = this;
      this.quickShop = $('.quick-shop');
      this.quickShopModal = this.quickShop.find('.quick-shop-modal');
      this.errorWrap = $('.error-wrap');
      $('.product-inner .overlay').click(function(e) {
        return _this.open(e);
      });
      this.verticallyAlignTriggers();
      return WINDOW.resize(function() {
        _this.formatTheModal();
        _this.setupVideos();
        return _this.verticallyAlignTriggers();
      });
    };

    QuickShopView.prototype.verticallyAlignTriggers = function() {
      var label, _i, _len, _ref, _results;
      _ref = $('.product-inner .label');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        label = _ref[_i];
        _results.push(($(label)).css({
          marginTop: ($(label)).height() / -2
        }));
      }
      return _results;
    };

    QuickShopView.prototype.formatTheModal = function() {
      var container, imgHeight, offset;
      container = this.quickShopModal.find('.container');
      imgHeight = container.find('img').height();
      container.height(imgHeight);
      if (WINDOW.height() <= $('.quick-shop-modal').outerHeight()) {
        return this.quickShopModal.css({
          'margin-top': 0
        });
      } else {
        offset = (WINDOW.height() - $('.quick-shop-modal').outerHeight()) / 2;
        return this.quickShopModal.css({
          'margin-top': offset
        });
      }
    };

    QuickShopView.prototype.setupVideos = function() {
      var aspectRatio, contentWidth, video, videos, _i, _len, _results;
      videos = this.quickShopModal.find('.rte iframe:visible, .rte embed:visible, .rte object:visible');
      contentWidth = this.quickShopModal.find('.rte').width();
      _results = [];
      for (_i = 0, _len = videos.length; _i < _len; _i++) {
        video = videos[_i];
        video = $(video);
        aspectRatio = video.height() / video.width();
        _results.push(video.css({
          width: contentWidth,
          height: contentWidth * aspectRatio,
          visibility: 'visible'
        }));
      }
      return _results;
    };

    QuickShopView.prototype.setupVariants = function(quickShopContent) {
      var label, labels, width, _i, _len;
      labels = quickShopContent.find('.selector-wrapper > label');
      width = 0;
      for (_i = 0, _len = labels.length; _i < _len; _i++) {
        label = labels[_i];
        if (($(label)).width() > width) {
          width = ($(label)).width();
        }
      }
      labels.width(width);
      return quickShopContent.find('.single-option-selector').sexyDrop({
        autoWidth: false
      });
    };

    QuickShopView.prototype.open = function(e) {
      var id, quickShopContent,
        _this = this;
      id = ($(e.currentTarget)).data('id');
      quickShopContent = $("#quick-shop-" + id);
      BODY.css({
        'overflow': 'hidden'
      });
      this.quickShop.show();
      this.quickShopModal.append(quickShopContent);
      this.setupVariants(quickShopContent);
      this.formatTheModal();
      this.setupVideos();
      if (!$('html').hasClass('lt-ie9')) {
        this.quickShop.fadeTo(200, 1);
      }
      this.quickShop.find('.showcase .container').spin('small');
      return $(document).bind('keyup', function(e) {
        if (e.keyCode === 27) {
          return _this.close();
        }
      });
    };

    QuickShopView.prototype.close = function(e) {
      var id, quantity, quickShopContent, submit,
        _this = this;
      if (!(e != null) || e.target === e.currentTarget) {
        submit = this.quickShopModal.find('.submit');
        quantity = this.quickShopModal.find('.product-quantity');
        quickShopContent = this.quickShopModal.find('.quick-shop-content');
        id = quickShopContent.attr('id').split('-')[2];
        $('.product-' + id).append(quickShopContent);
        if ($('html').hasClass('lt-ie9')) {
          this.quickShop.hide();
          this.quickShopModal.html('');
          BODY.css({
            'overflow': 'auto'
          });
          quantity.val('1');
        } else {
          this.quickShop.fadeTo(200, 0, function() {
            _this.quickShop.hide();
            _this.quickShopModal.html('');
            BODY.css({
              'overflow': 'auto'
            });
            return quantity.val('1');
          });
        }
        this.errorWrap.html('');
        return $(document).unbind('keyup');
      }
    };

    QuickShopView.prototype.updateQuickShopShowcase = function(e) {
      var activeThumb, img, selectedImg, selectedThumb, showcaseContainer, showcaseImage, showcaseWrap, src,
        _this = this;
      showcaseContainer = this.quickShop.find('.showcase .container');
      showcaseWrap = showcaseContainer.find('.wrap');
      showcaseImage = showcaseContainer.find('img');
      showcaseContainer.height(showcaseImage.height());
      activeThumb = this.quickShop.find('.pager .thumb.active');
      selectedThumb = $(e.currentTarget);
      selectedImg = selectedThumb.find('img');
      src = selectedImg.data('high-res-url');
      img = new Image();
      img.src = src;
      img = $(img);
      img.removeAttr('height width');
      return showcaseWrap.fadeTo(200, 0, function() {
        showcaseImage.remove();
        return img.imagesLoaded(function() {
          showcaseWrap.append(img);
          return showcaseContainer.animate({
            height: img.height()
          }, function() {
            activeThumb.removeClass('active');
            selectedThumb.addClass('active');
            return showcaseWrap.fadeTo(200, 1);
          });
        });
      });
    };

    QuickShopView.prototype.updateMiniCart = function(data, properties) {
      var cartCount, cartHTML, cartItemText, cartLabelWrap, existingItem, html, image, imageClass, item;
      properties.price = Shopify.formatMoney(data.line_price, settings.currencyFormat);
      properties.id = data.id;
      properties.vendor = data.vendor;
      properties.quantity.total = data.quantity;
      image = properties.matching_image.length ? properties.matching_image : data.image;
      existingItem = $("#item-" + properties.id);
      imageClass = settings.productImageBorders ? 'overlay' : '';
      cartLabelWrap = $('.mini-cart-wrap > label');
      cartCount = parseInt(cartLabelWrap.find('.item-count').text()) + parseInt(properties.quantity.added);
      cartItemText = cartCount === 1 ? 'item' : 'items';
      cartHTML = "<span class='item-count'>" + cartCount + "&nbsp;" + cartItemText + "</span>";
      cartLabelWrap.html(cartHTML);
      $('.mini-cart').removeClass('empty-cart');
      if (existingItem.length > 0) {
        existingItem.find('.price').text(properties.price);
        return existingItem.find('.quantity .count').text(properties.quantity.total);
      } else {
        item = $("<div class='item clearfix'>");
        html = "<div class='image-wrap'>\n    <img src='" + image + "'>\n    <a class='" + imageClass + "' href='" + properties.product.url + "'></a>\n</div>\n<div class='details'>\n    <p class='brand'>" + properties.vendor + "</p>\n    <p class='title'>\n        <a href='" + properties.product.url + "'>" + properties.product.title + "</a>\n        <span class='quantity'>× " + properties.quantity.total + "</span>\n    </p>\n    <p class='price'>" + properties.price + "</p>\n    <p class='variant'>" + properties.variant.title + "</p>\n</div>";
        return $('.mini-cart-items-wrap').append(item.html(html));
      }
    };

    QuickShopView.prototype.addToCart = function() {
      var button, imageAlt, postToCartUrl, properties, selector, thumb, variantSelectors, variantTitle, _i, _j, _len, _len1, _ref,
        _this = this;
      variantTitle = '';
      variantSelectors = this.quickShop.find('.single-option-selector');
      for (_i = 0, _len = variantSelectors.length; _i < _len; _i++) {
        selector = variantSelectors[_i];
        selector = $(selector);
        variantTitle += selector.val() + " / ";
      }
      variantTitle = variantTitle.substring(0, variantTitle.length - 3);
      properties = {};
      properties.variant = {};
      properties.product = {};
      properties.quantity = {};
      properties.matching_image = {};
      properties.quantity.added = this.quickShop.find('.product-quantity').val();
      properties.variant.id = this.quickShop.find('.product-select').val();
      properties.variant.title = this.quickShop.find('.product-select').data('variant-title') || variantTitle;
      properties.product.title = this.quickShop.find('.title').text();
      properties.product.url = this.quickShop.find('.title a').attr('href');
      _ref = this.quickShop.find('.thumb');
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        thumb = _ref[_j];
        imageAlt = $(thumb).find('img').attr('alt');
        if (variantTitle.indexOf(imageAlt) > -1) {
          properties.matching_image = $(thumb).find('img').attr('src');
        }
      }
      postToCartUrl = "/cart/add.js?quantity=" + properties.quantity.added + "&id=" + properties.variant.id;
      button = this.quickShop.find('.submit');
      button.data('original-text', button.text());
      button.text('Please wait').addClass('disabled');
      return $.ajax({
        type: 'POST',
        dataType: 'json',
        url: postToCartUrl,
        error: function(data) {
          var error, errorMsg;
          button.text(button.data('original-text')).removeClass('disabled');
          error = $.parseJSON(data.responseText);
          errorMsg = "<p>" + error.description + "</p>";
          return _this.errorWrap.html(errorMsg);
        },
        success: function(data) {
          button.text('Added to cart');
          _this.errorWrap.html('');
          return _this.updateMiniCart(data, properties);
        }
      });
    };

    return QuickShopView;

  })(Backbone.View);

  AccountView = (function(_super) {

    __extends(AccountView, _super);

    function AccountView() {
      return AccountView.__super__.constructor.apply(this, arguments);
    }

    AccountView.prototype.events = function() {
      return {
        'click .guest-login a': 'submitGuestCheckout'
      };
    };

    AccountView.prototype.initialize = function() {
      return $('.styled-select').sexyDrop({
        autoWidth: false,
        verticallyAlign: false
      });
    };

    AccountView.prototype.submitGuestCheckout = function() {
      $('#customer_login_guest').submit();
      return false;
    };

    return AccountView;

  })(Backbone.View);

  SlideshowView = (function(_super) {

    __extends(SlideshowView, _super);

    function SlideshowView() {
      return SlideshowView.__super__.constructor.apply(this, arguments);
    }

    SlideshowView.prototype.el = $('.slideshow');

    SlideshowView.prototype.slideFadeSpeed = 400;

    SlideshowView.prototype.initialize = function() {
      var i, interval, rotateFreq, _fn, _i, _len, _ref, _slide,
        _this = this;
      this.slides = this.$('.slide');
      this.jumpLinksWrap = $('.jump-to-slide');
      this.slides.first().addClass('first');
      this.slides.last().addClass('last');
      _ref = this.slides;
      _fn = function() {
        var slide;
        slide = _slide;
        if (settings.slideshowPagination && _this.slides.length > 0) {
          _this.jumpLinksWrap.append($('<li>'));
        }
        if (i === 0) {
          slide = $(slide);
          return slide.imagesLoaded(function() {
            return slide.fadeTo('200', 1, function() {
              var height;
              height = slide.height();
              slide.css('z-index', 2000).addClass('active');
              return slide.parent().css('height', height);
            });
          });
        }
      };
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        _slide = _ref[i];
        _fn();
      }
      this.jumpLinks = this.jumpLinksWrap.find('li');
      this.jumpLinksWrap.find('li:first').addClass('active');
      if (this.slides.length === 1) {
        this.$('.next, .prev, .jump-to-slide').remove();
      }
      if (settings.autoplaySlideshow) {
        rotateFreq = parseInt(settings.autoplayDelay, 10) || 5;
        interval = setInterval((function() {
          return _this.nextSlide();
        }), rotateFreq * 1000);
        this.$el.on('click.stopplaying', function() {
          clearInterval(interval);
          return this.$el.off('click.stopplaying');
        });
      }
      return WINDOW.resize(function() {
        return _this.$el.css({
          height: _this.slides.filter('.active').height()
        });
      });
    };

    SlideshowView.prototype.events = {
      'click .next': 'nextSlide',
      'click .prev': 'previousSlide',
      'click .jump-to-slide li:not(.active)': 'jumpToSlide'
    };

    SlideshowView.prototype.nextSlide = function() {
      var isLast, upcomingSlide;
      isLast = this.$('.slide.active').hasClass('last');
      upcomingSlide = isLast ? this.slides.first() : this.$('.slide.active').next();
      return this.switchToSlide(upcomingSlide);
    };

    SlideshowView.prototype.previousSlide = function() {
      var isFirst, upcomingSlide;
      isFirst = this.$('.slide.active').hasClass('first');
      upcomingSlide = isFirst ? this.slides.last() : this.$('.slide.active').prev();
      return this.switchToSlide(upcomingSlide);
    };

    SlideshowView.prototype.jumpToSlide = function(e) {
      var jumpPosition, upcomingSlide;
      jumpPosition = ($(e.currentTarget)).index();
      upcomingSlide = this.slides.eq(jumpPosition);
      return this.switchToSlide(upcomingSlide);
    };

    SlideshowView.prototype.switchToSlide = function(upcomingSlide) {
      var currentJumpLink, currentSlide, jumpLinks, jumpLinksWrap, upcomingJumpLink, upcomingSlidePosition, _i, _len, _ref;
      currentSlide = this.$('.slide.active');
      upcomingSlidePosition = upcomingSlide.index();
      _ref = this.jumpLinksWrap;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        jumpLinksWrap = _ref[_i];
        jumpLinksWrap = $(jumpLinksWrap);
        jumpLinks = jumpLinksWrap.find('li');
        upcomingJumpLink = jumpLinks.eq(upcomingSlidePosition);
        currentJumpLink = jumpLinks.filter('.active');
        currentJumpLink.removeClass('active');
        upcomingJumpLink.addClass('active');
      }
      this.$el.css({
        'height': upcomingSlide.height()
      });
      currentSlide.fadeTo(this.slideFadeSpeed, 0, function() {
        return currentSlide.removeClass('active');
      });
      return upcomingSlide.fadeTo(this.slideFadeSpeed, 1, function() {
        return upcomingSlide.addClass('active');
      });
    };

    return SlideshowView;

  })(Backbone.View);

}).call(this);
