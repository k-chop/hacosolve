/// <reference path="./src/typings/gulp/gulp.d.ts"/>
/// <reference path="./src/typings/gulp/gulp-typescript.d.ts"/>

var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', () => {
    var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest('dest/js'));
});

