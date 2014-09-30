define(
  ['jquery', 'supervoto/home-menu', 'supervoto/card-container', 'supervoto/card'],
  function ($, HomeMenu, CardContainer, Card) {
  var Home = function Home() {
    var thisObj = this;

    var _politicosURL = 'js/politicos.json'
    var _container;
    var _filters = {};
    var _cards = {};
    var _cardsLength = 0;
    var _selectedCards = [];

    this.init = function() {
      // menu
      var menu = new HomeMenu().init();
      menu.ee.addListener(menu.EVENT_FILTER, _onMenuFilter);
      menu.ee.addListener(menu.EVENT_SORT, _onMenuSort);

      // container
      _container = new CardContainer().init($('#home .card-container'), '.card-item', 18);
      _loadPoliticos();

      // modal
      $('#modal-container .close').click(_closeSelectModal);

      return this;
    };

    // set filter
    var _onMenuFilter = function(menu, submenu) {
      _filters[menu] = submenu;

      // create filter string
      var filterString = '';
      for(var item in _filters) {
        if (_filters[item]) {
          filterString += '.' + _filters[item];
        }
      }

      _container.filter(filterString);
    };

    // set sort
    var _onMenuSort = function(menu, submenu) {
      _container.sortOn(submenu);
    };

    // load data
    var _loadPoliticos = function() {
      $.getJSON(_politicosURL, function(data) {
        var politico;

        for(var i = 0; i < data.politicos.length; i ++) {
          _addPolitico(data.politicos[i]);
        }

        _container.render();
      });
    };

    var _addPolitico = function(data, isVisible) {
      var card = new Card().init(data, _cardsLength);
      card.ee.addListener(card.EVENT_FLIPPED, _onCardFlip);
      card.ee.addListener(card.EVENT_SELECT_FEATURE, _onFeatureSelected);
      _cards[data.id] = card;
      _container.addItem(card.elm);
      _cardsLength ++;
    };

    var _onCardFlip = function(id, selected) {
      if(selected) {
        // remove element from array
        _selectedCards = _selectedCards.join('|').replace(id, '').replace('||', '|').split('|');
        _selectedCards = _selectedCards.filter(Boolean); // tidy up
      } else {
        _selectedCards.push(id);
      }

      if (_selectedCards.length === 0) {
        $('.message-bar').removeClass('another');
      } else if (_selectedCards.length === 1) {
        $('.message-bar').addClass('another');
      } else {
        _openSelectModal();
      }
    };

    var _openSelectModal = function() {
      // clear message bar
      $('.message-bar').removeClass('another');
      $('.message-bar').addClass('hidden');

      // show modal
      $('.modal-backdrop, #modal-container').removeClass('hidden');
      $('html, body').css('overflow', 'hidden');

      var firstCard = _cards[_selectedCards[0]];
      var secondCard = _cards[_selectedCards[1]];

      // move elements to same position, different parent
      firstCard.moveToElement($('#modal-container .card-container'));
      secondCard.moveToElement($('#modal-container .card-container'));

      setTimeout(function() {
        // show modal items
        $('.modal-select').children().removeClass('hidden');

        firstCard.setMode(firstCard.MODE_SELECTED_FIRST);
        secondCard.setMode(secondCard.MODE_SELECTED_LAST);
      }, 1);
    };

    var _closeSelectModal = function() {
      var firstCard = _cards[_selectedCards[0]];
      var secondCard = _cards[_selectedCards[1]];
      _selectedCards = [];

      // show message bar
      $('.message-bar').removeClass('hidden');

      // hide modal
      $('.modal-backdrop, #modal-container').addClass('hidden');
      $('.modal-select').children().addClass('hidden');

      $('html, body').css('overflow', 'auto');

      // reset cards
      firstCard.setMode(firstCard.MODE_DEFAULT);
      secondCard.setMode(secondCard.MODE_DEFAULT);

      firstCard.unflip();
      secondCard.unflip();

      // reset title
      $('.modal-select>h3').text('Selecione um item e compare');

      setTimeout(function() {
        firstCard.moveBackToElement($('#home .card-container'));
        secondCard.moveBackToElement($('#home .card-container'));
      }, 400);
    };

    // show winner
    var _onFeatureSelected = function(id, feature) {
      var firstCard = _cards[_selectedCards[0]];
      var secondCard = _cards[_selectedCards[1]];

      secondCard.flip();

      firstCard.selectFeature(feature);
      firstCard.setMode(firstCard.MODE_FINAL);
      secondCard.selectFeature(feature);
      secondCard.setMode(secondCard.MODE_FINAL);

      var winner;
      if(firstCard.data.atributos[feature].value > secondCard.data.atributos[feature].value) {
        winner = firstCard;
      } else if (firstCard.data.atributos[feature].value < secondCard.data.atributos[feature].value) {
        winner = secondCard;
      }

      if (winner) {
        winner.setWinner();
        $('.modal-select>h3').text(winner.data.nome + ' WINS!!!');
      } else {
        $('.modal-select>h3').text('IT\'S A TIE!!!');
      }
    };
  };
  return Home;
});