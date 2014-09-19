define(['jquery'], function ($) {
  var CardContainer = function CardContainer() {
    var _container;
    var _childSelector;
    var _perPage = 4;
    var _page = 1;
    var _visibleCount = _perPage * _page;
    var _itemWidth;
    var _itemHeight;
    var _numCols;
    var _gutter;

    this.init = function(container, childSelector, gutter) {
      _container = container;
      _childSelector = childSelector;
      _gutter = gutter;

      return this;
    };

    this.addItem = function(item) {
      _container.append(item);

      if (!_itemWidth) {
        _itemWidth = item.outerWidth();
        _itemHeight = item.outerHeight();
        _numCols = Math.floor((_container.outerWidth() + _gutter) / (_itemWidth + _gutter));
      }

      item.toggleClass('hidden', _container.children().length > _visibleCount);
    };

    this.render = function() {
      $(_childSelector + ':not(.hidden)', _container).each(_renderItem);
      _container.css('height', Math.floor(_visibleCount / _numCols) * (_itemHeight + _gutter));
    };

    this.filter = function(filterString) {
      if (filterString === '') {
        $(_childSelector, _container).addClass('hidden');
        $(_childSelector + ':lt(' + _visibleCount + ')', _container).removeClass('hidden');
      } else {
        $(_childSelector, _container).addClass('hidden');
        $(_childSelector + filterString + ':lt(' + _visibleCount + ')', _container).removeClass('hidden');
      }

      this.render();
    };

    this.sortOn = function(property) {

    };

    this.nextPage = function() {
      _page ++;
      _visibleCount = _page * _perPage;
      render();
    };

    var _renderItem = function(index, item) {
      $(item).css('left', (index % _numCols) * (_itemWidth + _gutter));
      $(item).css('top', Math.floor(index / _numCols) * (_itemHeight + _gutter));
    };
  };
  return CardContainer;
});