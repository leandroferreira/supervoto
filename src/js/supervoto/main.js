define(['jquery', 'supervoto/header', 'supervoto/home'], function ($, Header, Home) {
  $(function () {
    var header = new Header().init();
    var home = new Home().init();
  });

  return;
});