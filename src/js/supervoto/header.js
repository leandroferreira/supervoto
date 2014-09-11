define(['jquery', 'mustache'], function ($, Mustache) {
  var Header = function Header() {
    this.init = function() {
      // create filters
      for(var i = 0; i < window.config.filtros.length; i ++) {
        this._addMenu(window.config.filtros[i], $('.filter-menu .menu'));
      }

      // create sortings
      for(var i = 0; i < window.config.ordens.length; i ++) {
        this._addMenu(window.config.ordens[i], $('.sort-menu .menu'));
      }

      // top menu mouse over/out
      $('.top-menu a').mouseover(function () {
        $('#head').addClass('hover')
      }).mouseout(function () {
        $('#head').removeClass('hover')
      });

      return this;
    }

    this._addMenu = function(data, container) {
      var menuTemplate = '<li class="{{id}}"><a href="#">{{name}}</a><div class="submenu-mask"><ul class="submenu"></ul></div></li>';
      var itemTemplate = '<li><a href="#" data-attribute={{attr}} data-id="{{id}}">{{name}}</a></li>';

      var items = window.config[data.id];
      if (items) {
        var itemsContainer = $(Mustache.to_html(menuTemplate, {id:data.id, name:data.name})).appendTo(container);
        itemsContainer = $('.submenu', container);
        var item;

        for(i = 0; i < items.length; i ++) {
          item = items[i];
          var name = item.name || item;
          var id = item.id || item;
          itemsContainer.append(Mustache.to_html(itemTemplate, {id: id, name: name, attr:data.id}));
        }
      }
    }
  };
  return Header;
});