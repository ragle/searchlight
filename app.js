/*  
    Searchlight - A framework for creating simple applications that find 
    VIVO profiles relevant to content in the user's browser.

    Copyright (C) 2015, Rob Agle and Miles Worthington

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
var env = process.env.NODE_ENV || 'development';
var ErrorHandler = require(global.app_path + '/lib/ErrorHandler.js');
ErrorHandler.init(env);


/**
 *  Module dependencies.
 */
var express = require('express'),
    morgan = require('morgan'),                              // http logging middleware
    bodyParser = require('body-parser'),
    search = require(global.app_path + '/routes/search'),
    bar = require(global.app_path + '/routes/bar'),
    path = require('path');


/**
 *  Configuration
 */
var env = process.env.NODE_ENV || 'development';
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if ('development' == env){
    app.use(morgan('dev'))
}
if ('production' == env || 'testing' == env){
    app.use(morgan('combined'))
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true, limit: 20000000})) // 20mb
app.use(express.static(path.join(__dirname, 'public')));
app.use("/custom", express.static(path.join(__dirname, 'customizations/public')));
app.engine('.html', require('ejs').__express);


/**
 *  Router
 */
app.get('/bar', bar.init);
app.post('/search', search.init);



/**
 *  Build and Run the app
 */
var build = require(global.app_path + '/lib/build.js');
app.use(ErrorHandler.expressErrorHandler);
build.run(ErrorHandler, app);