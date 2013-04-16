// Docs: http://docs.vivosearchlight.org/#resultset

/*
*Module Dependencies
*/
var events = require('events');

//  ResultSet Object
//  A ResultSet containing a list which offers a common datastructure that the default view template
//  can consume.
var ResultSet = function(){
  this.list = [];                                  // list of results
  this._numResults = 0;                             // auto-incremented each time a result is added
  this.score = 0;                                  // max score of result set
  this.eventEmitter = new events.EventEmitter();
};


//  Immutible function to attach event emmiter to Result Set to enable message passing
Object.defineProperty(ResultSet.prototype, "getSendEvent",{
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(){return this.eventEmitter;}
});


//  Immutible function that signals the router that user's backend module processing is complete
Object.defineProperty(ResultSet.prototype, "send", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(){this.eventEmitter.emit('send', this);}
});


//  Docs: 
ResultSet.prototype.addResult = function(params){
  var Result = function(params, id){

    //Ensure defaults exist for default template
    this.id                     =  id;
    this.name                   =  params.name || '';
    this.title                  =  params.title || '';
    this.institution_name       =  params.institution_name || '';
    this.institution_shortname  =  params.institution_shortname || '';
    this.image_url              =  params.image_url || '';
    this.css_image_class        =  params.image_class || '';
    this.css_id                 =  id '';
    this.uri                    =  params.uri || '';
    this.overview               =  params.overview || '';
    this.topics                 =  params.topics || [];

    if(this.image_url === ''){
        this.image_url = '/images/profile_image.png';
        this.css_image_class = 'blank';
        this.image_data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODhDNkRBMDg4MDU0M0ZCQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMDIyRTA1NkFBQTYxMUUwQjhDRTgyRjNFQjZDNzNFQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMDIyRTA1NUFBQTYxMUUwQjhDRTgyRjNFQjZDNzNFQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4OEM2REEwODgwNTQzRkJBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4OEM2REEwODgwNTQzRkJBIi8+IDwvcmRmOkRlc2NyaXB0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';
    }

    //remove default keys we've already added, if they exist
    for (var resultKey in this){
      delete params[resultKey];
    }

    //load any additional user supplied parameters for custom view templates
    for(var paramsKey in params){
      this[paramsKey] = params[paramsKey] || '';
    }
  };

  this.list.push(new Result(params, this._numResults++));
};


//Set the Max Score for the result set (**should be modified to find the max score?**)
ResultSet.prototype.setScore = function(score){
  this.score = score;
};

/*
*
* Expose ResultSet API (Public API)
*
*/
exports.RS = ResultSet;