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
    return browserify('src/js/output.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dest/'));
});
//'src/typings/bundle.d.ts'
gulp.task('compile', function(){
    var tsResult = gulp.src(['src/ts/*.ts'])
		.pipe(ts(tsProject));

    return tsResult.js
            .pipe(gulp.dest('out/src/ts'))
            .pipe(gulp.dest('src/js'))
			.pipe(concat('output.js'))
			.pipe(gulp.dest('src/js'));
});

var testCompile = function(){
    var tsResult = gulp.src('src/test/*.ts')
        .pipe(ts({
            module: 'commonjs'
        }));
    return tsResult.js.pipe(gulp.dest('out/src/test'));
};

gulp.task('test-compile', ['compile'], testCompile);

var testRun = function(){
    return gulp.src('out/src/test/*.js')
        .pipe(jasmine({
            verbose: true
        }));
};

gulp.task('jasmine', ['test-compile'], testRun);

gulp.task('test-compile-only', testCompile);

gulp.task('test-only', ['test-compile-only'], testRun);
