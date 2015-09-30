/**
 * Created by Nishant on 9/30/2015.
 */
module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/js/app.js', 'app/js/controllers.js', 'app/js/directives.js', 'app/js/filters.js', 'app/js/services.js'],
                dest: 'build/script.js'
            }
        },
        uglify: {
            options: {

            },
            build: {
                src: 'build/script.js',
                dest: 'build/script.min.js'
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);
};