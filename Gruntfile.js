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

            test: {
                files: {
                  "test/<%= pkg.name %>.test.js": ["src/tests.js"],
                },
                options: {
                    browserifyOptions: {
                        "standalone": "StoneTest"
                    }
                }
            }
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
                    src: ["test/*Spec.js"]
                },
                options: {
                    jasmine: true,
                    globals: {
                        StoneTest: false
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

        jscs: {
            all: ["src/*.js", "test/*Spec.js"],
            options: {
                config: ".jscsrc"
            }
        },

        jasmine: {
            pivotal: {
                src: "test/*.test.js",
                options: {
                    specs: "test/*Spec.js"
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");

    // Default task(s).
    grunt.registerTask("default", ["browserify:dist", "uglify"]);
    grunt.registerTask("test", ["browserify:test", "jshint", "jscs", "jasmine"]);

};
