define(['jquery'], function ($) {
  var Header = function Header() {
    this.init = function() {
      // top menu mouse over/out
      $('.home .top-menu a').mouseover(function () {
        $('#head').addClass('hover')
      }).mouseout(function () {
        $('#head').removeClass('hover')
      });

      return this;
    }
  };
  return Header;
});