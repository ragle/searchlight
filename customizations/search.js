/*
*Module Dependencies
*/
var bond = require('bond'),
    sanitizer = require('sanitizer'),
    request = require(global.app_path + '/lib/request.js');






//Called by framework on each request - your code goes here
exports.execute = function(SearchableDocument, ResultSet, next){

  //Initialize the SearchableDocument
  creatingSearchableDocument = SearchableDocument.init(true);

  // Once we're done creating a searchable document, then... 
  creatingSearchableDocument.then(function(){

    // Display the main content of the page sent to us from
    // the client...
    console.log(SearchableDocument.queryText);


    // We didn't query a search index yet, so let's just 
    // send the user an empty result set... 
    ResultSet.send();


  });


};

