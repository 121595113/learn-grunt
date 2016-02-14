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

            },
        },

        clean: {
            build: {
                src: ['<%= config.dist %>']
            },
            server: {
                src: [
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
                    importPath: '<%= config.app %>/_source/_function/',
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
                    // ext: '.css'
                }]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images/',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images/'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.{ico,png}',
                    dest: '<%= config.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>/pic/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/pic/'
                }]
            }
        },

        uglify: {
            options: {
                banner: '/*! 项目名称：<%= pkg.name %> 版本：<%= pkg.version %> ' +
                    '时间：<%= grunt.template.today("yyyy-mm-dd") %> 作者：<%= pkg.author %>*/\n'
            },
            build: {
                // 动态文件映射，
                // 当任务运行时会自动在 "src/bin/" 目录下查找 "**/*.js" 并构建文件映射，
                // 添加或删除文件时不需要更新 Gruntfile。
                files: [{
                    expand: true, // 启用动态扩展
                    cwd: '<%= config.app %>/script/', // 源文件匹配都相对此目录
                    src: ['**/*.js'], // 匹配模式
                    dest: '<%= config.dist %>/script/', // 目标路径前缀
                    ext: '.js', // 目标文件路径中文件的扩展名
                    extDot: 'last' // 扩展名始于文件名的第一个点号
                }, ],
            }
        },

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
                        '<%= config.app %>/**/*.css',
                        '<%= config.app %>/images/{,*/}*',
                        '<%= config.app %>/**/*.js'
                    ],
                    port: 9000,
                    server: {
                        baseDir: ['<%= config.app %>'],
                        index:"home.html"
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
        'uglify',
        'copy',
    ]);

    grunt.registerTask('default', '默认任务', [
        'build'
    ]);

};
