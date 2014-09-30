define(['jquery', 'mustache', 'EventEmitter', 'supervoto/config'], function ($, Mustache, EventEmitter, Config) {
  var HomeMenu = function HomeMenu() {
    var thisObj = this;
    var _menuTemplate = '<li class="{{id}}" data-title="{{name}}"><a class="menu-title">{{name}}</a><div class="submenu-mask"><ul class="submenu"></ul></div></li>';
    var _itemTemplate = '<li><a href="#" data-attribute={{attr}} data-id="{{id}}">{{name}}</a></li>';

    this.ee = new EventEmitter();
    this.EVENT_FILTER = 'MenuFilter';
    this.EVENT_SORT = 'MenuSort';

    this.init = function() {
      // create filters
      for(var i = 0; i < Config.filtros.length; i ++) {
        _addMenu(Config.filtros[i], $('.filter-menu .menu'));
      }

      // create sortings
      for(var i = 0; i < Config.ordens.length; i ++) {
        _addMenu(Config.ordens[i], $('.sort-menu .menu'));
      }

      _startMenu();

      return this;
    };

    var _addMenu = function(data, container) {
      // if theres data
      var items = Config[data.id];
      if (items) {
        // create container
        var itemsContainer = $(Mustache.to_html(_menuTemplate, {id:data.id, name:data.name})).appendTo(container);
        itemsContainer = $('.submenu', itemsContainer);
        var item;

        // create submenu items
        for(i = 0; i < items.length; i ++) {
          item = items[i];
          var name = item.name || item;
          var id = item.id || item;
          itemsContainer.append(Mustache.to_html(_itemTemplate, {id: id, name: name, attr:data.id}));
        }
      }
    };

    var _startMenu = function() {
      $('#home').on('click', '.submenu li a', function (event) {
        event.preventDefault();
        _onPressMenuItem($(this));
      });
    };

    var _onPressMenuItem = function(item) {
      var id = item.attr('data-id');
      var menuId = item.attr('data-attribute');
      var menuContainer = $('.' + menuId, '.menu');
      var previousId = menuContainer.attr('data-selected');

      var title = item.text();
      var selectedItem = item;

      // set selected as null if clicked for a second time
      if (id === previousId) {
        title = menuContainer.attr('data-title');
        selectedItem = null;
        id = null;
        menuContainer.removeAttr('data-selected');
      }

      // set item title
      $('.menu-title', menuContainer).text(title);

      // set item as selected
      $('.submenu li a', menuContainer).removeClass('selected');
      if (selectedItem)  {
        selectedItem.addClass('selected');
        menuContainer.attr('data-selected', selectedItem.attr('data-id'));
      }

      if (menuContainer.parents('nav').hasClass('sort-menu')) {
        thisObj.ee.emitEvent(thisObj.EVENT_SORT, [menuId, id]);
      } else {
        thisObj.ee.emitEvent(thisObj.EVENT_FILTER, [menuId, id]);
      }
    };
  }

  return HomeMenu;
});