define(['jquery', 'isotope'], function ($, Isotope) {
  var Home = function Home() {

    this.init = function() {
      var isotope = new Isotope('#home>.content>ul', {
        itemSelector: '.card',
        layoutMode: 'fitRows',
        transitionDuration: 0.2
      });

      return this;
    }
  };
  return Home;
});