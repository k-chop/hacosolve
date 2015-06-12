/// <reference path="./src/typings/gulp/gulp.d.ts"/>
/// <reference path="./src/typings/gulp/gulp-typescript.d.ts"/>

var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', () => {
    var tsResult = tsProject.src()
    	.pipe(sourcemaps.init())
		.pipe(ts(tsProject));

	return tsResult.js
			.pipe(concat('output.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dest/js'));
});

