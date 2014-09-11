require.config({
  baseUrl: 'js/lib',
  paths: {
    supervoto: '../supervoto',
    jquery: '//code.jquery.com/jquery-2.1.1.min',
    isotope: 'isotope/dist/isotope.pkgd.min',
    mustache: 'mustache/mustache'
  },
  shim: {
    jquery: {exports: '$'}
  },
});

requirejs(['supervoto/main']);