"use strict";

var gulp = require('gulp');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var jslint = require('gulp-jslint');
var source = require('vinyl-source-stream');
var browatchify = require('gulp-browatchify');
var reactify = require('reactify');
var csslint = require('gulp-csslint');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var scsslint = require('gulp-scss-lint');
var flatten = require('gulp-flatten');

gulp.task('delete-generated', function (cb) {
    del('game/css', cb);
});
gulp.task('clean', ['delete-generated']);

gulp.task('lint-code', function () {
    gulp.src(['game/**/*.js', 'game.js', '!game/js/gen/**'])
        .pipe(jslint({
            node: true,
            vars: true,
            nomen: true,
            unparam: true
        }));
});
gulp.task('lint-scss', function () {
    return gulp.src('src/**/*.scss')
        .pipe(scsslint());
});
gulp.task('lint', ['lint-code', 'lint-scss']);

gulp.task('test', function () {
    return gulp.src('tests/**/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build-styles', function() {
    return gulp.src('game/**/*.scss')
        .pipe(sass({ style: 'expanded', sourcemapPath: 'public/css' }))
        // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(flatten())
        .pipe(gulp.dest('game/css'));
});
gulp.task('build', ['build-styles'])


gulp.task('server:start', function () {
    server.listen({path: './game.js'});
});

gulp.task('browatchify', function () {
    gulp.src('./game/js/practice.js')
        .pipe(browatchify({
            debug: true,
            transforms: [reactify]
        }))
        .pipe(source('primary.js'))
        .pipe(gulp.dest('./game/js/gen'));
});

gulp.task('server:restart', ['browatchify', 'server:start'], function () {
    function restart(file) {
        server.changed(function (error) {
            if (!error) { livereload.changed(file.path); }
        });
    }

    gulp.watch(['./game.js', "game/js/**/*.js", "inch/public/js/**/*.js"], { interval: 500 }, ['browatchify']).on('change', restart);
});


gulp.task('default', ['clean', 'lint', 'test', 'build', 'browatchify']);