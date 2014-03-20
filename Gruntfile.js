'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                event: 'all',
                livereload: true
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['build']
            }
        },

        browserify: {
            options: {
                entry: 'src/Bootstrap.js',
                postBundleCB: function(err, src, done) {
                    done(err, '(function() {\nvar ' + src + '\n}());');
                }
            },
            native: {
                files: {
                    'build/pointer.js' : ['src/Bootstrap.js']
                },
                options: {
                    alias: ['src/adapters/Native.js:Adapter']
                }
            },
            jquery: {
                files: {
                    'build/jquery.pointer.js' : ['src/Bootstrap.js']
                },
                options: {
                    alias: ['src/adapters/jQuery.js:Adapter']
                }
            }
        },

        uglify: {
            options: {
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: '*pointer.js',
                    ext: '.min.js',
                    dest: 'build',
                    extDot: 'last'
                }]
            }
        }
    });

    // Tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['browserify', 'uglify']);
};
