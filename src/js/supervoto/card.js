define(['jquery', 'mustache', 'EventEmitter'], function ($, Mustache, EventEmitter) {
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
      '<li class="card-item {{estado}} {{partido}} {{cargo}}">' +
      '  <div class="card" data-id="{{id}}">' +
      '      <div class="front">' +
      '          <header>' +
      '              <div class="thumb"><img src="" data-src="{{fotos}}" alt="{{nome}}" /></div>' +
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

      var _estados = {
        'Acre': 'AC',
        'Alagoas': 'AL',
        'Amazonas': 'AM',
        'Amapá': 'AP',
        'Bahia': 'BA',
        'Ceará': 'CE',
        'Distrito Federal': 'DF',
        'Espirito Santo': 'ES',
        'Goiás': 'GO',
        'Maranhão': 'MA',
        'Minas Gerais': 'MG',
        'Mato Grosso do Sul': 'MS',
        'Mato Grosso': 'MT',
        'Pará': 'PA',
        'Paraíba': 'PB',
        'Pernambuco': 'PE',
        'Piauí': 'PI',
        'Paraná': 'PR',
        'Rio de Janeiro': 'RJ',
        'Rio Grande do Norte': 'RN',
        'Rondônia': 'RO',
        'Roraima': 'RR',
        'Rio Grande do Sul': 'RS',
        'Santa Catarina': 'SC',
        'Sergipe': 'SE',
        'São Paulo': 'SP',
        'Tocantins': 'TO'
      };

    this.init = function(data) {
      if (!Card._atributos) {
        _setupAtributos();
      }

      this.data = data;
      this.data.cargo = this.data.cargo.toLowerCase();
      this.data.partido = this.data.partido.split(' - ')[0];
      this.data.estado = _estados[this.data.estado];
      this.elm = $(_draw(data));

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
          _card.removeClass('winner');
          _isSelected = false;
        case this.MODE_FINAL:
          this.elm.addClass('final');
        break;
      }
    };

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

    this.moveBackToElement = function(parent) {
      this.elm.css('left', _originalPosition.left);
      this.elm.css('top', _originalPosition.top);

      this.elm.appendTo(parent);
    };

    this.flip = function() {
      _flipCard();
    };

    this.unflip = function() {
      _card.removeClass('flipped');
    };

    this.selectFeature = function(feature) {
      $('li[data-id="' + feature + '"]', this.elm).addClass('selected');
    };

    this.setWinner = function() {
      _card.addClass('winner');
    };

    this.hide = function() {
      this.elm.hide();
    };

    var _setupAtributos = function() {
      Card._atributos = {};
      var attr;
      for(var i = 0; i < window.config.atributos.length; i ++) {
        attr = window.config.atributos[i];
        Card._atributos[attr.id] = {
          name: attr.name,
          isMiddle: attr.min < 0 && attr.max > 0,
          isNegative: attr.min < 0 && attr.max === 0,
          min: attr.min,
          max: attr.max
        };
      }
    };

    var _draw = function(data) {
      // add custom data for atributos
      var attr;
      var percent, finalPercent;
      var ratings = ['bad', 'neutral', 'good'];
      for(var item in data.atributos) {
        attr = Card._atributos[item];
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

      return Mustache.to_html(_template, data);
    };

    var _onPressCard = function() {
      if (!_isSelected) {
        _flipCard();
        thisObj.ee.emitEvent(thisObj.EVENT_FLIPPED, [_id, !_card.hasClass('flipped')]);
      }
    };

    var _onPressFeature = function(event) {
      if (_isSelected) {
        var feature = $(event.currentTarget);
        thisObj.ee.emitEvent(thisObj.EVENT_SELECT_FEATURE, [_id, feature.attr('data-id')]);
      }
    };

    var _flipCard = function() {
      _card.toggleClass('flipped');
    };
  };
  return Card;
});