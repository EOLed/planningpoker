'use strict';

module.exports = function (config) {
  config.set({
    // Karma configuration

    // base path, that will be used to resolve files and exclude
    basePath: 'app',

    // list of files / patterns to load in the browser
    files: [
      'bower_components/sinonjs/sinon.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/socket.io-client/dist/socket.io.js',
      'vendors/*.js',
      'scripts/*.js',
      'scripts/**/*.js',
      'views/directives/*.html',
      // 'test/mock/**/*.js',
      '../test/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    frameworks: ['jasmine'],

    // test results reporter to use
    // possible values: dots || progress || growl
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'text',
      dir: 'coverage/'
    },

    preprocessors: {
      'scripts/**/*.js': 'coverage',
      'views/directives/*.html': 'html2js'
    },

    // web server port
    port: 8080,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it captureTimeout = 5000; // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
