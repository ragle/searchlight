//Kill the process if there is an uncaught exception
var kill = function(isUncaught){

  return function(){
    if(isUncaught){
      process.exit(1);
    }
  };

};


/*
*
*Error Logger (Winston - https://github.com/flatiron/winston)
*
*/
var el = function(){

  var winston = require('winston');
  this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: global.app_path + '/logs/error.log.json'})
      ]
  });

  this.logger.exitOnError = false;

};


// Log the error to file & console - kill the app on uncaughtException
el.prototype.log = function(type, err){

  var isUncaught = type == 'Uncaught Exception';
  this.logger.error(type +' --> ' + err, kill(isUncaught));

};


var ErrorLogger = new el();



/*
*
* Expose Error Handlers (Public Api)
*
*/
exports.init = function(){
  //handle uncaught exceptions (log them, restart the app)
  process.on('uncaughtException', function(err){
    ErrorLogger.log("Uncaught Exception", err.stack);
  });
};


exports.expressErrorHandler = function(err, req, res, next){

    var errMsg;
    if(err.stack){
      errMsg = err.stack;
    }else{errMsg = err;}

    ErrorLogger.log('Runtime Error: ', errMsg);
    res.send({type: 'error', content: "Sorry, an error has occured. "});

};


exports.log = function(type, err){

  ErrorLogger.log(type, err);

};
