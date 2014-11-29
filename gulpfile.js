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
var browserify = require('gulp-browserify');

var paths = {
  js: ['game/**/*.js', 'game.js', '!game/js/gen/**'],
  scss: ['game/**/*.scss'],
  css: ['game/css'],
  tests: ['tests/**/*.js'],
  genjs: ['game/js/gen/**']
};


gulp.task('delete-generated', function (cb) {
    del(paths.css, cb);
    del(paths.genjs)
});
gulp.task('clean', ['delete-generated']);

gulp.task('lint-code', function () {
    gulp.src(paths.js)
        .pipe(jslint({
            node: true,
            vars: true,
            nomen: true,
            unparam: true
        }));
});
gulp.task('lint-scss', function () {
    return gulp.src(paths.scss)
        .pipe(scsslint());
});
gulp.task('lint', ['lint-code', 'lint-scss']);

gulp.task('test', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build-code', function() {
    gulp.src('./game/js/practice.js')
        .pipe(browserify({
            debug: false
            // transform: [reactify]
        }))
        .pipe(source('primary.js'))
        .pipe(gulp.dest('./game/js/gen'));
});
gulp.task('build-styles', function() {
    return gulp.src(paths.scss)
        .pipe(sass({ style: 'expanded', sourcemapPath: 'public/css' }))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(flatten())
        .pipe(gulp.dest('game/css'));
});
gulp.task('build', ['build-styles', 'build-code'])


gulp.task('server:start', function () {
    server.listen({path: './game.js'});
});

// gulp.task('browatchify', function () {
//     gulp.src('./game/js/practice.js')
//         .pipe(browatchify({
//             debug: !gulp.env.production,
//             transforms: [reactify]
//         }))
//         .pipe(source('primary.js'))
//         .pipe(gulp.dest('./game/js/gen'));
// });

// gulp.task('server:restart', ['browatchify', 'server:start'], function () {
//     function restart(file) {
//         server.changed(function (error) {
//             if (!error) { livereload.changed(file.path); }
//         });
//     }

//     gulp.watch(['./game.js', "game/js/**/*.js", "inch/public/js/**/*.js"], { interval: 500 }, ['browatchify']).on('change', restart);
// });

gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint-code', 'test', 'build-code']);
  gulp.watch(paths.scss, ['clean', 'lint-scss', 'build-styles']);
});

gulp.task('default', ['clean', 'lint', 'test', 'build']);
gulp.task('local', ['clean', 'lint', 'test', 'build', 'watch']);