module.exports = function (grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Clean all generated files
    clean: {
      build: ['build/*'],
      cordova: [
                'cordova/www/*',
                '!cordova/www/img'
               ]
    },
    // Concatenate JS files, two tasks: vendor & app
    concat: {
      options: {},
      // Concatenate all vendor scripts to vendor.js 
      vendor: {
        src: [
              'bower_components/jquery/dist/jquery.min.js',
              'bower_components/bootstrap/dist/js/bootstrap.min.js',
              'bower_components/angular/angular.min.js'
              // Add all JS libraries you want to include in you build to this array 
             ],
        dest: 'build/vendor.js'
      },
      // Concatenate all your own app scripts to app.js
      app: {
        src: [
          'src/**/*.module.js', // make sure that modules are set before adding controllers etc.
          'src/**/*.js'
        ],
        dest: 'build/app.js'
      }
    },
    // Minify and add a banner comment to app js file:
    uglify: {
      options: {
        mangle: false, // This breaks angular injections made without array syntax if true (default) 
        banner: '/** <%= pkg.name %> v<%= pkg.version %> build <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= concat.app.dest %>',
        dest: 'build/app.min.js'
      }
    },
    // Check all js files with jshint:
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options to override JSHint defaults
        globals: {
          angular: true,
          module: true,
          document: true
        }
      }
    },
    // Copy specified files to build folder
    // two separate tasks: one for css and one for html files
    copy: {
      css: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'src/**/*.css'
          ],
          dest: 'build/css/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf',
            'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',
            'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2'
          ],
          dest: 'build/fonts/'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['./**/*.html'],
          dest: 'build/'
        }],
        options: {
          // Modify html file contents when copied
          process: function (content, srcpath) {
            // Remove all html comments
            content = content.replace(/<!--[\s\S]*?-->\s*\n*/g, "");
            // Change bootstrap css file path
            content = content.replace(/..\/bower_components\/bootstrap\/dist\//g, "");
            // Remove all script elements
            content = content.replace(/<script.*script>\s*\n*/g, "");
            // Add concatenated js files just before closing body tag
            content = content.replace(/<\/body>/,
              '<script src="cordova.js"></script>\n' +
              '<script src="vendor.js"></script>\n' +
              '<script src="app.min.js"></script>\n' +
              '</body>');
            return content;
          }
        }
      },
      cordova: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['./**/*'],
          dest: 'cordova/www/'
        }]
      }
    },
    // Wrap cordova commands into grunt task 
    cordovacli: {
      options: {
        path: 'cordova'
      },
      // Create Cordova project, change id & name, add platforms & plugins
      create: {
        options: {
          command: ['create', 'platform', 'plugin'],
          platforms: ['android'],
          plugins: ['device', 'media'],
          id: 'fi.metropolia.wbma.app',
          name: 'My Application'
        }
      },
      build: {
        options: {
          command: 'build',
          platforms: ['android']
        }
      },
      run: {
        options: {
          command: 'run',
          platforms: ['android']
        }
      }
    }
  });

  // Load the plugins that provide the grunt tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-cordovacli');

  // Default tasks
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean:build', 'concat', 'jshint', 'uglify', 'copy:css', 'copy:fonts', 'copy:html']);
  grunt.registerTask('run', ['build', 'clean:cordova', 'copy:cordova', 'cordovacli:run']);
  grunt.registerTask('cordova', ['cordovacli:create', 'clean:cordova']);

};