/// <reference path="./src/typings/gulp/gulp.d.ts"/>

import gulp = require('gulp');
var source = require('vinyl-source-stream');
var shell = require('gulp-shell');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['compile', 'test']);

gulp.task('build', ['compile'], () => {
    return browserify('src/ts/output.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dest/'));
});

gulp.task('compile', () => {
    var tsResult = gulp.src(['src/ts/*.ts',
        'src/typings/bundle.d.ts'])
    	.pipe(sourcemaps.init())
		.pipe(ts(tsProject));

    return tsResult.js
            .pipe(gulp.dest('src/ts'))
			.pipe(concat('output.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('src/ts'));
});

gulp.task('test', ['compile'], () => {
    var tsResult = gulp.src('spec/*.ts')
        .pipe(ts({
            module: 'commonjs'
        }));
    return tsResult.js.pipe(gulp.dest('spec'));
});
