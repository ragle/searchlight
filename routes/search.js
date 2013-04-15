/*
* Module dependencies - 3rd party Libraries
*/
var bond = require('bond');


/*
* Module Dependencies - (Internal Code)
*/
var libSearchableDocument = require(global.app_path + '/lib/SearchableDocument.js'),
    libResultSet = require(global.app_path + '/lib/ResultSet.js');


/*
* Module Dependencies - User Modules
*/
var searchModule = require(global.app_path + '/customizations/search.js'),
    userSearchableDocument = require(global.app_path + '/customizations/SearchableDocument.js');


/*
 *
 * Prepare SearchableDocument and ResultSet APIs, pass them to the search module
 *
 */
exports.init = function(req, res, next){

  var htmlPromise = _initEnsureHaveDocument(req, next),              // Ensure context for search (DOM) exists

      SearchableDocument = _initLoadSD(htmlPromise, req, next),      // Load SearchableDocument API

      ResultSet = _initLoadRS(req,res, next);                        // Load ResultSet API, initialize send/render event

  //Execute Search
  if(SearchableDocument && SearchableDocument.then && typeof SearchableDocument.then === 'function'){
    //We don't have a SearchableDocument yet - just a promise for one...
    SearchableDocument.then(function(_SearchableDocument){
      searchModule.execute(_SearchableDocument, ResultSet, next);
    });
  } else if(SearchableDocument){
    //We have a SearchableDocument... just execute the search
    searchModule.execute(SearchableDocument, ResultSet, next);
  }

};



/*
*
*   .init() Helpers
*
*/

//ensure context for search exists
var _initEnsureHaveDocument = function (req, next){

  var isUrl = req.body.type == 'url';
  if (isUrl){
    var htmlPromise = _initgetDocument(req, next);
    return htmlPromise;
  }

  return false;

};

//Retrieve document from remote server based on URL
var _initgetDocument = function(req, next){

  var request = require(global.app_path + '/lib/request.js');
  return request.get(req.body.content, next);  // Make a request to the URL stored in req.body.content

};

//Load the ResultSet API, listen for send event
var _initLoadRS = function(req, res, next){

  var ResultSet = new libResultSet.RS();

  sendEvent = ResultSet.getSendEvent();
  sendEvent.on('send', renderResults(req, res, next));

  return ResultSet;

};

//Load the SearchableDocument API
var _initLoadSD = function(htmlPromise, req, next){

  //Extend the internal library's SD object with the User's SD object
  var SearchableDocument = _initextend(libSearchableDocument.SD, userSearchableDocument.SD);

  // If we have an HTML promise, wait until HTML is back before instantiating SearchableDocument
  // and return instance of SearchableDocument asyncronously via promise
  if(htmlPromise){

    var dfd = bond.Deferred();

    htmlPromise.then(function(html){
      if(html){
        SearchableDocument = new SearchableDocument(html);
        dfd.resolve(SearchableDocument);
      } else{
        var errMsg = "Unable to retreive HTML from URL: " + req.body.content;
        next(errMsg);
      }
    });

    return dfd.promise();

  } else if(req.body.content){ //We have the html already - just instantiate an SD and return it...
    SearchableDocument = new SearchableDocument(req.body.content);
    return SearchableDocument;

  } else{
    //We don't have any content to search against - log the error
    var errMsg = "No URL or Text was passed from the Client";
    next(errMsg);
  }

};

var _initextend = function(obj) {

  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (var prop in source) {
          if(obj.prototype[prop]){delete obj.prototype[prop];}
          obj.prototype[prop] = source[prop];
        }
      }
    });

  return obj;

};


/*
*
* Send Results to the Client
*
*/

//Render results using user's result object and views
var renderResults = function(req, res, next){

  return function(ResultSet){


    //If we don't have any results, alert the user
    if(ResultSet.list.length === 0){
      req.message = 'no-results';
      req.content = 'No matching VIVO profiles found.';
      res.send({type: req.message, content: req.content});
      return;
    }


    // Otherwise, render the results
    var options= {
            results: ResultSet.list,
            score: ResultSet.score
        },
        fs = require('fs'),
        isWidget = req.body.display == 'widget' ? true: false,

        //If a user's custom view template exists, render that. Otherwise, render default reults template
        customViewTemplatePath = isWidget ? global.app_path + '/customizations/views/results-widget.html' : global.app_path + '/customizations/views/results-iframe.html',
        defaultPath = isWidget ? global.app_path + '/views/results-widget.html' : global.app_path + '/views/results-iframe.html';

    fs.exists(customViewTemplatePath ,function(exists){
      var path = exists ? customViewTemplatePath : defaultPath;
      res.render(path, options, function(err, html){
        if (err) {
          next(err);
        }
        req.message = 'results';
        req.content = html;
        res.send({ type: req.message, content: req.content });
      });
    });

  };
};