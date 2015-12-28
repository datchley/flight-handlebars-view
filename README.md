# flight-handlebars-view

A [Flight](https://github.com/flightjs/flight) mixin for Handlebars templating with Components.

[![NPM](https://nodei.co/npm/flight-handlebars-view.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/flight-handlebars-view/)

[![Caffeine](http://img.shields.io/badge/caffeine%20level-low-yellow.svg)](http://theoatmeal.com/comics/coffee)

## Installation

With Bower:
```bash
$ bower install --save flight-handlebars-view
```

With npm:
```bash
$ npm install flight-handlebars-view --save-dev
```

## What is this?
This project provides a `mixin` for Flight.js components to use so they can implement all or part of their DOM behavior using [Handlebars.js](http://handlebarsjs.com/) client-side templates.  It is __not__ a Component by itself. 

A number of other flight templating mixins for Hogan, Mustache and others include a full Component piece along with a Mixin.  They do this to abstract the entire managing of templates to a data/utility type mixin that attaches to the DOM and then listens for requests for templates from UI Components.  The templates, rather their rendered html, is then sent back to the requesting UI Component via an event.

This approach has the drawback of tightly coupling the utility, template serving Component to any UI Component that wants to use the Mixin to render templates. Not to mention it makes us add another Component to the page and generate more events when the UI is rendering.

The approach taken here is to remove the data/utility Component all together, and thereby remove any dependency for other UI Components that want to use Handlebars templates to manage their DOM behavior.  Let the UI Component manage their templates directly, as you already have Handlebars included on the page in the first place.

## Requirements

This mixin can be used with Flight.js via [Require.js](http://requirejs.org/) or using standalone Flight.js.

You only need to include/require Handlebars.js library (_full or just the runtime if using only pre-compiled templates_) for this mixin to work.

## API

#### `Render({String}, {Object})`
Use the `with_handlebars_view` mixin.  The mixin provides any Component with a `render()` method.  Then render method has the following signature:

+ {string} _html_ = this->**render(**{string} _name_, {object} _context_**)**

Where:

+  **{string} _name_** - the property in `this.attr.templates` that references the specific template. A template can be referenced as any of the following:
    1. an inline, string template
    2. an '#' id selector referencing a template in a `<script>` tag
    3. the name of a pre-compiled template function
    
    any template may contain partials, and even inline string templates can be partials as long as their property name is referenced as the partial (_see example below_).
+ **{object} _context_** - an object containing the context data to be used to render the template.

#### `templates({Object})`
Use the `templates()` method to define the templates and partials that your component will use.

You can define templates that refer to external templates (*via `<script>` tags*), plain string/HTML templates and pre-compiled templates. For the first two, you can also pass in compile options for each template as well, which is the same object/options accepted by `Handlebars.compile()`.

**external `<script>` templates**
```javascript
this.after('initialize', function() {
	this.templates({
		// references <script id="hello" ...>
		'hello':  '#hello',   
		// with Handlebars.compile options
		'users': [ '#user-list',  { noEscape:  true }]   
	});
});
```
**string/html templates**
```javascript
this.after('initialize', function() {
	this.templates({
		'hello':  '<h1>{{greeting}}</h1>',   
		'user': [ '<li>{{name}} - {{age}}</li>',  { noEscape:  true }]
	});
});
```
**pre-compiled templates**
You can load your pre-compiled templates however you like, just use the actual template name as the value for the template property you setup.  Pre-compiled templates can be setup as an array passing in compile options, as they're already compiled on the server side.
```javascript
this.after('initialize', function() {
	this.templates({	
		// references Handlebars.templates.hello
		'hello':  'hello',   
	});
});
```
#### `templateHelpers({Object})`
Use the `templateHelpers()` method to define Handlebars helpers to be used in your templates.  Be sure and set these up before calling `render()` in your component.

Helpers are passed in as an object, where the property name is the Handlebars helper name to use. For example:
```javascript
this.templateHelpers({
    'json': function(obj) {
        // return JSON formatted object
        return new Handlebars.SafeString(JSON.stringify(obj));
    }
});
```

### [deprecated] Define templates via attributes

> Defining templates via `this.defaultAttrs()` of `this.attributes()`in the `templates` property is
> deprecated; but will still work.  Use the `templates()`method to
> define the templates for your component.

 
Examples of deprecated way of setting up templates via a components attributes:

```javascript
this.defaultAttrs({
 templates: { /*...*/  }
});
```

```javascript
this.attributes({
	templates: { /*...*/  }
});
```



## Example Usage
The following gives an example shows each of the above use-cases within one UI Component.

Example using Flight standalone:
```html
    <!-- 1.) load pre-compiled templates from external file (from list-component.hbs) -->
    <script src="pre-compiled.js"></script>
    
    <!-- 2.) handlebars templates via SCRIPT tags (w/ partial) -->
    <script id="list" type="text/x-template-handlebars">
        <ul>
            {{> item}}
        </ul>
    </script>
    
    <!-- component node -->
    <div id="list-component">
    </div>
    
    <!-- Define a component using this mixin -->
    <script>
        var ListComponent = (function() {
        
          return flight.component(function() {
            this.defaultAttrs({
              title: '',
              items: []
            });
        
            this.after('initialize', function() {
              this.templates({
                // string literal, used as partial {{> item }}
                item: '<li>{{description}} - $<b>{{price}}<\/b><\/li>',
                // pre-compiled template loaded externally
                main: 'list-component',
                // template via <script> tag id selector
                list: '#list'
              });
              
              this.$node.html(this.render('main', this.attr));
              this.$node.append(this.render('list', this.attr));
            });
          }, withHandlebarsView);
          
        })();
        
        <!-- Attach component to DOM -->
        ListComponent.attachTo('#list-component', {
            title: 'My List',
            items: [
                { description: 'one', price: 10.00 },
                { description: 'two', price: 20.00 }
            ]
        });
    </script>

```


## Development

Development of this component requires [Bower](http://bower.io), and preferably
[Karma](http://karma-runner.github.io) to be globally installed:

```bash
npm install -g bower karma
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install
bower install
```

To continuously run the tests in Chrome and Firefox during development, just run:

```bash
karma start
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

