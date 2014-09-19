require.config({
  // urlArgs: "bust=" + new Date().getTime(), // DEV
  baseUrl: 'js/lib',
  paths: {
    supervoto: '../supervoto',
    jquery: '//code.jquery.com/jquery-2.1.1.min',
    mustache: 'mustache/mustache',
    EventEmitter: 'eventEmitter/EventEmitter.min',
    'jquery-unveil': 'jquery-unveil/jquery.unveil'
  },
  shim: {
    jquery: {exports: '$'},
    'jquery-unveil': ['jquery']
  },
});

requirejs(['supervoto/main']);