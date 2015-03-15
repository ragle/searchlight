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
        banner: '/*\n\n    Searchlight - A framework for creating simple applications that find\n    VIVO profiles relevant to content in the user\'s browser.\n\n    Copyright (C) 2015, Rob Agle and Miles Worthington\n\n    This program is free software: you can redistribute it and/or modify\n    it under the terms of the GNU Affero General Public License as published by\n    the Free Software Foundation, either version 3 of the License, or\n    (at your option) any later version.\n\n    This program is distributed in the hope that it will be useful,\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n    GNU Affero General Public License for more details.\n    You should have received a copy of the GNU Affero General Public License\n    along with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n    Searchlight makes use of the following (unmodified) 3rd party libraries: \n    ===================================================================================\n \n    jQuery JavaScript Library v1.6.2\n    http://jquery.com/\n    Copyright 2011, John Resig\n    Dual licensed under the MIT or GPL Version 2 licenses.\n    http://jquery.org/license\n  \n    jQuery includes Sizzle.js\n    http://sizzlejs.com/\n    Copyright 2011, The Dojo Foundation\n    Released under the MIT, BSD, and GPL Licenses.\n  \n    Porthole.js - http://ternarylabs.github.com/porthole/\n    Copyright (c) 2011-2012 Ternary Labs. All Rights Reserved.\n    Released under the MIT License\n  \n*/\n\n',
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