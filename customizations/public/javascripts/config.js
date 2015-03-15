// APPLY CHANGES: 
// $ npm install -g grunt-cli
// $ node app.js -b


//  Set the host for the server side component of the application
var SearchLight_Application_Host = 'http://127.0.0.1:3000';

// text to display when searching for results...
var SearchLight_Application_SearchText = "Searching for yaffle profiles..."


//  Leave this alone unless you know what you're doing...
window.SearchLight_Application_Config = {};
window.SearchLight_Application_Config.host = SearchLight_Application_Host;
Object.freeze(window.SearchLight_Application_Config);
