'use strict';

var tests = Object.keys(window.__karma__.files).filter(function(file) {
    return (/\.spec\.js$/.test(file));
});


requirejs.config({
    // karam serves files from /base
    baseUrl: '/base',

    paths: {
        'flight': 'js/libs/flight',
        'handlebars': 'js/libs/handlebars',
        'hbs': 'test/fixtures'
    },

    shim: {
        handlebars: {
            exports: 'Handlebars'
        }
    },

    // Have require.js load our test files
    deps: tests,

    wrap: true,
    wrapShim: true,

    // start test run, once require.js is done
    callback: window.__karma__.start
});
