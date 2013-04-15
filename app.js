//  Set an app path for consistant absolute paths in includes
//  so that code can be (easily) moved between files / directories if needed
global.app_path = __dirname;


//  Initialize error handling / logging
var ErrorHandler = require(global.app_path + '/lib/ErrorHandler.js');
ErrorHandler.init();


/**
 *  Module dependencies.
 */
var express = require('express'),
    search = require(global.app_path + '/routes/search'),
    bar = require(global.app_path + '/routes/bar'),
    path = require('path');


/**
 *  Configuration
 */
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use("/custom", express.static(path.join(__dirname, 'customizations/public')));
  app.use(ErrorHandler.expressErrorHandler);
  app.engine('.html', require('ejs').__express);
});

app.configure('development', function(){
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


/**
 *  Router
 */
app.get('/bar', bar.init);
app.post('/search', search.init);


/**
 *  Build and Run the app
 */
var build = require(global.app_path + '/lib/build.js');
build.run(ErrorHandler, app);