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
      '                  <span class="bar-container"><span class="bar {{atributos.atuacao.middleClass}} {{atributos.atuacao.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.atuacao.percent}}%; margin-left: {{atributos.atuacao.margin}};"></span></span>' +
      '                  <span class="value atuacao">{{atributos.atuacao.value}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>processos</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.processos.middleClass}} {{atributos.processos.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.processos.percent}}%; margin-left: {{atributos.processos.margin}};"></span></span>' +
      '                  <span class="value processos">{{atributos.processos.value}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>privilégios</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.privilegios.middleClass}} {{atributos.privilegios.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.privilegios.percent}}%; margin-left: {{atributos.privilegios.margin}};"></span></span>' +
      '                  <span class="value privilegios">{{atributos.privilegios.value}}</span>' +
      '              </li>' +
      '              <li>' +
      '                  <h4>assiduidade</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.assiduidade.middleClass}} {{atributos.assiduidade.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.assiduidade.percent}}%; margin-left: {{atributos.assiduidade.margin}};"></span></span>' +
      '                  <span class="value assiduidade">{{atributos.assiduidade.value}}</span>' +
      '              </li>' +
      '          </ul>' +
      '      </div>' +
      '  </div>' +
      '</li>';
    var _politicosURL = 'js/politicos.json'
    var _isotope;
    var _filters = {};
    var _atributos;

    this.init = function() {
      // menu
      var menu = new HomeMenu().init();
      menu.ee.addListener(menu.EVENT_FILTER, _onMenuFilter);
      menu.ee.addListener(menu.EVENT_SORT, _onMenuSort);

      _setupAtributos();
      _loadPoliticos();

      return this;
    };

    var _setupAtributos = function() {
      _atributos = {};
      var attr;
      for(var i = 0; i < window.config.atributos.length; i ++) {
        attr = window.config.atributos[i];
        _atributos[attr.id] = {
          name: attr.name,
          isMiddle: attr.min < 0 && attr.max > 0,
          isNegative: attr.min < 0 && attr.max === 0,
          min: attr.min,
          max: attr.max
        };
      }
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
      // add custom data for atributos
      var attr;
      var percent, finalPercent;
      var ratings = ['bad', 'neutral', 'good'];
      for(var item in data.atributos) {
        attr = _atributos[item];
        percent = 100 * (data.atributos[item] - attr.min) / (attr.max - attr.min);
        finalPercent = attr.isNegative ? 100 - percent : percent;
        finalPercent = attr.isMiddle ? finalPercent - 50 : finalPercent;
        data.atributos[item] = {
          value: data.atributos[item],
          middleClass: attr.isMiddle ? 'middle' : '',
          ratingClass: attr.isNegative ? ratings[0] : ratings[Math.min(Math.floor(percent / 100 * ratings.length), ratings.length - 1)],
          negativeClass: finalPercent < 0 ? 'negative' : '',
          margin: attr.isMiddle && finalPercent < 0 ? finalPercent + '%' : 0,
          percent: Math.abs(finalPercent)
        };
      }

      $('.isotope').append(Mustache.to_html(_politicoTemplate, data));
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

      // card flip
      $('.card').on('click', '.front, .back', function () {
        $(this).parent().toggleClass('flipped');
      });
    };
  };
  return Home;
});