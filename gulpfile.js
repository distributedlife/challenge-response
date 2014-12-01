"use strict";

var gulp = require('gulp');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var reactify = require('reactify');
var csslint = require('gulp-csslint');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var scsslint = require('gulp-scss-lint');
var flatten = require('gulp-flatten');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var paths = {
  js: ['game/**/*.js', 'game.js', '!game/js/gen/**'],
  scss: ['game/**/*.scss'],
  css: ['game/css'],
  tests: ['tests/**/*.js'],
  genjs: './game/js/gen'
};

var onError = function (error) {
    console.log(error);
    this.emit('end');
};

gulp.task('delete-gen-css', function (cb) {
    del(paths.css, cb);
});
gulp.task('delete-gen-code', function (cb) {
    del(paths.genjs, cb)
});
gulp.task('clean', ['delete-gen-css', 'delete-gen-code']);

gulp.task('lint-code', function () {
    gulp.src(paths.js)
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint({
            node: true
        }))
        .pipe(jshint.reporter('default', { verbose: true }));
});
gulp.task('lint-scss', function () {
    return gulp.src(paths.scss)
        .pipe(plumber({errorHandler: onError}))
        .pipe(scsslint());
});
gulp.task('lint', ['lint-code', 'lint-scss']);

gulp.task('test', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(plumber({errorHandler: onError}))
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build-code', function() {
    gulp.src('./game/js/practice.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(browserify({
            debug: false,
            transform: [reactify]
        }))
        // .pipe(uglify())
        .pipe(rename('primary.js'))
        .pipe(gulp.dest(paths.genjs));
});
gulp.task('build-styles', function() {
    return gulp.src(paths.scss)
        .pipe(plumber({errorHandler: onError}))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sass({ style: 'expanded', sourcemapPath: 'public/css' }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(flatten())
        .pipe(gulp.dest('game/css'));
});
gulp.task('build', ['build-styles', 'build-code'])

gulp.task('server:start', function () {
    server.listen({path: './game.js'});
});

gulp.task('watch', ['server:start'], function() {
    function restart(file) {
        server.changed(function (error) {
            if (!error) { livereload.changed(file.path); }
        });
    };

    livereload.listen();
    gulp.watch(paths.js, ['delete-gen-code', 'lint-code', 'test', 'build-code']).on('change', restart);
    gulp.watch(paths.scss, ['delete-gen-css', 'lint-scss', 'build-styles']).on('change', restart);
});

gulp.task('default', ['clean', 'lint', 'test', 'build']);
gulp.task('local', ['default', 'watch']);