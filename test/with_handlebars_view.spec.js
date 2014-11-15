/* global jasmine, spyOnEvent, loadFixtures, afterEach, beforeEach, Handlebars */

// load our compiled templates via define() deps
define(['handlebars', 'hbs/compiled', 'flight/lib/component', 'flight/lib/registry', 'src/with_handlebars_view'], function(handlebars, compiled, defineComponent, registry, mixin) {
    'use strict';

    window.Handlebars = handlebars.default || handlebars;

    var Component = (function() {

        // Test Component using mixin
        function TestComponent() {
            // include older style templates definition
            this.attributes({
                templates: {
                    'older': '#older-style'
                }
            });

            this.after('initialize', function() {
                // Setup some templates to use (via fixtures/*)
                this.templates({
                    'test': '#test',
                    'item-list': '#item-list',
                    'compiled': 'compiled',
                    'item': '#item',
                    'helpers': ['#helper-test', { noEscape: true }]
                });
                // define a helper
                this.templateHelpers({
                    'json': function(obj) {
                        // return JSON formatted object
                        return new Handlebars.SafeString(JSON.stringify(obj));
                    }
                });
            });
        }
        return defineComponent(TestComponent, mixin);
    })();

    // load templates fixture
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    describe("withHandlebarsView Mixin", function() {

        beforeEach(function() {
            loadFixtures('templates.html');
            this.component = (new Component).initialize($('#scratch'));
        });

        afterEach(function() {
            // this.component.teardown();
            Component.teardownAll();
        });

        it('should be defined', function() {
            expect(this.component).toBeDefined();
            expect(this.component.templates).toBeDefined();
        });

        it('can render a standard template', function() {
            // render a script template, passing local data
            var html = this.component.render('test', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
            console.log("[debug] html=" + html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('div.message');
        });

        it('can render older style \'attr\' templates work', function() {
            // render a script template, passing local data
            var html = this.component.render('older', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
            console.log("[debug] html=" + html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('div.message');
        });

        it('can render templates that include a partial', function() {
            // render a script template, passing local data
            var html = this.component.render('item-list', {
                'items': [
                    { description: 'one',   price: 10.00 },
                    { description: 'two',   price: 20.00 },
                    { description: 'three', price: 30.00 },
                    { description: 'four',  price: 40.00 },
                ]
            });
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('ul.items');
        });

        it('can render compiled templates', function() {
            var html = this.component.render('compiled', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
            console.log('[debug] html = ', html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('div.compiled-message');
        });

        it('should allow registered template helpers', function() {
            var html = this.component.render('helpers', {
                    data: {
                        s: 'a string',
                        d: 4.56,
                        arr: [1, 2, 3],
                        obj: {
                            s: 'a string',
                            d: 4.56,
                            arr: [1, 2, 3]
                        }
                    }
                });
            console.log('[debug] html = ', html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('script#config');
        });

    });
});
