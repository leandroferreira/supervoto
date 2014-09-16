define(['jquery', 'mustache', 'EventEmitter'], function ($, Mustache, EventEmitter) {
  var Card = function Card() {
    var thisObj = this;

    this.EVENT_FLIPPED = 'cardFlipped';

    this.MODE_SELECTED_FIRST = 'selectedFirst';
    this.MODE_SELECTED_LAST = 'selectedLast';

    this.elm;
    this.ee = new EventEmitter();

    var _template = '' +
      '<li class="isotope-item {{estado}} {{partido}} {{cargo}}">' +
      '  <div class="card" data-id="{{id}}">' +
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

    this.init = function(data) {
      if (!Card._atributos) {
        _setupAtributos();
      }

      this.data = data;
      this.elm = $(_draw(data));

      // card flip
      this.elm.on('click', '.front, .back', _onCardFlip);

      return this;
    };

    this.setMode = function(mode) {
      switch (mode) {
        case this.MODE_SELECTED_FIRST:
          this.elm.addClass('selected');
        break;
        case this.MODE_SELECTED_LAST:
          this.elm.addClass('selected');
          $('.card', this.elm).removeClass('flipped');
        break;
      }
    }

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

    var _onCardFlip = function(event) {
      var card = $(event.currentTarget).parent();
      var id = card.attr('data-id');

      card.toggleClass('flipped');
      thisObj.ee.emitEvent(thisObj.EVENT_FLIPPED, [id, !card.hasClass('flipped')]);
    };
  };
  return Card;
});