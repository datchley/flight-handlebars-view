(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['handlebars'], function(Handlebars) {
            return factory(Handlebars.default);
        });
    }
    else if (typeof exports === 'object') {
        module.exports = factory(Handlebars);
    }
    else {
        root.returnExports = factory(Handlebars);
    }
}(this, function(Handlebars) {
    'use strict';

    var rePartials = /(?:{{>\s*([^}]+)\s*}})/g,
        reId = /^#/,
        isPrecompiled = function(name) {
          return !!(typeof Handlebars.templates !== 'undefined' && Handlebars.templates[name]);
        };

    function withHandlebarsView() {
        // this.defaultAttrs({
        //     templates: {
        //         'test': '#test'  - A selector id referencing a <script id="test" type="text/x-template-handlebars"></script>
        //         'test2': 'test2' - name of a precompiled template that was loaded
        //         'test3': '<p>{{greeting}}, {{name}}</p>' - an inline, string html template
        //     }
        // });

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
                  // not compiled, we'll need to compile the template
                  // and cache it as well.
                  var markup = reId.test(template) ? $(template).html() : template,
                      matches;

                  // Look for and pre-compile/cache any partials
                  while ((matches = rePartials.exec(markup)) !== null) {
                    var pname = matches[1],
                        pmarkup;

                    // Register this partial if not found
                    if (!Handlebars.partials[pname]) {
                      if (isPrecompiled(pname)) {
                        pmarkup = Handlebars.tempaltes[pname];
                      }
                      else if (reId.test(pname)) {
                        pmarkup = $('#'+pname).html();
                      }
                      else {
                        // grab it from attr.templates
                        pmarkup = this.attr.templates[pname];
                      }
                      Handlebars.registerPartial(pname, pmarkup);
                    }
                  }
                  // cache the compiled template function
                  this.__templates__[name] = Handlebars.compile(markup);
                }
            }
            // return the rendered html using the passed context
            return this.__templates__[name](context);
        };
    }

    return withHandlebarsView;

}));
