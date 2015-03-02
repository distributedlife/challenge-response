"use strict";

var gulp = require('gulp');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var scsslint = require('gulp-scss-lint');
var flatten = require('gulp-flatten');
var browserify = require('browserify');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');

var paths = {
  js: ['game/**/*.js', 'game.js', '!game/js/gen/**', 'plugins/**/*.js'],
  scss: ['game/**/*.scss'],
  css: ['game/css'],
  tests: ['tests/**/*.js'],
  genjs: './game/js/gen',
  modes: ['./game/js/practice.js', './game/js/8seconds.js']
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
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});
gulp.task('lint-scss', function () {
    return gulp.src(paths.scss)
        .pipe(plumber({errorHandler: onError}))
        .pipe(scsslint({ 'bundleExec': true }));
});
gulp.task('lint', ['lint-code', 'lint-scss']);

gulp.task('test', ['clean'], function (cb) {
    gulp.src(paths.js)
        .pipe(plumber({errorHandler: onError}))
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['tests/**/*.js'])
                .pipe(mocha({reporter: 'spec'}))
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});

gulp.task('coveralls', ['test'], function() {
  return gulp.src(['coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('build-code', function() {
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(paths.modes)
        .pipe(plumber({errorHandler: onError}))
        .pipe(browserified)
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.genjs));
});
gulp.task('build-styles', function() {
    return gulp.src(paths.scss)
        .pipe(plumber({errorHandler: onError}))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sass({ style: 'expanded', sourcemapPath: 'public/css', bundleExec: true }))
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

gulp.task('default', ['lint', 'test', 'build']);
gulp.task('local', ['default', 'watch']);