/// <reference path="./src/typings/gulp/gulp.d.ts"/>

import gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['test'], () => {
    var tsResult = gulp.src(['src/ts/*.ts',
        'src/typings/bundle.d.ts'])
    	.pipe(sourcemaps.init())
		.pipe(ts(tsProject));

    return tsResult.js
            .pipe(gulp.dest('src/ts'))
			.pipe(concat('output.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dest/js'));
});

gulp.task('test', () => {
    var tsResult = gulp.src('spec/*.ts')
        .pipe(ts({
            module: 'commonjs'
        }));
    return tsResult.js.pipe(gulp.dest('spec'));
});
