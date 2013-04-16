*  [Introduction](#introduction)
*  [Quick Start Tutorial](#quick-start-tutorial)
  *  [Setting up a Development Environment](#setting-up-a-development-environment)
  *  [Creating a Searchlight Bookmarklet](#creating-a-bookmarklet)
  *  [Creating a Searchlight Widget](#creating-a-widget)
  *  [Writing a Search Module](#writing-a-search-module)
  *  [Querying a search index](#querying-a-search-index)
  *  [Populating the ResultSet](#populating-the-result-set)
  *  [Finishing Up](#finishing-up)
*  [Dependencies](#dependencies)
  *  [Client](#client)
  *  [Server](#server)
*  [Directory Structure](#directory-structure)
*  [Objects Available to the Search Module](#objects-available-to-your-search-module)
  *  [SearchableDocument](#searchabledocument)
     *  [Properties](#properties)
     *  [Methods](#methods)
     *  [Extending the SearchableDocument object](#extending-the-searchabledocument-object)
  *  [ResultSet](#resultset)
     *  [Properties](#properties-1)
     *  [Methods](#methods-1)
*  [Making Requests to a search index](#making-requests-to-a-search-index)
  *  [The Request Module](#the-request-module)
*  [Creating a custom view template](#creating-a-custom-view-template)
*  [Public Assets (stylesheets, javascript, images)](#public-assets-stylesheets-javascript-images)
*  [Custom Client Side Behavior](#custom-client-side-behavior)
*  [Building the Front End](#building-the-front-end)
*  [Error Handling](#error-handling)
  *  [Handling an Error](#handling-an-error)
  *  [Error Logging](#error-logging)
*  [Deploying the App](#deployment)


<a name="introduction"></a>
#Introduction
[Searchlight](https://www.github.com/ragle/searchlight) is a simple application development framework that allows any organization with a VIVO database to quickly and easily deploy a VIVO searchlight application of their own.

To learn more about VIVO searchlight apps and see a demo, check out our [about page](http://about.vivosearchlight.org).

While searchlight is a node.js application, it was designed to abstract away as much node / JavaScript specific domain knowledge as possible - as many developers working on the VIVO project may not be familiar with JavaScript (especially on the server).

<a name="quick-start-tutorial"></a>
#Quick Start Tutorial

<a name="setting-up-a-development-environment"></a>
###Setting up a Development Environment (Linux)
For Mac or Windows specific dev environments, please see the [node](http://nodejs.org/api/index.html), [git](http://git-scm.com/documentation) and [NPM](https://npmjs.org/doc/) documentation. 

*  [Install node.js version 0.8.12](https://github.com/joyent/node/wiki/Installation#building-on-gnulinux-and-other-unix)
*  ```$ git clone http://git.github.com/ragle/searchlight```
*  ```$ cd searchlight```
*  ```$ npm install```

---
<a name="creating-a-bookmarklet"></a>
###Creating a Bookmarklet

Below is the world's simplest HTML document. You'll probably want to create a better landing page than this ([see our demo](http://about.vivosearchlight.org)), but for testing, this works. 

Simply create an HTML document using the code below, navigate to the document in your browser, and drag the link you see up to your browser's bookmark bar. 

```html
<html>
  <head></head>
  <body>
    <h1>My Great Searchlight App!</h1>
    <p> Drag the link below to your browser's bookmark bar to install the bookmarklet!</p>
    <a href="javascript:(function(){var bar=document.getElementById('vivoSearchLightFrame');if(!bar){bar=document.createElement('div');bar.setAttribute('id','vivoSearchLightFrame');document.getElementsByTagName('body')[0].appendChild(bar);var script=document.createElement('SCRIPT');script.type='text/javascript';script.src='127.0.0.1:3000/javascripts/loader.js';document.getElementsByTagName('head')[0].appendChild(script)}else if(bar.toggle!==undefined){bar.toggle()}})();">VIVO Searchlight</a>
  </body>
</html>
```
Bookmarklet view templates exist already for you for the "skin" of both the bookmarklet (UI) and the result sets (VIVO profiles). These can be found in ```views/bar-iframe.html``` and ```views/results-iframe.html``` respectively.

The default UI and result set views are automatically managed and rendered for you on each request - but if you want to customize them check out the section on [creating custom views](#creating-a-custom-view-template). 

---
<a name="creating-a-widget"></a>
###Creating a Widget

You might also like to use a searchlight widget on one of your organization's pages. For example, you may have a news page that is updated regularly and you'd like to always display VIVO profiles relevant to your latest updates. 

Below is a very simple (and rather ugly) example of an HTML document with an embedded searchlight widget. You can deploy as many widgets as you'd like, in concert with the bookmarklet app.

```html
<html>
  <head>
  <style>
    #vsl-widget-frame{
      width:700px;
      height:100px;
      border: red dashed 8px;
      background-color: yellow; 
    }
  </style>
  </head>
  <body>
    <h1>My Great Searchlight Widget!</h1>
    <h3> Here is some news about my organization!</h3>
    <p> Today, scientists discovered that by doing experiments and other research, they could learn a lot about the world around them.</p> 
    <div id="vsl-widget-frame"></div>
    <script>
      (function(){var script=document.createElement('SCRIPT');script.type='text/javascript';script.src='http://127.0.0.1:3000/javascripts/loader.js';document.getElementsByTagName('head')[0].appendChild(script)})();
    </script>
  </body>
</html>
```
Markup exists for widget views already, and can be found in ```views/bar-widget.html``` and ```views/results-widget.html```. These default views are automatically managed and rendered for you - but if you want to customize them check out the section on [creating custom views](#creating-a-custom-view-template).

Note that by default the iframe within widgets will use the same default styles as a bookmarklet. To learn how to include a custom stylesheet to style the widget iframe differently, check out the section on [public assets](#public-assets-stylesheets-javascript-images).

---
<a name="writing-a-search-module"></a>
###Writing a Search Module
The framework expects your search module (```customizations/search.js```) to export a single function, ```exports.execute(SearchableDocument, ResultSet, next){}```. 

On a fresh installation of the framework, the following code exists in ```customizations/search.js``` to help get you started.

```javascript
/*
*Module Dependencies
*/
var bond = require('bond'),
    sanitizer = require('sanitizer'),
    request = require(global.app_path + '/lib/request.js');


//Called by Framework - your code goes here
exports.execute = function(SearchableDocument, ResultSet, next){

  creatingSearchableDocument = SearchableDocument.init(true);

  creatingSearchableDocument.then(function(){

    //  inspect the main content of the document the client sent you
    console.log(SearchableDocument.queryText);

    //  Send an empty result set to the client
    ResultSet.send();

  });

};
```

Let's look at the ```execute()``` function in detail to see what's happening. 

```javascript
creatingSearchableDocument = SearchableDocument.init(true);
```

Here, we are using the [SearchableDocument](#searchabledocument) object's [init()](#searchabledocumentinitreadabilityparse) function to populate some [properties of the SearchableDocument object](#properties) that we will use later to query a search index. 

Because we pass ```true``` as a parameter to this function, it will also attempt to extract the main content from the page the client sent us using [node-readability](https://github.com/arrix/node-readability).

The ```init ()``` function returns a promise. If you're not familiar with promises, they are exactly what they sound like. A promise, in our case to do something once something else finishes. For us, that "something else" is the [readabilityParse()](#searchabledocumentreadabilityparse) function (which can take a bit of time on a larger document).

Once readability is done extracting main content, we can do something with our SearchableDocument (as *promised*) in the next block of code: 

```javascript
creatingSearchableDocument.then(function(){

  // inspect the main content of the document the client sent you
  console.log(SearchableDocument.queryText);

  // Send an empty result set to the client
  ResultSet.send();

});  

```

Let's look at this a little more abstractly. Forget about what is happening inside the anonymous function we pass to ```then()```.

Let's look at it like this:

```javascript
creatingSearchableDocument.then(

   //  After "creating the SearchableDocument" is finished, 
   // **THEN** we can do whatever is in here... 

)
```

There is [a lot more to know about promises](http://wiki.commonjs.org/wiki/Promises) if you are interested in wrangling asynchronous operations and callbacks into something sensible - but for the searchlight framework, this is all you really need to know. 

 When our promise is resolved (i.e. that "something else" is finished), ```then()``` is called, and the code we passed it in the anonymous function is executed:

 ```javascript
gettingSearchableDocument.then(function(){

  // inspect the main content of the document the client sent you
  console.log(SearchableDocument.queryText);

  // Send an empty result set to the client
  ResultSet.send();

});  

```

 Since ```SearchableDocument.init()``` has finished, our instance of SearchableDocument now has a [queryText](#querytext) property available for us. This is the string we will be sending to our search index (e.g. Solr / ElasticSearch, etc) to try to find some relevant VIVO results for the user. 

We can see what's inside ```queryText``` by logging it to the console: 

```javascript
console.log(SearchableDocument.queryText);
```

For now, we don't have any results for the user, so let's just send an empty result set using the [ResultSet](#resultset) object's [send()](#resultsetsend) function. 

```javascript
ResultSet.send();
```

Now that you understand what is happening here - open up your terminal and start up the server: 
```bash
$ cd /path/to/searchlight
$ node app.js
```

If you've already [installed the bookmarklet](#creating-the-bookmarklet), you can run it on a page of your choice!

Congratulations, you've just processed your first searchlight request, start to finish!

---
<a name="querying-a-search-index"></a>
###Querying a Search Index
Now that we're successfully processing requests to our app, let's try to find some VIVO profiles relevant to the text the client sent us. 

Installing and configuring a search index falls outside the scope of both the searchlight application and this quick start guide. If you haven't already set up a search index for your VIVO database, you might try [Solr](http://lucene.apache.org/solr/) or [ElasticSearch](http://www.elasticsearch.org/). We've successfully deployed searchlight apps using both, although ElasticSearch has performed better in our experience. 

Let's assume you have a Solr search index listening for requests at the uri: ```http://www.example.com:8080/Solr/Select/```. 

Let's create a separate function to query it for profiles relevant to the text contained in our ```SearchableDocument.queryText``` property.  

```javascript
var getVivoProfiles = function(SearchableDocument, ResultSet, Next){

  var requestURI = "http://www.example.com:8080/Solr/Select/"

  var solrParams = {
    "qt":"mlt",
    "mlt.minwl": 5,
    //More Solr MLT params here
    "wt": "json",
    "stream.body": SearchableDocument.queryText
  };

  var gettingResults = request.post(requestURI, solrParams, next);
  
  gettingResults.then(function(results)){
    console.log(results.response.hits);
  } ;

}

```

We first specify the uri we are making a request to, and some [params Solr will want](http://wiki.apache.org/solr/MoreLikeThis) in ```requestURI``` and ```solrParams``` respectively. 

We then call the [request module](#the-request-module)'s [post()](#posturi-opts-next) function, which returns a promise to deliver the response as soon as it has arrived. 

Once the response arrives from the search index, our promise is resolved, and ```gettingResults.then``` executes the anonymous function we provided it. Note that the promise delivers the response data as a parameter (```results```) to our anonymous function. 

You'll need to call the function we just created (```getVivoProfiles```) from within ```execute()```. 

If all goes well, you should see a JSON object full of relevant VIVO profiles in your console!

---
<a name="populating-the-result-set"></a>
###Populating the Result Set

Now that we have some profiles, let's get them into our [ResultSet](#resultset) object so we can send them to the client. 

Assuming you followed the directions above, let's say you have some results from Solr stored in a variable called ```solrResults```. 

You could add the following code to the function ```getVivoProfiles()```:

```javascript
for (var i in solrResults){
  var params ={
    name: sanitizer.sanitize(results[i].name),
    //Populate other params...
    overview: sanitizer.sanitize(results[i].description)
  }
  ResultSet.addResult(params);
}

ResultSet.send()

```

Here we are iterating through ```solrResults```, and adding results using the [ResultSet](#resultset) object's [addResult()](#resultsetaddresultparams) method.

Once we're done, we call [ResultSet.send()](#resultsetsend), and our view engine renders the result set for the client.

Of course, this is a very simplistic example. Depending on how complex the data structure you get back from your search index is - you may have to do additional data marshaling or processing. You'll probably want to move functionality relevant to the ResultSet over to its own function, and do all sorts of other cool stuff as well. 

---
<a name="finishing-up"></a>
###Finishing Up
Assuming you've installed the bookmarklet and have properly set up your search index - you should be seeing results in the client side app! 

We've glazed over some of the details here, of course. Unfortunately, we can't provide a completely ready-made solution because search index configurations, parameters and responses will vary wildly.  

Feel free to log an issue and make a pull request if you find any errors!

<a name="dependencies"></a>
#Dependencies
<a name="client"></a>
###Client Side Dependencies

The client side dependencies are met for you within the ```public/javascripts/``` directory. Currently, they include:
*  [jQuery](http://api.jquery.com/) - for DOM manipulation, UI functionality & AJAX functionality
*  [Porthole](http://ternarylabs.github.com/porthole/) - To provide a proxy for cross domain requests to the searchlight server


<a name="server"></a>
###Server-side Dependencies

All of these dependencies can be satisfied automatically by running ```npm install``` after cloning into the searchlight repo. (See the [quick start tutorial](#quick-start-tutorial) on [setting up a dev environment](#setting-up-a-development-environment-linux) for more details). 

A number of fantastic 3rd party node.js packages / libraries were used in the development of searchlight. In general, the use of these libraries is abstracted for you and you will not need to use them in your code - with the exception of sanitizr and perhaps bond if you like to handle asynchronous operations with promises. 

*  [express](https://github.com/visionmedia/express) - As a router and web application framework
*  [EJS](https://github.com/visionmedia/ejs) - As a view templating engine
*  [grunt](https://github.com/gruntjs/grunt) - As a front-end build system
*  [sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer) - As a means of escaping HTML special characters / Sanitizing HTML
*  [node-readability](https://github.com/arrix/node-readability) - As a method of extracting main content from a DOM object
*  [bond](https://github.com/pete-otaqui/bond) - As a simple promises library to handle asynchronous operations gracefully
*  [jQuery](https://github.com/coolaj86/node-jquery) - As a simple wrapper on the jQuery library for server-side use
*  [request](https://github.com/mikeal/request) - As a means of making HTTP requests to remote servers as necessary
*  [winston](https://github.com/flatiron/winston) - For async error logging / reporting


<a name="directory-structure"></a>
#Directory Structure

You should really only ever be modifying code in the ```customizations/``` directory, unless you need to do some framework hacking for your use case.


```
├── customizations                //  Your custom search code goes here
|   |
│   ├── public                        //  extend client side styles and behavior
│   ├── SearchableDocument.js         //  Extends /lib/SearchableDocument.js
│   ├── search.js                     //  Your custom search module
│   └── views                         //  Override EJS templates in /views
|
|
├── lib                           //  Framework Library
|   |
│   ├── Client                        //  Directory containing Client Side Application code
│   ├── ErrorHandler.js               //  Custom error handling middleware for express
│   ├── request.js                    //  Provides simplified HTTP requests
│   ├── ResultSet.js                  //  Provides standardized data structure for default view  
│   ├── SearchableDocument.js         //  Simple API for server-side DOM access
│   ├── build.js                      //  Application build logic
│
├── logs
│   └── error.log.json                //  Winston error log
|
├── node_modules                      //  3rd party NPM modules
|
├── public                         // Static assets
│   ├── images
│   ├── javascripts
|   |   └── bar_iframe.js             //  iframe animations, proxies DOM to server
|   |   └── loader.js                 //  loads iframe, proxies DOM to iFrame, on-page animation
│   └── stylesheets
|       └── bar.css                   //  Styles for default view template
|
└── views                         //  EJS View Templates
|   |
|   ├── bar-iframe.html               //  initial iframe (bookmarklet) content
|   ├── bar-widget.html               //  initial widget content
|   ├── results-iframe.html           //  iframe results
|   ├── results-widget.html           //  widget results
|
├── package.json                  //  Package dependencies
|
└── app.js                        //  Application entry point
```

<a name="objects-available-to-your-search-module"></a>
#Objects available to the search module


<a name="searchabledocument"></a>
##SearchableDocument
Server-side DOM wrapper for documents sent from the client for searches. Enables extraction of main content and removal of HTML and JavaScript.

[The SearchableDocument object can be easily extended](#extending-the-searchabledocument-object) with methods specific to your use case. Note that manipulating parent SearchableDocument properties prepended by '_' via non-parent methods may have unintended consequences. 

<a name="properties"></a>
###Properties
###```wordCount```
*int* - Contains a word count. Set by ```SearchableDocument.setWordCount()```

<a name="querytext"></a>
###```queryText```

*string* - Contains the best text available (as determined by ```init()```) for querying the search index of your choice

###```_DOM```

*string* - Contains the DOM of the page a request was sent from

###``` _MCHTML ```

*string* - The main content (as determined by readability) as HTML

###```_MCText```

*string* - The main content (as determined by readability) as Text

###```_$```

*Object* - Contains a server-side jQuery object. Can be used in your DOM manipulation methods if you [extend the SearchableDocument object](#extending-the-searchabledocument-object) for your own use case. 

<a name="methods"></a>
###Methods
<a name="searchabledocumentinitreadabilityparse"></a>
###```SearchableDocument.init(readabilityParse)```

**Params**
  *  ```readabilityParse``` - *boolean* - set to True if you want node-readability to attempt to extract main content from the DOM.

**Description** - Attempt to set ```_MCHTML``` & ```_MCText``` properties if ```readabilityParse``` is set to true. Set ```queryText``` to the best text available (```_MCText``` or ```_DOM```, stripped of HTML).

**Returns** - void

**Post Condition** - ```queryText``` is available to be sent to a search index of your choice

<a name="searchabledocumentreadabilityparse"></a>
---
###```SearchableDocument.readabilityParse()```

**Params** - none

**Description** - attempts to extract main content from a DOM. See [node-readability](https://github.com/arrix/node-readability) for more information. 

Note that using readability almost *always* improves search results in our experience - but it can be expensive. On a basic AWS instance, large documents (>3000 words) took up to 5 seconds during testing. Smaller documents tend to process very quickly, however. 

**Returns** - void

**Post Condition** - ```_MCHTML``` is populated with the document's main content as HTML

---

###```SearchableDocument.setMCText()```

**Params** - none

**Description** - sets the ```_MCText``` property to the contents of ```_MCHTML```, stripped of HTML

**Returns** - true on success, false on failure (i.e. ```_MCHTML``` has not yet been set)

**Pre-Condition** - ```_MCHTML``` is populated with the document's main content as HTML

**Post Condition** - ```_MCText``` is populated with the document's main content as Text

---

###```SearchableDocument.stripHTML(html)```

**Params**:

*  ```html``` - **string** - A string containing valid HTML 

**Description** - Attempts to strip html from a string, returns a plain text version on success, the original HTML on failure

**Returns** - String

---

###```SearchableDocument.stripScripts(html)```

**Params**:

*  ```html``` - **string** - A string containing valid HTML 

**Description** - Attempts to strip embedded JavaScript from a string of valid HTML. Returns the HTML stripped of embedded JavaScript on success, the original HTML on failure. 

**Returns** - String

---

###```SearchableDocument.checkHasHTML(text)```

**Params**:

*  ```text``` - **string**

**Description** - Attempts to determine whether or not a string contains HTML

**Returns** - boolean

---

###```SearchableDocument.setWordCount()```

**Params**: none

**Description** - Performs a word count on the document, and sets the ```wordCount``` property to the result. 

**Returns** - void 

**Post Condition** - ```wordCount``` property is set. 

Note that it will check ```queryText``` first, but if it doesn't find anything, it will back track through ```_MCText``` and ```_DOM```, so you can call this function immediately within your search module (before ```init()```), if for example you wanted to write some heuristics to deal with documents of different sizes. 

**Returns** - void

<a name="extending-the-searchabledocument-object"></a>
###Extending the SearchableDocument Object
You may need to augment the SearchableDocument object with methods or properties unique to your use case. You can encapsulate this data and behaviour by modifying the object literal ```ExtendSearchableDocument``` within ```customizations/SearchableDocument.js```.

Any properties or methods you add to this object literal will be added to the prototype of the ```SearchableDocument``` object before it is instantiated, and thus made available to you in your search module.

**Example**

inside ```customizations/SearchableDocument.js```:

```javascript
var ExtendSearchableDocument = {
  foo: 'bar',
  printFoo: function(){console.log(this.foo)};
}
```

inside ```customizations/search.js```:
```javascript
exports.execute = function(SearchableDocument, ResultSet, err){
    SearchableDocument.printFoo();
    // > 'bar'
}
```
---
<a name="resultset"></a>
##ResultSet
The ```ResultSet``` Object provides a simple API to create a uniform data structure that the default results (VIVO profile) view templates can consume.

More importantly, a method is included to ```send()``` your result set to the rendering engine once you have finished populating it.

<a name="properties-1"></a>
###Properties
###```list```
*array* - An array containing a list of results to be displayed in the view template

###```_numResults```
*int* - An integer containing the number of results in your result set. Used and incremented by 
```addResult()``` to generate part of a composite key for DOM ids for results / profiles. 

###```score```
*int* - A subjective measure of how accurate your results are, on a scale of 1-5

<a name="methods-1"></a>
###Methods

<a name="resultsetaddresultparams"></a>
###```ResultSet.addResult(params)```

**Params**
*  **params** - an object literal containing data that can be accessed in the results view templates. For the default template:
  *  **params.name** - *String* - The name of the individual or organization
  *  **params.title** - *String* - The title of the individual or organization. 
  *  **params.institution_name** - *String* - The name of the institution as it should be displayed next to an overview
  *  **params.institution_shortname** - *String* - The shortened name of the institution as it should be displayed in the results view
  *  **params.image_url** - *String* - The path to the image / thumbnail associated with the individual in the result view
  *  **params.uri** - *String* - The URI of the individual / organization's VIVO profile
  *  **params.overview** - *String* - The bio, description or overview text describing the individual / organization

**Description** - accepts a params object containing meta data about a result. It will add this meta data to an array element of ```list```.

Note that all of the above properties of ```params``` are optional. These are merely listed here for your convenience, as the default results view template expects them.

If you have defined a custom view template, pass in what you need instead. For example, ```ResultSet.addResult({DepartmentName:'Sociology'})``` would add a result with a ```DepartmentName``` property, which would be available to you in your custom results view template in the ```results``` variable.

**Returns** - void

---

###```ResultSet.setScore(score)```

**Params**:
*  Score - *int* - a number between 1-5 that describes how accurate your result set is.

**Description** - sets ```ResultSet.score``` to ```score```. Because scoring is highly subjective, you will need to write some logic to decide how accurate the results you are getting back from your search index are on a scale of 1-5. This score is displayed to the user in the default view template. If you are using a custom view template, setting a score isn't strictly necessary. 

**Returns** - Void

**Post Condition** - ```ResultSet.score``` is set to ```score```.

---

<a name="resultsetsend"></a>
###```ResultSet.send()```

**Params**: none

**Description** - Passes your ```ResultSet``` instance to the rendering engine, signaling it that your processing is complete and it is safe to send data to the client. Two variables will be made available to the view template - ```results``` (containing an array of result objects / profiles) and ```score``` containing the value of ```ResultSet.score```. 

<a name="making-requests-to-a-search-index"></a>
#Making Requests to a search index
Within your search module (```customizations/search.js```), you will need to query a search index for VIVO profiles relevant to the text you received from the client. A request module is available for you in ```lib/request.js``` that makes this process easier.

<a name="the-request-module"></a>
#The Request Module
The request module offers a thin wrapper for [request](https://github.com/mikeal/request) that abstracts error handling and returns promises for responses using [bond](https://github.com/pete-otaqui/bond). Bond is a super simple promises implementation that is really easy to use. See the examples below for more details.

The request module is available to you as ```request``` within your search module (```customizations/search.js```). 

###Exports

<a name="posturi-opts-next"></a>
###```post(uri, opts, next)```

**params** 
  *  uri - *string* - The URI you are making a request to
  *  opts - *object* - Key value pairs representing request parameters
  *  next - *function* - The express ```next()``` function, used for error handing in this case

**Description** - Makes a HTTP post request to the specified URI

**Returns** function (a promise for a HTTP response)

**Example usage** 

```javaScript
var gettingResults = request.post('www.example.com', {id:2}, next);
gettingResults.then(function(results){
    //do something with your results... 
});
```

---
###```get(uri, opts, next)```

**params** 
  *  uri - *string* - The URI you are making a request to
  *  opts - *object* - Key value pairs representing request parameters
  *  next - *function* - The express ```next()``` function, used for error handing in this case

**Description** - Makes a HTTP get request to the specified URI

**Returns** function (a promise for a HTTP response)

**Example usage** 

```javaScript
var gettingResults = request.get('www.example.com', {id:2}, next);
gettingResults.then(function(results){
    //do something with your results... 
});
```

<a name="creating-a-custom-view-template"></a>
#Creating a Custom View Template
Using custom view templates for a bookmarklet iframe, widget or result set is easy. Simply follow the naming conventions you see inside ```customizations/views/```. For example - if you would like to use a custom iframe template, replace ```bar-iframe.html.example``` with your own template, ```bar-iframe.html```. 

The searchlight framework checks first to see if a custom view template exists, and uses it if it is available. Otherwise, the default view template is used to satisfy a request. 


<a name="public-assets-stylesheets-javascript-images"></a>
#Public Assets
Two publicly available static directories exist in every searchlight application. The first, is the default ```public/``` directory, which stores image, javascript and style assets for the default view templates.

The second can be found at ```customizations/public```, and is used for adding assets for custom view templates. Anything you put in this directory will be available at ```http://example-host.com/custom/```. 

So, to include a custom style sheet within your custom view template in ```/customizations/views```: 
```html
<link rel="stylesheet" href="/custom/stylesheets/style.css'" type="text/css">
```

<a name="custom-client-side-behavior"></a>
#Custom Client Side Behavior
Currently, there are very few avenues for modifying application specific client side behavior aside from hacking framework code in ```lib/client/```. If you need to add analytics code, or some other JavaScript for your use case, you can add it in ```customizations/public/javascripts/custom.js```. 

This file will be appended to the rest of the client side JavaScript and minified during the [front end build process](#building-the-front-end).

<a name="building-the-front-end"></a>
#Building the Front End
The default front end is built for you already. If you need to rebuild it for some reason (e.g. you've been doing some hacking in ```lib/client/```) you can do so by adding ```-b``` as an option when you start the server. 

```bash
$ node app.js -b
```

This can also be accomplished with the [grunt](http://gruntjs.com/getting-started) command line tool: 

```bash
$ grunt default
``` 

The Gruntfile is located in the root of the project directory, ```Gruntfile.js```.

<a name="error-handling"></a>
#Error Handling

<a name="handling-an-error"></a>
###Handling an error
Check out the [express docs](http://expressjs.com/guide.html#error-handling) for a detailed guide to error handling in express.

In the meantime, here is a simple example of how you might handle an error in your search module:

```javascript

function raiseShields(){

  sheildStatus = enterprise.shields.up(); // Some code an intern wrote that lowers
                                          // shields and spits out an error instead...
  if(shieldStatus.error){
    enterprise.bones.complain("My god Jim... It'll tear the ship apart!");
    next(shieldStatus.error);
  }

}();

```
<a name="error-logging"></a>
###Error Logging
```lib/ErrorHandler.js``` contains a thin wrapper for [Winston](https://github.com/flatiron/winston). It is used internally as middleware for express. Both console and file system transports are used for logging, with errors logged in ```/logs/error.log.json```. See the Winston documentation for details about querying the log file programmaticly - which can be quite useful for testing and debugging. 

Caught exceptions are logged as run time errors. Uncaught exceptions are logged as such, and the app is killed to prevent attempts to handle future requests in an unknown state. 

For maximum stability, it is recommended that you use a service like [forever](https://github.com/nodejitsu/forever) to automatically restart the server in the event of an uncaught exception.

<a name="deployment"></a>
#Deploying the App

There are lots of guides and tutorials online for deploying node.js apps. How you should deploy will also depend a lot on your server environment / OS however, so be sure to consult the appropriate documentation.

Consider running a service like [forever](https://github.com/nodejitsu/forever) or [monit](http://mmonit.com/monit/) to restart the app in the event of an [uncaught exception](#error-logging).

Finally, make sure the client side of the app knows where to find resources. You can do this by editing the ```SearchLight_Application_Host``` variable in ```customizations/public/javascripts/config.js```. The host is set to ```http://127.0.0.1:3000``` for local development by default.

```javascript
var SearchLight_Application_Host = 'http://somehostname.com';

```

-- 
(mobile) +66 084-8783076