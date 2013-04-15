/*  
*   bookmarklet.js
*    * Loads an iFrame to encapsulate styles, enable XDRs
*    * Provides functionality for capturing text from a page
*    * Provides functionality to proxy this text to the iFrame
*    * View logic to animate the iFrame parent container
*/

//Load JSON Library, for IE
var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

var vslQuery = jQuery.noConflict();

(function($) {

/*
* Page Dependencies
*/

  //Page Globals
  var host = (window.SearchLight_Application_Config && window.SearchLight_Application_Config.host) ? window.SearchLight_Application_Config.host : SearchLight_Application_Host;
  var target = host + '/bar';
  var id = 'vivoSearchLightFrame';
  var widgetID = 'vsl-widget-frame';
  var pageUrl = encodeURIComponent(window.location.href.split('#', 1)[0]);
  var isWidget = $('#'+widgetID).length > 0 ? true : false;

  //Cached jQuery Objects
  var body = $('body');
  var page = $('html');
  var pagePadding = page.css('margin-top');
  var bar;


/*
*  Page API for iFrame
*/

  //Page Animation Functionality
  var animate = function(){

    var expandFrame = function() {
      $('#'+id).animate({ 'height' : '182px' }, 400);
    };

    var collapseFrame = function() {
      $('#'+id).animate({ 'height' : '52px' }, 400);
    };

    var toggleVisibility = function() {
      if (bar.is(':visible')) {
       $(document).trigger('pageText:disableSendText');
        page.animate({ 'margin-top' : pagePadding }, 200);
      }
      else {
        $(document).trigger('pageText:enableSendText');
        page.animate({ 'margin-top' : '50px' }, 200);
      }
      bar.slideToggle('fast');
    };

    $(document).bind('animate:expandFrame', expandFrame);
    $(document).bind('animate:collapseFrame', collapseFrame);
    $(document).bind('animate:toggleVisibility', toggleVisibility);


    return{
      toggleVisibility: toggleVisibility
    };

  }();

  // Porthole Object to proxy data between  Client <--> iFrame <--> Server
  // without cross domain request problems...
  var porthole = function(){

    var proxy = new Porthole.WindowProxy(target, id);
    proxy.addEventListener(function(msg){

      if (target.indexOf(msg.origin) !== -1 && host !== 'http://127.0.0.1:3000') return;
      
      if (msg.data == 'toggle') $(document).trigger('animate:toggleVisibility');
      if (msg.data == 'expand') $(document).trigger('animate:expandFrame');
      if (msg.data == 'collapse') $(document).trigger('animate:collapseFrame');
    
    });

    var postMessage = function(evt, msgData){
      msgData = JSON.stringify(msgData);  //Because IE is a complete abortion
      proxy.postMessage(msgData);
    };

    $(document).bind('porthole:postMessage', postMessage);

  }();


  // pageText object - Containins functionality and data relevant to text on the page
  var pageText = function(){
    var previous = '';
    var current = '';

    var getSelected = function(){
      var text = '';
      if (window.getSelection) {
        text = window.getSelection();
      } else if (document.getSelection) {
        text = document.getSelection();
      } else if (document.selection) {
        text = document.selection.createRange().text;
      }
      return text;
    };

    var sendText = function(){
      current = String(getSelected());
      current = $.trim(current);
      if (current != previous) {
        previous = current;
        var msgData = {content: current, isWidget: isWidget};
        $(document).trigger('porthole:postMessage', [msgData]);
      }
    };

    var disableSendText = function(){
      $(document).unbind('mouseup', sendText);
    };

    var enableSendText = function(){
      $(document).bind('mouseup', sendText);
    };

    $(document).bind('pageText:disableSendText', disableSendText);
    $(document).bind('pageText:enableSendText', enableSendText);

    return{
      sendText:sendText
    };

  }();


/*
*  Initialize and load the iFrame
*/

  //  Attach iFrame to the Page
  if (isWidget) {
    target += '?isWidget=true';
    bar = $('<iframe id="' + id + '"name="vivoSearchLightFrame" src="' + target + '#' + pageUrl + '" width="100%" height="100%" frameborder="0" background="transparent" style="display:none" scrolling="yes"></iframe>');
    $('#'+widgetID).html(bar);
  }
  else {
    bar = $('<iframe id="' + id + '"name="vivoSearchLightFrame" src="' + target + '#' + pageUrl + '" width="100%" height="50px" frameborder="0" background="transparent" style="display:none; position:fixed; top:0; left: 0; z-index:9999999;"></iframe>').css('boxShadow', '0 0 10px 2px #000');
    body.find('#vivoSearchLightFrame').remove().end().prepend(bar);
  }

  //  Load the iFrame
  $('#'+id).load(function() {

    // Show iFrame, do not animate widget.
    if (!isWidget) {
      this.toggle = animate.toggleVisibility;
      animate.toggleVisibility();
    }
    else {
      $(this).show();
    }

    // Get text off the page, send it to the server
    $(document).trigger('porthole:postMessage', [{content: body.html(), isWidget: isWidget}]);

    // Listen for user to highlight something
    $(document).bind('mouseup', pageText.sendText);

  });

})(vslQuery);
