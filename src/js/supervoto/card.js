define(['jquery', 'mustache', 'EventEmitter', 'supervoto/config'], function ($, Mustache, EventEmitter, Config) {
  var Card = function Card() {
    var thisObj = this;

    this.EVENT_FLIPPED = 'cardFlipped';
    this.EVENT_SELECT_FEATURE = 'selectedFeature';

    this.MODE_SELECTED_FIRST = 'selectedFirst';
    this.MODE_SELECTED_LAST = 'selectedLast';
    this.MODE_DEFAULT = 'default';
    this.MODE_FINAL = 'final';

    this.elm;
    this.ee = new EventEmitter();

    var _isSelected = false;
    var _isFinalized = false;
    var _originalPosition;

    var _card, _id;

    var _template = '' +
      '<li class="card-item {{estado}} {{partido}} {{cargo}}" data-index="{{index}}" data-forca="{{forca}}" data-atuacao="{{atributos.atuacao.value}}" data-processos="{{atributos.processos.value}}" data-privilegios="{{atributos.privilegios.value}}" data-assiduidade="{{atributos.assiduidade.value}}">' +
      '  <div class="card" data-id="{{id}}">' +
      '      <div class="front">' +
      '          <header>' +
      '              <div class="thumb"><img src="" data-src="{{fotos}}" alt="{{nome}}" /></div>' +
      '              <h3><span class="nome">{{nome}}</span> <span class="partido">{{partido}}</span></h3>' +
      '              <h4>{{cargo}} / {{estado}}</h4>' +
      '          </header>' +
      '          <ul class="badges badges-small">{{#badges}}<li class="badges-small-{{id}}"><div class="tooltip"><h3>{{name}}</h3><p>{{desc}}</p></div></li>{{/badges}}</ul>' +
      '          <ul class="badges badges-big">{{#badges}}<li class="badges-big-{{id}}"><div class="tooltip"><h3>{{name}}</h3><p>{{desc}}</p></div><</li>{{/badges}}</ul>' +
      '      </div>' +
      '      <div class="back">' +
      '          <header>' +
      '              <h3><span class="nome">{{nome}}</span> <span class="partido">{{partido}}</span></h3>' +
      '          </header>' +
      '          <ul class="badges badges-small">{{#badges}}<li class="badges-small-{{id}}"><div class="tooltip"><h3>{{name}}</h3><p>{{desc}}</p></div></li>{{/badges}}</ul>' +
      '          <ul class="badges badges-big">{{#badges}}<li class="badges-big-{{id}}"><div class="tooltip"><h3>{{name}}</h3><p>{{desc}}</p></div><</li>{{/badges}}</ul>' +
      '          <ul class="features">' +
      '              <li data-id="atuacao">' +
      '                  <h4>atuação</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.atuacao.middleClass}} {{atributos.atuacao.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.atuacao.percent}}%; margin-left: {{atributos.atuacao.margin}};"></span></span>' +
      '                  <span class="value atuacao">{{atributos.atuacao.value}}</span>' +
      '              </li>' +
      '              <li data-id="processos">' +
      '                  <h4>processos</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.processos.middleClass}} {{atributos.processos.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.processos.percent}}%; margin-left: {{atributos.processos.margin}};"></span></span>' +
      '                  <span class="value processos">{{atributos.processos.value}}</span>' +
      '              </li>' +
      '              <li data-id="privilegios">' +
      '                  <h4>privilégios</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.privilegios.middleClass}} {{atributos.privilegios.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.privilegios.percent}}%; margin-left: {{atributos.privilegios.margin}};"></span></span>' +
      '                  <span class="value privilegios">{{atributos.privilegios.value}}</span>' +
      '              </li>' +
      '              <li data-id="assiduidade">' +
      '                  <h4>assiduidade</h4>' +
      '                  <span class="bar-container"><span class="bar {{atributos.assiduidade.middleClass}} {{atributos.assiduidade.ratingClass}} {{atributos.atuacao.negativeClass}}" style="width: {{atributos.assiduidade.percent}}%; margin-left: {{atributos.assiduidade.margin}};"></span></span>' +
      '                  <span class="value assiduidade">{{atributos.assiduidade.value}}</span>' +
      '              </li>' +
      '          </ul>' +
      '      </div>' +
      '  </div>' +
      '</li>';

    this.init = function(data, index) {
      if (!Card._atributos) {
        _setupAtributos();
      }

      this.data = data;
      this.data.cargo = this.data.cargo.toLowerCase();
      this.data.nome = _removerAcentos(this.data.nome);
      _setupBadges();
      this.elm = $(_draw(data, index));

      _card = $('.card', this.elm);
      _id = _card.attr('data-id');

      // card flip
      this.elm.on('click', '.front, .back', _onPressCard);

      // feature select
      this.elm.on('click', '.features li', _onPressFeature);

      return this;
    };

    this.setMode = function(mode) {
      switch (mode) {
        case this.MODE_SELECTED_FIRST:
          this.elm.addClass('selected first');
          _isSelected = true;
        break;
        case this.MODE_SELECTED_LAST:
          this.elm.addClass('selected last');
          $('.card', this.elm).addClass('immediate');
          $('.card', thisObj.elm).removeClass('flipped');
          setTimeout(function() {
            $('.card', thisObj.elm).removeClass('immediate');
          }, 1);
          _isSelected = true;
        break;
        case this.MODE_DEFAULT:
          this.elm.removeClass('selected first last final');
          $('.features li', this.elm).removeClass('selected');
          _card.removeClass('winner');
          _isSelected = false;
          _isFinalized = false;
        case this.MODE_FINAL:
          this.elm.addClass('final');
          _isFinalized = true;
        break;
      }
    };

    // set elements parent and change position so it stays on the same global pos
    this.moveToElement = function(parent) {
      var parentOffset = parent.offset();
      var offset = this.elm.offset();

      _originalPosition = {
        left: this.elm.css('left'),
        top: this.elm.css('top')
      };

      this.elm.css('left', offset.left - parentOffset.left);
      this.elm.css('top', offset.top - parentOffset.top);

      this.elm.appendTo(parent);
    };

    // go back to previous element
    this.moveBackToElement = function(parent) {
      this.elm.css('left', _originalPosition.left);
      this.elm.css('top', _originalPosition.top);

      this.elm.appendTo(parent);
    };

    // toggle flip
    this.flip = function() {
      _flipCard();
    };

    // force to unflipped
    this.unflip = function() {
      _card.removeClass('flipped');
    };

    this.selectFeature = function(feature) {
      $('.features li[data-id="' + feature + '"]', this.elm).addClass('selected');
    };

    // render as winner
    this.setWinner = function() {
      _card.addClass('winner');
    };

    this.hide = function() {
      this.elm.hide();
    };

    var _setupBadges = function() {
      var badges = thisObj.data.badges;

      if (!isNaN(badges)) badges = thisObj.data.badges = [badges];

      // set badge by index (should be same as id)
      for(var i = 0; i < badges.length; i ++) {
        badges[i] = Config.badges[badges[i] - 1];
      };

      thisObj.data.badges = badges;
    };

    var _setupAtributos = function() {
      Card._atributos = {};
      var attr;
      for(var i = 0; i < Config.atributos.length; i ++) {
        attr = Config.atributos[i];
        Card._atributos[attr.id] = {
          name: attr.name,
          isMiddle: attr.min < 0 && attr.max > 0,
          isNegative: attr.min < 0 && attr.max === 0,
          min: attr.min,
          max: attr.max
        };
      }
    };

    var _draw = function(data, index) {
      // add custom data for atributos
      var attr;
      var percent, finalPercent;
      var ratings = ['bad', 'neutral', 'good'];
      data.index = index;
      for(var item in data.atributos) {
        attr = Card._atributos[item];
        percent = 100 * (data.atributos[item] - attr.min) / (attr.max - attr.min);
        percent = Math.max(Math.min(percent, 100), 0);
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

      return Mustache.to_html(_template, data);
    };

    var _onPressCard = function() {
      if (!_isSelected) {
        _flipCard();
        thisObj.ee.emitEvent(thisObj.EVENT_FLIPPED, [_id, !_card.hasClass('flipped')]);
      }
    };

    var _onPressFeature = function(event) {
      if (_isSelected && !_isFinalized) {
        var feature = $(event.currentTarget);
        thisObj.ee.emitEvent(thisObj.EVENT_SELECT_FEATURE, [_id, feature.attr('data-id')]);
      }
    };

    var _flipCard = function() {
      _card.toggleClass('flipped');
    };

    // https://gist.github.com/marioluan/6923123
    var _removerAcentos = function(newStringComAcento) {
      var string = newStringComAcento;
      var mapaAcentosHex  = {
        a : /[\xE0-\xE6]/g,
        e : /[\xE8-\xEB]/g,
        i : /[\xEC-\xEF]/g,
        o : /[\xF2-\xF6]/g,
        u : /[\xF9-\xFC]/g,
        c : /\xE7/g,
        n : /\xF1/g
      };

      for ( var letra in mapaAcentosHex ) {
        var expressaoRegular = mapaAcentosHex[letra];
        string = string.replace( expressaoRegular, letra );
      }

      return string;
    };
  };
  return Card;
});