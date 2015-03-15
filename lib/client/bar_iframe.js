/*  
*   bar_iframe.js
*    * Model functionality to pass text from users page (proxied from 
*        functionality in page.js) to server for search
*    * View logic to present search results to user
*    * Provides functionality to proxy commands to expand / collapse iFrame 
*        parent container to functionality in bookmarklet.js
*/

//Load JSON library for IE
var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

(function($){

// Set in /customizations/public/javascripts/config.js
var host = (window.SearchLight_Application_Config && window.SearchLight_Application_Config.host) ? window.SearchLight_Application_Config.host : SearchLight_Application_Host;

//Model
var Model = function(){

  var cached = {},
      jqxhr = false,
      request = {},
      timeout = 30,
      profileHashes = {},
      profileRequestQueue = [];


  var getCached = function(){
    if(cached.is_cache){
      return cached;
    }
    return false;
  };


  var flushOverviewRequestCache = function(){
    while(profileRequestQueue.length !== 0){
      var xhrRequest = profileRequestQueue.pop();
      xhrRequest.abort();
    }
  };


  var query = function(body){
    if (jqxhr) jqxhr.abort();

    var defer = $.Deferred();

    //Without a body, we're retrying the cached request.
    if(body){
      request = {
        defer: defer,
        url: host+'/search',
        cache: false,
        data: body,
        dataType: 'json',
        type: 'POST',
        timeout: timeout*1000,
        success: function(data) {
          var response ={
            is_cache: false,
            status: data.type,
            data: data
          };
          if(!cached.is_cache){
            cached = response;
            cached.is_cache = true;
          }
          request.defer.resolve(response);
        },
        complete: function(xhr, status) {
          var response = {};
          response.status = status;
          response.data = {};
          request.defer.resolve(response);
        }
      };
    } else request.defer = defer;

    flushOverviewRequestCache();

    jqxhr = $.ajax(request);
    return defer;
  };


  return{
    getCached : getCached,
    query: query,
  };

}();


//View
var View = function(){

  var loaderImage = false,
      loading = false,
      expanded = false;


  var expandWindow = function() {
    expanded = true;
    $(document).trigger('Proxy::postMessage', ['expand']);
  };


  var collapseWindow = function() {
    expanded = false;
    $(document).trigger('Proxy::postMessage', ['collapse']);
  };


  var showProfile = function(id) {
    $('#'+id).addClass('active').fadeIn('fast');
  };


  var startLoading = function() {
    $('#results, #profiles > ul').css('opacity', '0.5');
    loaderImage.show();
    $('#score').hide();
  };


  var stopLoading = function() {
    window.clearInterval(loading);
    loaderImage.hide();
  };


  var addLoadingMessage = function() {
    var searchText = SearchLight_Application_SearchText ? SearchLight_Application_SearchText : "Searching VIVO for profiles.";
    $('#content').empty().append('<p class="status">' + searchText  + '</p>');
    loading = window.setInterval(function() { $('#content .status').append('.'); }, 1000);
  };


  var showScore = function(animate) {
    $($('#score').show().find('.on').get().reverse()).each(function(i) {
      var tick = $(this);
      setTimeout(function() { tick.css('background', '#fff'); }, 100 * (i+1));
    });
  };


  var bindExpandCollapse = function(element) {
    element.click(function() {
      var active;
      $('#results .result').not(element).removeClass('active');
      element.toggleClass('active');
      active = element.hasClass('active');

      $('.profile').removeClass('active').hide();
      if (active) {
        var profileID = element.attr('rel');
        showProfile(profileID);
      }

      if (active && !expanded) expandWindow();
      else if (!active && expanded) collapseWindow();

    });
  };


  var bindCloseButton = function(){
    $('#close-button').click(function() {
      $(document).trigger("Proxy::postMessage", ['toggle']);
    });
  };


  var renderResults = function(html, animate) {
    var content = $(html).find('li').hide().end();
    var time = 0;

    $('#profiles').remove();
    $('#content').empty().append(content).find('.result').each(function(i) {
      var result = $(this);
      bindExpandCollapse(result);
      if (animate) {
        setTimeout(function() { result.fadeIn(); }, 300 * i);
        if (expanded && i===0) {
          result.click();
        }
        showScore(true);
      }
      else {
        result.fadeIn();
        if (expanded && i===0) {
          result.click();
        }
        showScore(false);
      }
    }).end().find('#profiles').appendTo('body');
  };


  var renderEmpty = function(html) {
    $('#content').empty().append('<p class="status">' + html + '</p>');
  };


  var renderError = function(html) {
    collapseWindow();
    var link = $('<a href="#">Try again</a>').click(function() {
      $(document).trigger('Controller::retryQuery');
      startLoading();
      addLoadingMessage();
    });
    $('#content').empty().append($('<p class="status">' + html + ' </p>').append(link).append('?'));
  };


  var displayResult = function(data) {
    stopLoading();

    switch (data.type) {
      case 'results':
        return renderResults(data.content, data.is_cache ? false : true);
      case 'no-results':
        return renderEmpty(data.content);
      case 'timeout':
        return renderError(data.content);
      case 'error':
        return renderError(data.content);
    }
  };


  var init = function(){
      bindCloseButton();
      loaderImage = $('<img id="loading" src="'+host+'/images/loader.gif" />').hide().insertAfter('#close');
      addLoadingMessage();
      startLoading();
  };


  return {
    displayResult: displayResult,
    startLoading: startLoading,
    addLoadingMessage: addLoadingMessage,
    init: init
  };

}();


//Controller
var Controller = function(){

  var render = function(results){
    var status = results.status,
    data = results.data;
    if (status != 'success' && status != 'results'){
      var timeoutMsg = 'Sorry, it looks like there was a connection problem.',
          failMsg = 'Sorry, there was a problem retrieving results.';
          noResultsMsg = 'No Matching VIVO Profiles were Found.';
      data.type = status;
      data.content = status == 'timeout' ? timeoutMsg : (status == 'no-results' ? noResultsMsg : failMsg);
    }

    View.displayResult(data);
  };


  var fetchResults = function(query){
    if(!query) query = false;
    gettingResults = Model.query(query);
    gettingResults.then(function(results){render(results);});
  };


  var consumeProxyMsg = function(msg){

    if(!msg.data) render({status:error});

    View.startLoading();

    var msgData = JSON.parse(msg.data),
        text = $.trim(msgData.content),
        isWidget = msgData.isWidget,
        target = msg.target;

    if(text == ''){
      var cached = Model.getCached();
      if (cached){
        render(cached);
      }
      return;
    }

    //prepare and dispatch query
    var type  =   text == ''     ?  'url'    :  'text',
    content =   type == 'text'   ?  text   :  target,
    display =   isWidget     ?  'widget' :  'bookmarklet',
    query = { type: type, content: content, display: display };
    fetchResults(query);
  };


  var retryQuery = function(){
    fetchResults();
  };

  $(document).bind('Controller::retryQuery', retryQuery);

  return{
      consumeProxyMsg : consumeProxyMsg
  };

}();


//Run app
$(document).ready(function(){

  //Alert user we're working on their (initial) request
  View.init();
  // Create porthole proxy, falls back to grabbing data from URL hash incase
  // of browser incompatibility with msg passing
  var target = decodeURIComponent(window.location.hash).substr(1);
  var porthole = new Porthole.WindowProxy(target);
  // Listen for messages from the bookmarklet
  porthole.addEventListener(function(msg){

    if(target.indexOf(msg.origin) === -1 && host !== 'http://127.0.0.1:3000'){
        //console.log('Orign Error');
        return;
      }

    msg.target = target;

    // Based on message (page text): request a result set, display it to the user
    Controller.consumeProxyMsg(msg);

  });

  // Enable message passing from this view to bookmarklet view
  $(document).bind('Proxy::postMessage',function(evt, message){
    porthole.postMessage(message);
  });

});

})(jQuery);
