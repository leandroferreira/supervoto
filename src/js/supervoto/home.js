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

      $('#modal-container .close').click(_closeSelectModal);

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
      card.ee.addListener(card.EVENT_SELECT_FEATURE, _onFeatureSelected);
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
        _openSelectModal();
      }
    };

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
      // TODO: tie
      winner.setWinner();
      $('.modal-select>h3').text(winner.data.nome + ' WINS!!!');
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
      firstCard.moveToElement($('#modal-container .isotope-container'));
      secondCard.moveToElement($('#modal-container .isotope-container'));

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

      $('.message-bar').removeClass('hidden');
      $('.message-bar').addClass('another');

      $('.modal-backdrop, #modal-container').addClass('hidden');
      $('.modal-select').children().addClass('hidden');

      $('html, body').css('overflow', 'auto');

      firstCard.setMode(firstCard.MODE_DEFAULT);
      secondCard.setMode(secondCard.MODE_DEFAULT);

      firstCard.unflip();
      secondCard.unflip();

      setTimeout(function() {
        firstCard.moveBackToElement($('.isotope'));
        secondCard.moveBackToElement($('.isotope'));
      }, 400);
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