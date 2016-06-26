/**
 *  To clean use "gulp clean"
 *  To build use "gulp build"
 *  To inject css and js files in index.html use "gulp"
 *  Define file paths in "gulp-options.js" file
 */

var path = require('path'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    inject = require('gulp-inject'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    print = require('gulp-print'),
    clean = require('gulp-clean');


var destination = './dist',
    cssToImport = [
        './css/**/*.css'
    ],
    jsToImport = [
        './js/**/*.js'
    ],
    htmlToImport = [
        './views/**/*.html',
        './index.html'
    ],
    resourceToImport = [
        './res/**/*.*',
        './apigee/apigee.min.js',
        './bower_components/**/*.*'
    ];

gulp.task('clean', function () {
    return gulp.src(destination, {read: false})
        .pipe(clean());
});

gulp.task('css', function () {
    return gulp.src(cssToImport, {base: './'})
        //.pipe(sourcemaps.init())
        .pipe(cleanCSS())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(destination));
});

gulp.task('js', function () {
    pump([
        gulp.src(jsToImport, {base: './'}),
        uglify(),
        gulp.dest('dist')
    ]);
});

gulp.task('html', function () {
    return gulp.src(htmlToImport, {base: './'})
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destination));
});

gulp.task('resource', function () {
    return gulp.src(resourceToImport, {base: './'})
        .pipe(gulp.dest(destination));
});


gulp.task('build', ['css', 'js', 'html', 'resource']);
