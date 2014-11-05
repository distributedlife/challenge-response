"use strict";

var gulp = require('gulp');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var jslint = require('gulp-jslint');
var source = require('vinyl-source-stream');
var browserify = require('gulp-browatchify');
var reactify = require('reactify');
var csslint = require('gulp-csslint');

gulp.task('server:start', function () {
    server.listen({path: './game.js'});
});

gulp.task('lint', function () {
    gulp.src('**/*.js')
        .pipe(jslint({
            node: true,
            vars: true
        }));
    gulp.src('**/css/**/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('browserify', function () {
    gulp.src('./game/js/practice.js')
        .pipe(browserify({
            debug: true,
            transforms: [reactify]
        }))
        .pipe(source('primary.js'))
        .pipe(gulp.dest('./game/js/gen'));
});


gulp.task('server:restart', ['browserify', 'server:start'], function () {
    function restart(file) {
        server.changed(function (error) {
            if (!error) { livereload.changed(file.path); }
        });
    }

    gulp.watch(['./game.js', "game/js/**/*.js", "inch/public/js/**/*.js"], ['browserify']).on('change', restart);
});


gulp.task('default', ['lint', 'browserify']);