module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // compile Sass - with standard sourcemaps
        sass: {
            dest: {
                options: {
                    style: "compressed",
                    sourcemap: "file"
                },

                files: {
                    "css/style.css": "scss/style.scss"
                }
            }
        },

        /// Auto prefix our CSS 
        postcss: {
            options: {
                map: {
                    prev: false,
                    inline: false, // save all sourcemaps as separate files... 
                    annotation: "css/" // ...to the specified directory 
                },

                processors: [
                    // add vendor prefixes 
                    require("autoprefixer")({
                        browsers: [
                            "last 2 versions",
                            "> 3% in US",
                            "> 3% in CA"
                        ]
                    }),
                    // combine our media queries
                    require("css-mqpacker")({
                        sort: true
                    })
                ]
            },
            dist: {
                src: "css/*.css"
            }
        },

        // watch these files and do these tasks when something changes
        watch: {
            css: {
                files: ["scss/**/*.scss"],
                tasks: ["sass", "postcss"]
            },
            html: {
                files: ["**/*.html"],
                options: {
                    reload: true
                }
            },
            configFile: {
                files: [ "Gruntfile.js"]
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/style.css', 
                        '**/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: 'mandy.dev/' 
                }
            }
        },

        // Notify us only when there's a problem
        notify_hooks: {
            options: {
                enabled: true,
                success: false, // whether successful grunt executions should be notified automatically
                duration: 2.5, // the duration of notification in seconds, for `notify-send only
                title: "OH SNAP!! Looks like there's an issue:", 
                message: "Houston, we have a problem..."
            }
        }
    });

    // Grunt  plug-in list.
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks("grunt-contrib-sass"); 
    grunt.loadNpmTasks("grunt-contrib-watch"); 
    grunt.loadNpmTasks("grunt-notify");
    grunt.loadNpmTasks("grunt-postcss"); 

    //'grunt' for development tasks.
    grunt.registerTask("default", ["sass", "postcss", "notify_hooks", 'browserSync', "watch"]);

    //'grunt build' for production tasks.
    grunt.registerTask("build", ["sass", "postcss"]);

};