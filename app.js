/*  
    Searchlight - A framework for creating simple applications that find 
    VIVO profiles relevant to content in the user's browser.
    
    Copyright (C) 2013, Rob Agle and Miles Worthington

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

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