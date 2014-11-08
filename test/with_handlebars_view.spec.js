/* global jasmine, spyOnEvent, loadFixtures, afterEach, beforeEach */

// load our compiled templates via define() deps
define(['hbs/compiled', 'flight/lib/component', 'flight/lib/registry', 'src/with_handlebars_view'], function(compiled, defineComponent, registry, mixin) {
    'use strict';

    var Component = (function() {

        // Test Component using mixin
        function TestComponent() {
            this.after('initialize', function() {
                this.templates({
                    'test': '#test',
                    'item-list': '#item-list',
                    'compiled': 'compiled',
                    'item': '#item'
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

        it('via attributes from selector', function() {
            // render a script template, passing local data
            var html = this.component.render('test', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
            console.log("[debug] html=" + html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('div.message');
        });

        it('via attributes from selector with partial', function() {
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

        it('via compiled template name', function() {
            var html = this.component.render('compiled', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
            console.log('[debug] html = ', html);
            $('#scratch').append(html);
            expect($('#scratch')).toContainElement('div.compiled-message');
        });

    });
});
