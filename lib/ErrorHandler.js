/* docs: http://docs.vivosearchlight.org/#error-handling */

/*
 *
 *Error Logger (Winston - https://github.com/flatiron/winston)
 *
 */

// Workaround for winston issue 228: see https://github.com/winstonjs/winston/issues/228
//                                   When this is fixed, would be good to get back to a single 
//                                   point of exit for the app on uncaught exceptions...
var watch = require('watch')
var log_changed_flag = false;
watch.createMonitor('logs/', function(monitor){
    monitor.files['logs/error.log.json'];
    // Kill the app if we have modified the log file (i.e. - we have encountered an uncaught exception)
    monitor.on("changed", function(){ if(log_changed_flag){process.exit(0);}});
});


var el = function(ENV){

    this.env = ENV;

    var winston = require('winston');
    var nullLogger, transports;

    if ("development" == this.env){
        transports = [
            new (winston.transports.File)({ filename: global.app_path + '/logs/error.log.json', level:"error"}),
            new (winston.transports.Console)()
        ];
    }

    if ("testing" == this.env){
        transports = [
            new (winston.transports.File)({ filename: global.app_path + '/logs/error.log.json'})
        ];
    }


    if ("production" == this.env){

        // Fascade of winston interface to provide uniform, conditionless error handling interface
        // across all environments (even when we aren't logging errors). 
        // destroys error information (within its local scope) and kills app to prevent execution
        // in unknown and/or exploited state
        nullLogger = function(){

            var error = function(err, cb){
                err = null;
                process.exit(0);
            };

            return {error: error};
        };

    }

    if (("development" == this.env) || ("testing" == this.env)){
        this.logger = new (winston.Logger)({ transports: transports});
    }

    if ("production" == this.env){
        this.logger = nullLogger();
    }


};


el.prototype.log = function(type, err){
    log_changed_flag = true;
    this.logger.error(type +' --> ' + err);
};


var ErrorLogger;
/*
 *
 * Expose Error Handlers (Public Api)
 *
 */
exports.init = function(ENV){
    ErrorLogger = new el(ENV);
    process.on('uncaughtException', function(err){
        ErrorLogger.log("Uncaught Exception", err.stack);
    });
};


exports.expressErrorHandler = function(err, req, res, next){

    var errMsg;
    if(err.stack){
        errMsg = err.stack;
    }else{errMsg = err;}

    ErrorLogger.log('Uncaught Exception', errMsg);
    res.send({type: 'error', content: "Sorry, an error has occured. "});

};


exports.log = function(type, err){
    ErrorLogger.log(type, err);
};