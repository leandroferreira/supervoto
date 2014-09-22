define(['jquery', 'jquery-unveil'], function ($) {
  var CardContainer = function CardContainer() {
    var thisObj = this;
    var _perPage = 4 * 3;
    var _page = 1;
    var _timeoutScroll;

    var _container;
    var _childSelector;
    var _visibleCount = _perPage * _page;
    var _sortedItems = {};
    var _sortValue;
    var _filterValue;

    var _itemWidth;
    var _itemHeight;
    var _numCols;
    var _gutter;

    this.init = function(container, childSelector, gutter) {
      _container = container;
      _childSelector = childSelector;
      _gutter = gutter;

      $(document).scroll(_onScroll);

      return this;
    };

    // add jQuery item to container
    this.addItem = function(item) {
      var index = _container.children().length + 1;
      item.toggleClass('hidden', index > _visibleCount);

      _container.append(item);

      if (!_itemWidth) {
        _itemWidth = item.outerWidth();
        _itemHeight = item.outerHeight();
        _numCols = Math.floor((_container.outerWidth() + _gutter) / (_itemWidth + _gutter));
      }
    };

    // filter based on jQuery selector
    this.filter = function(filterString) {
      _filterValue = filterString;
      this.render();
    };

    // sort on data-[property] value, DESC
    this.sortOn = function(property) {
      _sortValue = property;
      this.render();
    };

    // add another page of items
    this.nextPage = function() {
      _page ++;
      _visibleCount = _page * _perPage;
      this.render();
    };

    // sets visibility and position
    this.render = function() {
      if (!_sortedItems.default) {
        _sortedItems.default = $(_childSelector, _container);
      }

      // get sorted items
      var items = _getSortedItems(_sortValue);

      // add filter
      if (_filterValue && _filterValue !== '') {
        items = items.filter(_filterValue);
      }

      // hide everything
      _sortedItems.default.addClass('hidden');

      // set index and show items
      for(var i = 0; i < items.length; i ++) {
        $(items[i]).attr('data-index', i);
        if (i < _visibleCount) {
          $(items[i]).removeClass('hidden');
        }
      }

      // animate visible items
      items = items.filter(':not(.hidden)');
      items.each(_renderItem);

      var visibleItemCount = Math.min(_visibleCount, items.filter(':not(.hidden)').length);
      _container.css('height', Math.floor(visibleItemCount / _numCols) * (_itemHeight + _gutter));

      $('img').unveil();
    };

    // get lazy-cached sorted items
    var _getSortedItems = function(property) {
      if (!property || property === '') {
        return _sortedItems.default;
      } else if (_sortedItems[property]) {
        return _sortedItems[property];
      } else {
        var items = _sortedItems.default.slice(0);

        items.sort(function(a, b) {
          return parseInt($(b).attr('data-' + property)) - parseInt($(a).attr('data-' + property));
        });

        _sortedItems[property] = items;
        return items;
      }
    };

    // render item position
    var _renderItem = function(index, item) {
      item = $(item);
      var itemIndex = parseInt(item.attr('data-index'));
      item.css('left', (itemIndex % _numCols) * (_itemWidth + _gutter));
      item.css('top', Math.floor(itemIndex / _numCols) * (_itemHeight + _gutter));
    };

    // check if we need to go to next page
    var _onScroll = function(event) {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        clearTimeout(_timeoutScroll);
        _timeoutScroll = setTimeout(function () {
          thisObj.nextPage();
        }, 500);
      }
    };
  };
  return CardContainer;
});