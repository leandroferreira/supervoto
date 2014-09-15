define(['jquery', 'isotope', 'mustache', 'supervoto/home-menu'], function ($, Isotope, Mustache, HomeMenu) {
  var Home = function Home() {
    var thisObj = this;

    var _politicoTemplate = '' +
      '<li class="isotope-item {{estado}} {{partido}} {{cargo}}">' +
      '  <div class="card">' +
      '      <div class="front">' +
      '          <header>' +
      '              <div class="thumb"><img src="{{imagem}}" alt="{{nome}}" /></div>' +
      '              <h3>{{nome}} <span class="partido">{{partido}}</span></h3>' +
      '              <h4>{{cargo}} / {{estado}}</h4>' +
      '          </header>' +
      '          <ul class="badges">' +
      '              <li class="badge-badge1"></li>' +
      '          </ul>' +
      '      </div>' +
      '      <div class="back">' +
      '          <header>' +
      '              <h3>{{nome}} <span class="partido">{{partido}}</span></h3>' +
      '          </header>' +
      '          <ul class="badges">' +
      '              <li class="badge-badge1"></li>' +
      '          </ul>' +
      '          <ul class="features">' +
      '              <li>' +
      '                  <h4>atuação</h4>' +
      '                  <span class="bar"></span><span class="value">{{atributos.atuacao}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>processos</h4>' +
      '                  <span class="bar"></span><span class="value">{{atributos.processos}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>privilégios</h4>' +
      '                  <span class="bar"></span><span class="value">{{atributos.privilegios}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>assiduidade</h4>' +
      '                  <span class="bar"></span><span class="value">{{atributos.assiduidade}}</span>' +
      '              </li>' +
      '          </ul>' +
      '      </div>' +
      '  </div>' +
      '</li>';
    var _politicosURL = 'js/politicos.json'
    var _isotope;
    var _filters = {};

    this.init = function() {
      // menu
      var menu = new HomeMenu().init();
      menu.ee.addListener(menu.EVENT_FILTER, _onMenuFilter);

      // content
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
      $('.isotope').append(Mustache.to_html(_politicoTemplate, data));
    };

    var _startIsotope = function() {
      _isotope = new Isotope('.isotope', {
        itemSelector: '.isotope-item',
        transitionDuration: 0.2,
        layoutMode: 'masonry',
        masonry: {
          columnWidth: 206,
          gutter: 45
        }
      });

      // card flip
      $('.card').on('click', '.front, .back', function () {
        $(this).parent().toggleClass('flipped');
      });
    };
  };
  return Home;
});