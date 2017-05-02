// Grunt configuration

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Borra el contenido de /build
    clean: {
      prebuild: {
        src: ["build"]
      },
      postbuild: {
        src: ["build/css/app.css", "build/css/_bower.css", "build/js/main.js", "build/js/_bower.js", "build/css/noprefix-app.css"]
      }
    },
    // Copia los ficheros necesarios de /dev a /build
    copy: {
      build: {
        files: [
          {expand: true, cwd: 'app/css/', src: 'fonts.css', dest: 'build/css/'},
          {expand: true, cwd:"app/fonts", src: ['**'], dest: 'build/fonts/'},
          {expand: true, cwd: 'app/img/', src: 'gear.svg', dest: 'build/img/'},
          {expand: true, cwd:"app/js/i18n", src: ['**'], dest: 'build/js/i18n/'},
          {expand: true, cwd: 'app/js/', src: 'home.js', dest: 'build/js/'},
          {expand: true, cwd: 'app/js/', src: 'form.js', dest: 'build/js/'},
          {expand: true, cwd: 'app/', src: 'googlef53367b0328732e2.html', dest: 'build/'},
          {expand: true, cwd: 'app/', src: 'google06d435b65f2ee249.html', dest: 'build/'},
          {expand: true, cwd: 'app/', src: 'robots.txt', dest: 'build/'},
          {expand: true, cwd: 'app/', src: 'sitemap.xml', dest: 'build/'},
          {expand: true, cwd: 'app/js/', src: 'googlemaps.js', dest: 'build/js/'},
          {expand: true, cwd:"app/jobs/js", src: ["*.*", "**/*.*"], dest: 'build/jobs/js/'}


        ]
      },
      copyimgs: {
        files: [{
          cwd: 'app/img',  // set working folder / root to copy
          src: '**/*',           // copy all files and subfolders
          dest: 'build/img',    // destination folder
          expand: true           // required when using cwd
        }]
      },
      dist: {
        files: [
          {expand: true, cwd:"build/", src: ['**'], dest: 'dist/'},
        ]
      }
    },
    bower_concat: {
      all: {
        dest: {
          'js': 'build/js/_bower.js',
          'css': 'build/css/_bower.css'
        },
        exclude: [
          'intl-tel-input'
        ],
        mainFiles: {
          'polyglot': 'build/polyglot.min.js',
          'geocomplete': 'jquery.geocomplete.min.js',
          'bideo.js': 'bideo.js'
        }
      }
    },
    // Concatena todos los css
    concat: {
      js:{
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */',
        src: ['build/js/_bower.js', 'app/js/utils.js', 'app/js/menu.js', 'app/js/main.js'],
        dest: 'build/js/main.js'
      },
      css: {
        src: ['build/css/_bower.css', 'app/css/main.css'],
        dest: 'build/css/noprefix-app.css'

      }
    },
    uglify: {
      build: {
        files: {
          'build/js/main.min.js': 'build/js/main.js'
        }
      }
    },
    // css Autoprefixer
    autoprefixer: {
      options: {
        diff: false
      },
      single_file: {

        src: 'build/css/noprefix-app.css',
        dest: 'build/css/app.css'
      }
    },
    // Hace un minify del css
    cssnano: {
      minify: {
        src: 'build/css/app.css',
        dest: 'build/css/app.min.css'
      }
    },
    uncss: {
      build: {
        files: {
          'build/css/app.min.css': ['app/index.html']
        }
      }
    },
    processhtml: {
      build: {
        options: {
          process: true,
          data: {
            title: 'My app',
            message: 'This is production distribution'
          }
        },
        files: {
          'build/index.html': ['app/index.html']
        }
      }
    },
    htmlmin: {                                     // Task
      build: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'build/index.html': 'build/index.html'
        }
      }
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'app/img',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,ico}'],   // Actual patterns to match
          dest: 'build/img'                  // Destination path prefix
        }]
      }
    },
    sass: {
      build: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/css/main.css' : 'app/sass/styles.scss'
        }
      },
      buildprod: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'app/css/main.css' : 'app/sass/styles.scss'
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'app/css/*.css',
            'app/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: './app'
        }
      }
    },

    watch: {
      css: {
        files: 'app/sass/**/*.scss',
        tasks: ['sass:build']
      }
    }

  });

  // Carga de plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-uncss');


  // Task DIST
  grunt.registerTask('build', "Copia a /build los archivos necesarios para producción", ['clean:prebuild','sass:buildprod', 'bower_concat', 'concat', 'uglify', 'autoprefixer:single_file', 'copy:copyimgs', 'processhtml', 'cssnano:minify', 'clean:postbuild', 'copy:build', 'copy:dist', 'clean:prebuild']);
  grunt.registerTask('dev', "Activa recarga automática y watch", ['sass:build', 'browserSync', 'watch'])

};