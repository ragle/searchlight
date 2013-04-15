searchlight
===========
A framework for creating simple applications that find VIVO researcher profiles relevant to the web page you are viewing.

##TO DO
*  Add links to readme.md once DNS is resolving to documentation / about gh-pages...


##Demo
To learn more about VIVO Searchlight apps and try out an application created with The Searchlight Framework, check out our about page. 


##Installation 

*  [Install node.js version 0.8.12](https://github.com/joyent/node/wiki/Installation#building-on-gnulinux-and-other-unix)
*  ```$ git clone http://git.github.com/ragle/searchlight```
*  ```$ cd searchlight```
*  ```$ npm install```


##(Very) Quick Start

Create a very simple bookmarklet to host the client side app: 
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

You should see "No matching VIVO profiles were found" in the app UI (you haven't set up a search index yet). In your console (where you started the server), you should see the main content of the article you sent with the bookmarklet. 

Congrats, you've just processed your first VIVO searchlight request, from start to finish. 

For a more detailed tutorial on getting searchlight working with your search index / VIVO database, check out our quick start tutorial and the documentation. 

##Documentation
There is detailed documentation available here: [Documentation](http://ragle.github.io/searchlight/). Please submit a pull request on the gh-pages branch of this repository if you find any documentation errors. The Markdown version of the docs can be found here. 

##Issues, Problems and Bugs
If you find a bug, please log an issue and submit a patch. If you run into a problem you can't solve, or have questions - please don't hesitate to get in touch!

The Searchlight Framework is currently a proof-of-concept prototype in the earliest stages of development. It has been used to deploy VIVO searchlight apps successfuly for a demo, and for a proof-of-concept app for the Agrivivo Project. Your milage may vary using it to create production apps!