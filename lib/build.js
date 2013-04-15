var http = require('http'),
    childProcess = require('child_process');


//  Spin up HTTP Server
var start = function(app){

  http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
  });

};


//Build client side dependencies, if required
var buildClient = function(ErrorHandler, app){

  if (process.argv.indexOf('-b') === -1){
    return false;
  }
  console.log("\n======Rebuilding client side app, please wait=======");

  childProcess.exec('grunt default', function(err, stdout, stderr){
    if(err){
      ErrorHandler.log('Build Error', 'Stack: ' + err.stack + ' Stderr: ' + stderr);
    }
    console.log("\n" + stdout);
    console.log("======BUILD COMPLETE======\n\n");
    start(app);
  });

  return true;

};


var run = function(ErrorHandler, app){

  buildingClient = buildClient(ErrorHandler, app);
  if(!buildingClient){
    start(app);
  }

};

exports.run = run;