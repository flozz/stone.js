module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dist: {
                files: {
                  'dist/<%= pkg.name %>.js': ['src/index.js'],
                },
                options: {
                    browserifyOptions: {
                        'standalone': 'Stone'
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },

        jshint: {
            lib: {
                files: {
                    src: ["src/*.js"]
                },
                options: {
                    browserify: true
                }
            },
            tests: {
                files: {
                    src: ["test/*.js"]
                },
                options: {
                    jasmine: true,
                    globals: {
                        Stone: false
                    }
                }
            },
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                curly: true,
                browser: true
            }
        },

        jasmine: {
            pivotal: {
                src: 'dist/stonejs.js',
                options: {
                    specs: 'test/*Spec.js'
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);
    grunt.registerTask('test', ['jshint', 'jasmine']);

};
