module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dist: {
                files: {
                  'dist/<%= pkg.name %>.js': ['src/stone.js'],
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

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);
    grunt.registerTask('test', ['jasmine']);

};
