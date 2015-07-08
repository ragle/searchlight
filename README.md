searchlight
===========
A framework for creating simple applications that find [VIVO profiles](http://www.vivoweb.org) relevant to content in the user's browser. 


##Demo
To learn more about VIVO Searchlight apps and try out an application created with The Searchlight Framework, check out our [about page](http://about.vivosearchlight.org). 


##Documentation 

###Installation 

*  [Install node.js version 0.12.6](https://github.com/joyent/node/wiki/Installation#building-on-gnulinux-and-other-unix)
*  ```$ git clone http://git.github.com/ragle/searchlight```
*  ```$ cd searchlight```
*  ```$ npm install```


###Quick Start

For more detailed help on getting started, check out our [quick start tutorial](http://docs.vivosearchlight.org/#quick-start-tutorial). 

Create a simple bookmarklet to host the client side app:

```html
<html>
  <head></head>
  <body>
    <h1>My Great Searchlight App!</h1>
    <p> Drag the link below to your browser's bookmark bar to install the bookmarklet!</p>
    <a href="javascript:(function(){var bar=document.getElementById('vivoSearchLightFrame');if(!bar){bar=document.createElement('div');bar.setAttribute('id','vivoSearchLightFrame');document.getElementsByTagName('body')[0].appendChild(bar);var script=document.createElement('SCRIPT');script.type='text/javascript';script.src='127.0.0.1:3000/javascripts/loader.js';document.getElementsByTagName('head')[0].appendChild(script)}else if(bar.toggle!==undefined){bar.toggle()}})();">VIVO Searchlight</a>
  </body>
</html>
```

Add the bookmarklet to your browser's bookmarklet bar, then start the app:

```bash
$ cd path/to/searchlight
$ node app.js
```

Navigate to the page of your choice (perhaps a news article about some research topic that interests you), and click on the bookmarklet. 

You should see "No matching VIVO profiles were found" in the app UI (you haven't set up a search index yet). In your console (where you started the server), you should see the main content of the article you sent. 

Congrats, you've just processed your first VIVO searchlight request, from start to finish.

Have a look at the [documentation](http://docs.vivosearchlight.org) for more details about building VIVO searchlight apps. 

###Full Documentation / API Reference
There is detailed documentation [available here](http://docs.vivosearchlight.org). Please submit a pull request on the gh-pages branch of this repository if you find any documentation errors. The Markdown version of the docs can be found [here](https://github.com/ragle/searchlight/blob/gh-pages/assets/docs_markdown.md). 

##Issues, Problems and Bugs
If you find a bug, please log an issue and submit a patch. If you run into a problem you can't solve, have questions, or are interested in having a searchlight app built for your organization - please don't hesitate to get in touch!

The Searchlight Framework is currently a prototype in the earliest stages of development. It has been used to deploy [a simple demo](http://about.vivosearchlight.org), and a [proof-of-concept app for the Agrivivo Project](http://agrivivo.net/tool/searchlight). Your mileage may vary using it to create production apps.

### Change log

#### v0.1.2

*  Migrates from node.js v0.12.0 stable to v0.12.6 stable
  *  Framework tested and working against v0.12.6 - no changes needed from Searchlight v0.1.1 apart from updating your version of node...
*  Eliminates out-of-band write in V8's utf-8 decoder (DoS vulnerability) - see [[--1--]](http://www.openwall.com/lists/oss-security/2015/07/05/1)[[--2--]](http://blog.nodejs.org/2015/07/03/node-v0-12-6-stable/)

#### v0.1.1

*  Migrates from node.js v0.8.12 to v0.12.0 stable
  *  Eliminates [CVE-2013-4450](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2013-4450)
  *  Eliminates [CVE-2014-5256](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-5256)
*  [Migrates from express 3.x to express 4.10.1](https://github.com/strongloop/express/wiki/Migrating-from-3.x-to-4.x)
  *  Eliminates [CVE-2014-6394](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-6394)
*  Upgrades error logging to support `development`, `testing`, `production` environments
*  Replaces original node.js port of Arc90's readability with _substantially_ faster (and recently maintained) [readabilitySAX](https://www.npmjs.com/package/readabilitySAX).
*  Replaces node jquery with html-to-text for extracting text from HTML
*  Better XSS protection / javascript stripping wtih [caja-sanitizer](https://www.npmjs.com/package/sanitizer)

##License
Searchlight is available under an [AGPL-3.0](http://www.gnu.org/licenses/agpl.html) License. 
