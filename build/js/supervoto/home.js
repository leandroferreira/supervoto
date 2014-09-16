define(['jquery', 'isotope', 'supervoto/home-menu', 'supervoto/card'], function ($, Isotope, HomeMenu, Card) {
  var Home = function Home() {
    var thisObj = this;

    var _politicosURL = 'js/politicos.json'
    var _isotope;
    var _filters = {};
    var _cards = {};
    var _selectedCards = [];

    this.init = function() {
      // menu
      var menu = new HomeMenu().init();
      menu.ee.addListener(menu.EVENT_FILTER, _onMenuFilter);
      menu.ee.addListener(menu.EVENT_SORT, _onMenuSort);

      _loadPoliticos();

      return this;
    };

    var _onMenuFilter = function(menu, submenu) {
      _filters[menu] = submenu;

      // create filter string
      var filterString = '';
      for(var item in _filters) {
        if (_filters[item]) {
          filterString += '.' + _filters[item];
        }
      }

      // select all
      if (filterString === '') filterString = '*';

      _isotope.arrange({filter: filterString});
    };

    var _onMenuSort = function(menu, submenu) {
      _isotope.arrange({sortBy: submenu});
    };

    var _loadPoliticos = function() {
      // TODO: error handling
      $.getJSON(_politicosURL, function(data) {
        var politico;

        for(var i = 0; i < data.politicos.length; i ++) {
          _addPolitico(data.politicos[i]);
        }

        _startIsotope();
      });
    };

    var _addPolitico = function(data) {
      var card = new Card().init(data);
      card.ee.addListener(card.EVENT_FLIPPED, _onCardFlip);
      $('.isotope').append(card.elm);
      _cards[data.id] = card;
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
        _onCardsSelected();
      }
    };

    var _onCardsSelected = function() {
      $('.message-bar').removeClass('another');
      $('.message-bar').addClass('hidden');

      $('.modal-backdrop, .modal').removeClass('hidden');

      $('html, body').css('overflow', 'hidden');
      var offset = $('.isotope').offset();
      $('.modal').css('left', offset.left);
      $('.modal').css('top', offset.top);

      var firstCard = _cards[_selectedCards[0]];
      var secondCard = _cards[_selectedCards[1]];

      firstCard.elm.appendTo('.modal .isotope-container');
      secondCard.elm.appendTo('.modal .isotope-container');

      setTimeout(function() {
        firstCard.setMode(firstCard.MODE_SELECTED_FIRST);
        secondCard.setMode(secondCard.MODE_SELECTED_LAST);

        firstCard.elm.css('left', 100);
        firstCard.elm.css('top', 0);
        secondCard.elm.css('left', 500);
        secondCard.elm.css('top', 0);
      }, 1);
    };

    var _startIsotope = function() {
      _isotope = new Isotope('.isotope', {
        itemSelector: '.isotope-item',
        transitionDuration: '500ms',
        layoutMode: 'masonry',
        masonry: {
          columnWidth: 206,
          gutter: 45
        },
        getSortData: {
          atuacao: '.atuacao',
          processos: '.processos',
          privilegios: '.privilegios',
          assiduidade: '.assiduidade'
        }
      });
    };
  };
  return Home;
});