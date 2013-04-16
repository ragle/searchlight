module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      bookmarklet: {
        src: ['customizations/public/javascripts/config.js', 'lib/client/jquery.min.js', 'lib/client/porthole.min.js', 'lib/client/loader.js'],
        dest: 'lib/client/tmp/loader.js'
      },
      bar_iframe: {
        src: ['customizations/public/javascripts/config.js', 'lib/client/jquery.min.js', 'lib/client/porthole.min.js', 'lib/client/bar_iframe.js', 'customizations/public/javascripts/custom.js'],
        dest: 'lib/client/tmp/bar_iframe.js'
      }
    },
    uglify: {
      options: {
        banner: '/*!  searchlight v0.0.1\n *  Copyright 2013, Rob Agle and Miles Worthington\n *  Licensed Under the Creative Commons Attribution License\n *  http://creativecommons.org/licenses/by/3.0/\n *\n *  searchlight makes use of the following (unmodified) 3rd party libraries: \n *  ===================================================================================\n *\n *  jQuery JavaScript Library v1.6.2\n *  http://jquery.com/\n *  Copyright 2011, John Resig\n *  Dual licensed under the MIT or GPL Version 2 licenses.\n *  http://jquery.org/license\n *\n *  jQuery includes Sizzle.js\n *  http://sizzlejs.com/\n *  Copyright 2011, The Dojo Foundation\n *  Released under the MIT, BSD, and GPL Licenses.\n *\n *  Porthole.js - http://ternarylabs.github.com/porthole/\n *  Copyright (c) 2011-2012 Ternary Labs. All Rights Reserved.\n *  Released under the MIT License\n *\n */\n\n',
        mangle:{
          except:['jQuery']
        },
        compress: true,
        preserveComments:false
      },
      bookmarklet: {
          files: {
            'public/javascripts/loader.js': ['lib/client/tmp/loader.js']
          }
      },
      bar_iframe: {
        files: {
          'public/javascripts/bar_iframe.min.js': ['lib/client/tmp/bar_iframe.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', 'uglify']);
};