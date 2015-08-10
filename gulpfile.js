/// <reference path="./src/typings/gulp/gulp.d.ts"/>

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var shell = require('gulp-shell');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['jasmine']);

gulp.task('build', ['compile'], function(){
    return browserify('src/ts/output.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dest/'));
});
//'src/typings/bundle.d.ts'
gulp.task('compile', function(){
    var tsResult = gulp.src(['src/ts/*.ts'])
		.pipe(ts(tsProject));

    return tsResult.js
			.pipe(concat('output.js'))
			.pipe(gulp.dest('src/ts'));
});

gulp.task('test-compile', ['compile'], function(){
    var tsResult = gulp.src('spec/*.ts')
        .pipe(ts({
            module: 'commonjs'
        }));
    return tsResult.js.pipe(gulp.dest('spec'));
});

gulp.task('jasmine', ['test-compile'], function(){
    return gulp.src('spec/*.js')
        .pipe(jasmine({
            verbose: true
        }));
});
