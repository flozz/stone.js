module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        browserify: {
            dist: {
                files: {
                  "dist/<%= pkg.name %>.js": ["src/index.js"],
                },
                options: {
                    browserifyOptions: {
                        "standalone": "Stone"
                    }
                }
            },
        },

        uglify: {
            dist: {
                files: {
                    "dist/<%= pkg.name %>.min.js": ["dist/<%= pkg.name %>.js"]
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
                }
            },
            options: {
                jshintrc: true
            }
        },

        jscs: {
            all: ["src/*.js", "test/*Spec.js"],
            options: {
                config: ".jscsrc"
            }
        },

        run: {
            jest: {
                cmd: "jest",
                args: ["--coverage"]
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-run");

    // Default task(s).
    grunt.registerTask("default", ["browserify:dist", "uglify"]);
    grunt.registerTask("test", ["jshint", "jscs", "run:jest"]);

};
