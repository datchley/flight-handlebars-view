/* global jasmine, spyOnEvent, loadFixtures */

// load our compiled templates via define() deps
define(['hbs/compiled'], function(compiled) {
    'use strict';

    describeMixin('src/with_handlebars_view', function() {

        // load templates fixture
        jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

        beforeEach(function() {
            // Setup our test template references as defaults
            this.setupComponent({
                'templates': {
                    'test': '#test',
                    'item-list': '#item-list',
                    'compiled': 'compiled',
                    'item': '#item'
                }
            });
            loadFixtures('templates.html');
        });

        it('should be defined', function() {
            expect(this.component).toBeDefined();
        });

        it('via attributes from selector', function() {
            // render a script template, passing local data
            var html = this.component.render('test', {
                'name': 'Dave',
                'greeting': 'Welcome to Flight'
            });
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
