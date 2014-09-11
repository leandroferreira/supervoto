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

      $('.card').on('click', '.front, .back', function () {
        $(this).parent().toggleClass('flipped');
      });

      return this;
    }
  };
  return Home;
});