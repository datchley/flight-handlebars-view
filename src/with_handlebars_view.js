/* global Handlebars */
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // latest AMD Handlebars sets up in the 'default' property
        define(['handlebars'], function(Handlebars) {
            return factory(Handlebars.default||Handlebars);
        });
    }
    else if (typeof exports === 'object') {
        module.exports = factory(Handlebars);
    }
    else {
        root.withHandlebarsView = factory(Handlebars);
    }
}(this, function(Handlebars) {
    'use strict';

    var rePartials = /(?:{{>\s*([^}]+)\s*}})/g,
        reId = /^#/,
        isPrecompiled = function(name) {
            return !!(typeof Handlebars.templates !== 'undefined' && Handlebars.templates[name]);
        },
        isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };

    function withHandlebarsView() {
        // Default attribute examples:
        //     templates: {
        //         'test': ['#test', { noEscape: true }],  - A selector id referencing a <script id="test" type="text/x-template-handlebars"></script>
        //         'test2': 'test2', - name of a precompiled template that was loaded
        //         'test3': '<p>{{greeting}}, {{name}}</p>' - an inline, string html template
        //     }
        // 

        // cache template functions after compiling/first-use
        this.attributes.templates = null;

        // cache template functions after compiling/first-use
        this.__templates__ = {};

        this.render = function(name, data) {
            var context = data || {},
                template = this.attr.templates[name] || name;

            // add to cache if we haven't already
            if (!this.__templates__[name]) {
                if (isPrecompiled(template)) {
                    // pre-compiled, so just cache the template function
                    this.__templates__[name] = Handlebars.templates[template];
                }
                else {
                    var markup,
                        options = {},
                        matches;

                    if (isArray(template)) {
                        // array with compile options
                        options = template[1];
                        template = template[0];
                    }

                    // not compiled, we'll need to compile the template
                    // and cache it as well.
                    if (reId.test(template)) {
                        // a template via <script> tag and #id
                        markup = $(template).html();
                        if (!markup) {
                            throw new Error("error: Handlebars: template with id '#" + template + "' is not defined");
                        }
                    }
                    else {
                        // an inline, HTML template
                        markup = template;
                    }

                  // Look for and pre-compile/cache any partials
                    while ((matches = rePartials.exec(markup)) !== null) {
                        var pname = matches[1],
                            pmarkup;

                        // Register this partial if not found
                        if (!Handlebars.partials[pname]) {
                            var poptions = {};
                            if (isPrecompiled(pname)) {
                                pmarkup = Handlebars.templates[pname];
                            }
                            else if (reId.test(pname)) {
                                pmarkup = $('#'+pname).html();
                            }
                            else {
                                // grab it from attr.templates
                                pmarkup = this.attr.templates[pname];
                                if (isArray(pmarkup)) {
                                    poptions = pmarkup[1];
                                    pmarkup = pmarkup[0];
                                }
                            }
                            Handlebars.registerPartial(pname, pmarkup, poptions);
                        }
                    }
                    // cache the compiled template function
                    this.__templates__[name] = Handlebars.compile(markup, options);
                }
            }
            // return the rendered html using the passed context
            return this.__templates__[name](context);
        };
    }

    return withHandlebarsView;

}));
