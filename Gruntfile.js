module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appFolder: 'app',
        distFolder: 'dist',
        generatedFile: '<%= distFolder %>/scripts/<%= pkg.name %>.js',
        bowerFolder: grunt.file.readJSON('.bowerrc').directory,

        browserify: {
            files: {
                src: '<%= appFolder %>/scripts/**/*.js',
                dest: '<%= generatedFile %>'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '<%= distFolder %>',
                    livereload: true,
                    open: true
                }
            }
        },
        clean: {
            dist: {
                src: ['./<%= distFolder %>/**']
            }
        },
        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= distFolder %>/',
                    src: '**'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: '<%= appFolder %>',
                src: ['**/*', '!scripts/**'],
                dest: '<%= distFolder %>/'
            }
        },
        jshint: {
            files: [
                'Grunfile.js',
                '<%= appFolder %>/**/*.js',
                '<%= appFolder %>/scripts/*.js',
                '<%= appFolder %>/scripts/**/*.js',
                '!<%= bowerFolder %>/**'
            ],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        ngAnnotate: {
            target: {
                files: {
                    '<%= distFolder %>/scripts/<%= pkg.name %>.js': ['<%= distFolder %>/scripts/<%= pkg.name %>.js']
                }
            },
        },
        uglify: {
            target: {
                files: {
                    '<%= distFolder %>/scripts/<%= pkg.name %>.min.js': ['<%= distFolder %>/scripts/<%= pkg.name %>.js']
                }
            }
        },
        watch: {
            app: {
                files: ['<%= appFolder %>/**/*', '!<%= appFolder %>/scripts/**'],
                tasks: ['copy:main']
            },
            js: {
                files: ['<%= appFolder %>/scripts/**/*.js'],
                tasks: ['jshint', 'browserify']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint']
            },
            bower: {
                files: ['bower.json', '<%= bowerFolder %>/*'],
                tasks: ['wiredep', 'copy:main']
            },
            options: {
                livereload: true
            }
        },
        wiredep: {
            app: {
                src: ['<%= appFolder %>/index.html']
            }
        }
    });

    grunt.registerTask('build', function() {
        grunt.task.run(['wiredep', 'jshint', 'clean', 'browserify', 'copy', 'ngAnnotate', 'uglify']);
    });

    grunt.registerTask('package', function() {
        grunt.task.run(['build', 'compress']);
    });

    grunt.registerTask('serve', function() {
        grunt.task.run(['build', 'connect:server', 'watch']);
    });

};