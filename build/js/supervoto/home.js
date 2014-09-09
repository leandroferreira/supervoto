define(['jquery', 'isotope'], function ($, Isotope) {
  var Home = function Home() {

    this.init = function() {
      var isotope = new Isotope('#home>.content>ul', {
        itemSelector: '.card',
        transitionDuration: 0.2,
        layoutMode: 'masonry',
        masonry: {
          columnWidth: 206,
          gutter: 45
        }
      });

      $('.card').on('mousedown', function () {
        console.log(this)
        $(this).toggleClass('flipped');
      });

      return this;
    }
  };
  return Home;
});