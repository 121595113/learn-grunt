'use strict';
module.exports = function(grunt) {
    // 加载任务
    require('jit-grunt')(grunt);
    // 计算任务所需时间
    require('time-grunt')(grunt);
    // 配置项目路径
    var config = {
        app: 'app',
        dist: 'dist'
    }

    // 配置任务
    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            build: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '{,*/}*.html',
                ],
                // src: [
                //   '*.{ico,png,txt}',
                //   'images/{,*/}*.webp',
                //   '{,*/}*.html',
                //   'styles/fonts/{,*/}*.*'
                // ]
            },
        },

        clean: {
            build: {
                src: ['<%= config.dist %>']
            },
            server: {
                src: [
                    '<%= config.app %>/css',
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.dist %>/css',
                    '<%= config.dist %>/images',
                    '<%= config.dist %>/*.{gif,jpeg,jpg,png}',
                ]
            },
            scripts: {
                src: ['<%= config.dist %>/**/*.js', '!<%= config.dist %>/application.js']
            },
        },


        compass: {
            development: {
                options: {
                    sassDir: '<%= config.app %>/_source/sass/',
                    cssDir: '<%= config.app %>/css/',
                    imagesDir: '<%= config.app %>/images/',
                    relativeAssets: true,
                    outputStyle: 'expanded',
                    sourcemap: true,
                    noLineComments: true,
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixed styles
                    require('autoprefixer')({
                        browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR']
                    })
                ]
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= config.app %>/css/'
                }]
            }
        },

        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css',
                    src: ['{,*/}*.css'],
                    dest: '<%= config.dist %>/css',
                    ext: '.css'
                }]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images/'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.{ico,png}',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // uglify: {
        //     build: {
        //         options: {
        //             mangle: false
        //         },
        //         files: {
        //             '<%= config.dist %>/application.js': ['<%= config.dist %>/**/*.js']
        //         }
        //     }
        // },

        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: function(dest, src) {
                        return require('./app/_source/jade/data/data.json');
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/_source/jade/',
                    src: ['**/*.jade', '!components/*', '!layout/*', '!data/*'],
                    dest: '<%= config.app %>/',
                    ext: '.html'
                }]
            }
        },

        watch: {
            compass: {
                files: '<%= config.app %>/_source/sass/**/*.scss',
                tasks: ['compass', 'newer:postcss']
            },
            jade: {
                files: '<%= config.app %>/**/*.jade',
                tasks: ['newer:jade']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '<%= config.app %>',
                    hostname: '*'
                }
            }
        },

        browserSync: {
          options: {
            notify: false,
            background: true,
            watchOptions: {
              ignored: ''
            }
          },
          livereload: {
            options: {
              files: [
                '<%= config.app %>/{,*/}*.html',
                '<%= config.app %>/{,*/}*.css',
                '<%= config.app %>/images/{,*/}*',
                '<%= config.app %>/{,*/}*.js'
              ],
              port: 9000,
              server: {
                baseDir: ['<%= config.app %>'],
                
              }
            }
          }
        },


    });



    // 定义任务

    // 对js的处理
    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.', ['coffee', 'uglify', 'clean:scripts']
    );

    grunt.registerTask('server', '开启开发模式', function(target) {
        grunt.log.warn('开启开发模式');
        grunt.task.run([
            'clean:server',
            'compass',
            'postcss',
            'cssmin',
            'imagemin',
            'jade',
            'copy',
            'browserSync:livereload',
            // 'connect',
            'watch'
        ]);

    });

    grunt.registerTask('build', '开启生产模式', [
        'clean:build',
        'compass',
        'postcss',
        'cssmin',
        'imagemin',
        'jade',
        'copy',
    ]);

    grunt.registerTask('default', '默认任务', [
        'build'
    ]);

};
