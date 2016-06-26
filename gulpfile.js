var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var destFolder = "../problem-solving-list-dist";

var cssFiles = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'css/*.css'
];
var jsFiles = [
    'js/script.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/angular/angular.min.js',
    'apigee/apigee.min.js',
    'js/app.js'
];
var resFiles = [
    'res/**/*'
];

gulp.task('build-css', function () {
    return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destFolder + '/css'));
});

gulp.task('build-js', function () {
    return gulp.src(jsFiles)
        .pipe(uglify())
        .pipe(gulp.dest(destFolder + '/js'));
});

gulp.task('build-index', function () {
    var source = gulp.src([
        'dist/js/*.js',
        'dist/css/*.css'
    ], {
        read: false
    });
    return gulp.src('index.html')
        .pipe(inject(source))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destFolder));
});

gulp.task('build-views', function () {
    return gulp.src('views/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destFolder + '/views'))
});

gulp.task('build-resource', function () {
    return gulp.src(resFiles)
        .pipe(gulp.dest(destFolder + '/res'))
});

// build all and put them in dist
gulp.task('build', ['build-css', 'build-js', 'build-index', 'build-views', 'build-resource']);

// just inject html and css files
gulp.task('default', function () {
    var source = gulp.src(
        jsFiles.concat(cssFiles), {
            read: false
        });
    return gulp.src('index.html')
        .pipe(inject(source))
        .pipe(gulp.dest(''));
});