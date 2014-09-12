require.config({
  // urlArgs: "bust=" + new Date().getTime(), // DEV
  baseUrl: 'js/lib',
  paths: {
    supervoto: '../supervoto',
    jquery: '//code.jquery.com/jquery-2.1.1.min',
    isotope: 'isotope/dist/isotope.pkgd.min',
    mustache: 'mustache/mustache',
    EventEmitter: 'eventEmitter/EventEmitter.min'
  },
  shim: {
    jquery: {exports: '$'}
  },
});

requirejs(['supervoto/main']);