// Karma configuration
// Generated on Fri Oct 17 2014 10:40:43 GMT-0500 (CDT)

module.exports = function(config) {
    'use strict';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',



        // list of files / patterns to load in the browser
        files: [
            // loaded without require
            'js/libs/jquery/dist/jquery.js',
            'js/libs/jasmine-jquery/lib/jasmine-jquery.js',
            'js/libs/jasmine-flight/lib/jasmine-flight.js',

            // { pattern: 'js/libs/es5-shim/es5-shim.js', inlcuded: false },
            // { pattern: 'js/libs/es5-shim/es5-sham.js', inlcuded: false },
            { pattern: 'js/libs/handlebars/handlebars.amd.js', inlcuded: false },
            { pattern: 'js/libs/flight/**/*js', included: false},
            { pattern: 'src/*.js', included: false},
            { pattern: 'test/**/*.spec.js', included: false},

            // html fixtures jasmine-jquery
            {
                pattern: 'test/fixtures/*.html',
                watched: true,
                included: false,
                served: true
            },
            {
                pattern: 'test/fixtures/*.js',
                watched: true,
                included: false,
                served: true
            },

            'test/test-main.js',
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // NOTE: Travis.ci doesn't support escape sequences, use 'dots'
        reporters: [ process.env.TRAVIS ? 'dots' : 'progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'], //, 'Chrome', 'Firefox'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
