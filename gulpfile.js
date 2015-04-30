'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var karma = require('gulp-karma');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

var pkg = require('./package.json');

var testFiles = [
    'test/*'
];

gulp.task('bower', function() {
    return bower();
});

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

gulp.task('clean', function () {
    return gulp.src('./dist/', {read: false})
        .pipe(clean());
});

gulp.task('concat', function() {
    return gulp.src('./src/*.js')
        .pipe(concat(pkg.name +'.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('annotate', function () {
    return gulp.src('./src/*.js')
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', ['concat', 'annotate'], function() {
    return gulp.src('./dist/*.js')
        .pipe(uglify({ outSourceMap: true }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['bower', 'test', 'clean', 'concat', 'annotate', 'compress']);