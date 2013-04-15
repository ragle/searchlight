/*
*Module Dependencies
*/
var bond = require('bond'),
    request = require('request');


/*
*
* Simple wrapper module for request: https://github.com/mikeal/request
* that implements promises and abstracts error handling...
*
*/
var post = function(uri, opts, next){

  var dfd = bond.Deferred();

    request.post(uri, {form: opts}, function (err, response, body) {

      if (!err && response.statusCode == 200) {
        var result = JSON.parse(body);
        dfd.resolve(result);
      }

      if(err){
        next("Error Making Post Request: " + err + err.stack);
      }

      if(!err && response.statusCode != 200){
       responseText = response.body || 'Empty Response Body';
       errMsg = "Received error message from server while making POST request: " + responseText;
       next(errMsg);
      }

    });

  return dfd.promise();

};

var get = function(url, next){

  var dfd = bond.Deferred();

  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      dfd.resolve(body);
    }

    if (err){
      var errMsg = 'Error while making GET request to: ' + url + ': ';
      if (err.stack){
        errMsg = errMsg + err.stack;
      } else {errMsg = errMsg + err;}
      next(errMsg);
    }

  });

  return dfd.promise();

};

/*
*
* Expose Request Functions (Public API)
*
*/
exports.post = post;
exports.get = get;