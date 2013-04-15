/*
*   render main page
*
*/

exports.init = function(req, res, next){
  var fs = require('fs'),
  isWidget = req.query['isWidget'];
  customBarPath = isWidget ? global.app_path + '/customizations/views/bar-widget.html' :global.app_path + '/customizations/views/bar-iframe.html',
  defaultBarPath= isWidget ? global.app_path + '/views/bar-widget.html' :global.app_path + '/views/bar-iframe.html';

  fs.exists(customBarPath, function(exists){
    var path = exists ? customBarPath : defaultBarPath;
    var render = function(path){
      res.render(path, { layout: false });
    }(path);
  });
};