require.config({
  // urlArgs: "bust=" + new Date().getTime(), // DEV
  baseUrl: 'js/lib',
  paths: {
    supervoto: '../supervoto',
    jquery: '//code.jquery.com/jquery-2.1.1.min',
    isotope: 'isotope/dist/isotope.pkgd',
    'cells-by-row': 'isotope-cells-by-row/cells-by-row',
    mustache: 'mustache/mustache',
    EventEmitter: 'eventEmitter/EventEmitter.min',
    unveil: 'unveil/jquery.unveil.min'
  },
  shim: {
    jquery: {exports: '$'},
    unveil: ['jquery']
  },
});

requirejs(['supervoto/main']);